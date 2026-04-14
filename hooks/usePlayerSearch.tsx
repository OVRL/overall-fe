import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";
import {
  useRelayEnvironment,
  useLazyLoadQuery,
  fetchQuery,
} from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import { SearchTeamMemberQuery } from "@/lib/relay/queries/searchTeamMemberQuery";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import type { searchTeamMemberQuery } from "@/__generated__/searchTeamMemberQuery.graphql";
import { mapSearchTeamMemberToRosterModalRow } from "@/lib/formation/roster/mapSearchTeamMemberToRosterModalRow";
import { commitFormationRosterModalMutations } from "@/lib/formation/roster/commitFormationRosterModalMutations";
import type {
  MercenaryDraftRow,
  MercenaryExistingRow,
  PendingTeamMemberRow,
  RosterModalAttendanceStatus,
} from "@/types/formationRosterModal";
import { toast } from "@/lib/toast";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";

const MERCENARY_NAME_SUFFIX = " (용병)";

export type { PendingTeamMemberRow } from "@/types/formationRosterModal";

interface UsePlayerSearchProps {
  matchId: number;
  teamId: number;
}

function mercenaryDisplayName(registerName: string): string {
  const t = registerName.trim();
  return t ? `${t}${MERCENARY_NAME_SUFFIX}` : `용병${MERCENARY_NAME_SUFFIX}`;
}

export const usePlayerSearch = ({ matchId, teamId }: UsePlayerSearchProps) => {
  const { hideModal } = useModal();
  const environment = useRelayEnvironment();

  const rosterData = useLazyLoadQuery<formationMatchAttendanceQuery>(
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

  const [pendingTeamMembers, setPendingTeamMembers] = useState<
    Map<number, PendingTeamMemberRow>
  >(new Map());
  const [pendingMercenaryCreates, setPendingMercenaryCreates] = useState<
    Set<string>
  >(new Set());
  const [pendingMercenaryDeletes, setPendingMercenaryDeletes] = useState<
    Set<number>
  >(new Set());

  const attendanceByTeamMemberId = useMemo(() => {
    const map = new Map<
      number,
      NonNullable<
        formationMatchAttendanceQuery["response"]["findMatchAttendance"]
      >[number]
    >();
    rosterData.findMatchAttendance?.forEach((att) => {
      if (att?.teamMember) {
        map.set(att.teamMember.id, att);
      }
    });
    return map;
  }, [rosterData]);

  const existingMercenaries = useMemo((): MercenaryExistingRow[] => {
    const rows = rosterData.matchMercenaries ?? [];
    return rows
      .filter(
        (m): m is NonNullable<typeof m> =>
          m != null && m.teamId === teamId,
      )
      .map((m) => ({
        kind: "MERCENARY_EXISTING" as const,
        mercenaryId: m.id,
        name: m.name.trim() || "이름 없음",
        pendingRemove: pendingMercenaryDeletes.has(m.id),
      }));
  }, [rosterData.matchMercenaries, teamId, pendingMercenaryDeletes]);

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

  const searchResults = useMemo<PendingTeamMemberRow[]>(() => {
    return rawSearchResults.map((tm) => {
      const base = mapSearchTeamMemberToRosterModalRow(tm);
      const existing = attendanceByTeamMemberId.get(tm.id);
      const targetStatus = pendingTeamMembers.has(tm.id)
        ? pendingTeamMembers.get(tm.id)!.currentStatus
        : ((existing?.attendanceStatus as RosterModalAttendanceStatus | undefined) ??
          null);

      return {
        ...base,
        originalStatus: existing?.attendanceStatus as
          | RosterModalAttendanceStatus
          | undefined,
        currentStatus: targetStatus,
      };
    });
  }, [rawSearchResults, attendanceByTeamMemberId, pendingTeamMembers]);

  const mercenaryDraft = useMemo((): MercenaryDraftRow | null => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;
    if (searchResults.some((p) => p.name === trimmed)) return null;

    return {
      kind: "MERCENARY_DRAFT",
      registerName: trimmed,
      displayName: mercenaryDisplayName(trimmed),
      willRegister: pendingMercenaryCreates.has(trimmed),
    };
  }, [inputValue, searchResults, pendingMercenaryCreates]);

  const toggleTeamMemberAttendance = useCallback((player: PendingTeamMemberRow) => {
    setPendingTeamMembers((prev) => {
      const next = new Map(prev);
      const newStatus: RosterModalAttendanceStatus =
        player.currentStatus === "ATTEND" ? "ABSENT" : "ATTEND";

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

  const toggleMercenaryDraftRegister = useCallback((registerName: string) => {
    const key = registerName.trim();
    if (!key) return;
    setPendingMercenaryCreates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleMercenaryExistingRemove = useCallback((mercenaryId: number) => {
    setPendingMercenaryDeletes((prev) => {
      const next = new Set(prev);
      if (next.has(mercenaryId)) next.delete(mercenaryId);
      else next.add(mercenaryId);
      return next;
    });
  }, []);

  const totalPendingCount =
    pendingTeamMembers.size +
    pendingMercenaryCreates.size +
    pendingMercenaryDeletes.size;

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const teamMemberCommits = Array.from(pendingTeamMembers.values()).filter(
        (p): p is PendingTeamMemberRow & {
          currentStatus: RosterModalAttendanceStatus;
        } =>
          p.currentStatus === "ATTEND" || p.currentStatus === "ABSENT",
      );

      await commitFormationRosterModalMutations({
        environment,
        matchId,
        teamId,
        attendanceByTeamMemberId,
        pendingTeamMembers: teamMemberCommits,
        mercenaryNamesToCreate: [...pendingMercenaryCreates],
        mercenaryIdsToDelete: [...pendingMercenaryDeletes],
      });

      await fetchQuery(
        environment,
        FormationMatchAttendanceQuery,
        { matchId, teamId },
        { fetchPolicy: "network-only" },
      ).toPromise();

      const createdMerc = pendingMercenaryCreates.size;
      const removedMerc = pendingMercenaryDeletes.size;
      const memberChanges = teamMemberCommits.length;
      if (createdMerc > 0 && removedMerc === 0 && memberChanges === 0) {
        toast.success(
          createdMerc === 1
            ? "용병을 등록했습니다."
            : `용병 ${createdMerc}명을 등록했습니다.`,
        );
      } else if (removedMerc > 0 && createdMerc === 0 && memberChanges === 0) {
        toast.success(
          removedMerc === 1
            ? "용병을 명단에서 제거했습니다."
            : `용병 ${removedMerc}명을 명단에서 제거했습니다.`,
        );
      } else {
        toast.success("참석 선수 명단을 반영했습니다.");
      }

      setPendingTeamMembers(new Map());
      setPendingMercenaryCreates(new Set());
      setPendingMercenaryDeletes(new Set());
      hideModal();
    } catch (err) {
      console.error("Failed to commit formation roster changes", err);
      toast.error(
        getGraphQLErrorMessage(err, "변경 사항을 저장하지 못했습니다."),
      );
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
    pendingTeamMembers,
    pendingMercenaryCreates,
    pendingMercenaryDeletes,
    existingMercenaries,
    mercenaryDraft,
    totalPendingCount,
    isSearching: isLoading,
    toggleTeamMemberAttendance,
    toggleMercenaryDraftRegister,
    toggleMercenaryExistingRemove,
    handleComplete,
    hideModal,
  };
};
