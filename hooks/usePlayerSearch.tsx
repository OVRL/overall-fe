import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";
import { Player } from "@/types/formation";
import {
  useRelayEnvironment,
  useLazyLoadQuery,
  fetchQuery,
  commitMutation,
} from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import { SearchTeamMemberQuery } from "@/lib/relay/queries/searchTeamMemberQuery";
import { CreateMatchAttendanceMutation } from "@/lib/relay/mutations/createMatchAttendanceMutation";
import { UpdateMatchAttendanceMutation } from "@/lib/relay/mutations/updateMatchAttendanceMutation";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import type { searchTeamMemberQuery } from "@/__generated__/searchTeamMemberQuery.graphql";
import type { createMatchAttendanceMutation } from "@/__generated__/createMatchAttendanceMutation.graphql";
import type { updateMatchAttendanceMutation } from "@/__generated__/updateMatchAttendanceMutation.graphql";

import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";

const MERCENARY_NAME_SUFFIX = " (용병)";

/** UI 표시용 접미사를 제거한 참석자 이름(createMatchAttendance `name` 입력용) */
function mercenaryNameForAttendanceInput(displayName: string): string {
  return displayName.endsWith(MERCENARY_NAME_SUFFIX)
    ? displayName.slice(0, -MERCENARY_NAME_SUFFIX.length).trim()
    : displayName.trim();
}

interface UsePlayerSearchProps {
  matchId: number;
  teamId: number;
}

export type AttendanceStatus = "ATTEND" | "ABSENT";

export interface PendingPlayerItem extends Player {
  teamMemberId: number;
  userId: number;
  memberType: "MEMBER" | "MERCENARY";
  originalStatus?: AttendanceStatus | null;
  currentStatus: AttendanceStatus | null; // null if neither
}

function mapTeamMemberToPlayerProps(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tm: any,
): Omit<PendingPlayerItem, "currentStatus" | "originalStatus"> {
  const user = tm.user;
  const memberPref = tm.preferredNumber;
  const userPref = user?.preferredNumber;
  const number =
    memberPref != null
      ? memberPref
      : userPref != null
        ? Math.round(userPref)
        : 0;
  const name = user?.name?.trim() || "이름 없음";
  const position = tm.preferredPosition ?? "ST";
  const overall = tm.overall?.ovr ?? 0;

  const profileRaw = getTeamMemberProfileImageRawUrl({
    profileImg: tm.profileImg,
    user: tm.user ?? undefined,
  });
  const imageFallbackUrl = getTeamMemberProfileImageFallbackUrl({
    id: tm.id,
    user: tm.user ?? undefined,
  });

  return {
    id: tm.id,
    teamMemberId: tm.id,
    userId: Number(tm.userId ?? user.id),
    memberType: "MEMBER",
    name,
    position,
    number,
    overall,
    image: profileRaw || undefined,
    imageFallbackUrl,
  };
}

export const usePlayerSearch = ({ matchId, teamId }: UsePlayerSearchProps) => {
  const { hideModal } = useModal();
  const environment = useRelayEnvironment();

  // Load current attendance from Relay local store / network
  const attendanceData = useLazyLoadQuery<formationMatchAttendanceQuery>(
    FormationMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-and-network" },
  );

  const [inputValue, setInputValue] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [rawSearchResults, setRawSearchResults] = useState<
    NonNullable<searchTeamMemberQuery["response"]["searchTeamMember"]>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map: teamMemberId -> Target AttendanceStatus
  const [pendingChanges, setPendingChanges] = useState<
    Map<number, PendingPlayerItem>
  >(new Map());

  // Quick lookup for existing attendance
  const attendanceMap = useMemo(() => {
    const map = new Map();
    attendanceData.findMatchAttendance?.forEach((att) => {
      if (att && att.teamMember) {
        map.set(att.teamMember.id, att);
      }
    });
    return map;
  }, [attendanceData]);

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedKeyword(value.trim());
  }, 300);

  useEffect(() => {
    debouncedUpdate(inputValue);
  }, [inputValue, debouncedUpdate]);

  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!debouncedKeyword) {
        if (isMounted) setRawSearchResults([]);
        return;
      }

      if (isMounted) setIsSearching(true);

      try {
        const result = await fetchQuery<searchTeamMemberQuery>(
          environment,
          SearchTeamMemberQuery,
          { name: debouncedKeyword, teamId },
          { fetchPolicy: "network-only" },
        ).toPromise();

        if (isMounted && result?.searchTeamMember) {
          setRawSearchResults(result.searchTeamMember);
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    performSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedKeyword, environment, teamId]);

  const searchResults = useMemo<PendingPlayerItem[]>(() => {
    return rawSearchResults.map((tm) => {
      const base = mapTeamMemberToPlayerProps(tm);
      const existing = attendanceMap.get(tm.id);
      const targetStatus = pendingChanges.has(tm.id)
        ? pendingChanges.get(tm.id)!.currentStatus
        : ((existing?.attendanceStatus as AttendanceStatus | undefined) ??
          null);

      return {
        ...base,
        originalStatus: existing?.attendanceStatus as
          | AttendanceStatus
          | undefined,
        currentStatus: targetStatus,
      };
    });
  }, [rawSearchResults, attendanceMap, pendingChanges]);

  // Derived Mercenary logic
  const mercenaryPlayer = useMemo(() => {
    if (!inputValue.trim()) return null;
    // Check if the exact name exists in search results to avoid duplicate mercenary adding
    if (searchResults.some((p) => p.name === inputValue.trim())) return null;

    // Use a negative ID to represent a new mercenary temporarily
    const tmId = -1;
    const currentStatus = pendingChanges.has(tmId)
      ? pendingChanges.get(tmId)!.currentStatus
      : null;

    return {
      id: tmId,
      teamMemberId: tmId,
      userId: 0,
      memberType: "MERCENARY",
      name: `${inputValue.trim()}${MERCENARY_NAME_SUFFIX}`,
      position: "용병",
      number: 0,
      overall: 0,
      imageFallbackUrl: null,
      currentStatus,
      originalStatus: null,
    } as PendingPlayerItem;
  }, [inputValue, searchResults, pendingChanges]);

  const handleToggleAttendance = useCallback((player: PendingPlayerItem) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      const newStatus = player.currentStatus === "ATTEND" ? "ABSENT" : "ATTEND";

      const isRevertedBackToOriginal = newStatus === player.originalStatus;
      const isNewRecordReverted =
        player.originalStatus == null && newStatus === "ABSENT";

      if (isRevertedBackToOriginal || isNewRecordReverted) {
        next.delete(player.teamMemberId);
      } else {
        next.set(player.teamMemberId, { ...player, currentStatus: newStatus });
      }

      return next;
    });
  }, []);

  const handleComplete = async () => {
    setIsSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: Promise<any>[] = [];

    for (const [teamMemberId, player] of Array.from(pendingChanges.entries())) {
      const existing = attendanceMap.get(teamMemberId);
      const targetStatus = player.currentStatus!;

      if (existing) {
        // Update existing attendance
        if (existing.attendanceStatus !== targetStatus) {
          const attendanceRowId = parseMatchIdForApi(existing.id);
          if (attendanceRowId == null) {
            promises.push(
              Promise.reject(
                new Error(
                  `참석 레코드 ID를 숫자로 변환할 수 없습니다: ${String(existing.id)}`,
                ),
              ),
            );
            continue;
          }
          promises.push(
            new Promise((resolve, reject) => {
              commitMutation<updateMatchAttendanceMutation>(environment, {
                mutation: UpdateMatchAttendanceMutation,
                variables: {
                  input: {
                    id: attendanceRowId,
                    teamId,
                    attendanceStatus: targetStatus,
                  },
                },
                onCompleted: resolve,
                onError: reject,
              });
            }),
          );
        }
      } else {
        // Create new attendance
        promises.push(
          new Promise((resolve, reject) => {
            commitMutation<createMatchAttendanceMutation>(environment, {
              mutation: CreateMatchAttendanceMutation,
              variables: {
                input: {
                  matchId,
                  teamId,
                  userId: player.userId,
                  attendanceStatus: targetStatus,
                  memberType: player.memberType,
                  ...(player.memberType === "MERCENARY" && {
                    name: mercenaryNameForAttendanceInput(player.name),
                  }),
                },
              },
              onCompleted: resolve,
              onError: reject,
            });
          }),
        );
      }
    }

    try {
      if (promises.length > 0) {
        await Promise.all(promises);
        // Force refresh Relay's local store for findMatchAttendance
        await fetchQuery(
          environment,
          FormationMatchAttendanceQuery,
          { matchId, teamId },
          { fetchPolicy: "network-only" },
        ).toPromise();
      }

      hideModal();
    } catch (err) {
      console.error("Failed to commit match attendance changes", err);
      // Handle error gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading =
    isSearching ||
    (inputValue.trim() !== "" && inputValue !== debouncedKeyword) ||
    isSubmitting;

  return {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    pendingChanges,
    mercenaryPlayer,
    isSearching: isLoading,
    handleToggleAttendance,
    handleComplete,
    hideModal,
  };
};
