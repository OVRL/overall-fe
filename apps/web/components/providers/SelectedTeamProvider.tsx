"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ReactRelayContext } from "react-relay";
import { setSelectedTeamIdCookie } from "@/lib/cookie/selectedTeamId";
import { useFindManyTeamMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";
import { normalizeRelayTeamGlobalId } from "@/lib/relay/parseRelayGlobalId";

export type SelectedTeamContextValue = {
  selectedTeamId: string | null;
  /** FindMatch(createdTeamId) 등 API 변수용 숫자 팀 ID */
  selectedTeamIdNum: number | null;
  /** 표시용 팀 이름 (SSR에서 전달, 홈 등에서 추가 요청 없이 사용) */
  selectedTeamName: string | null;
  /** 표시용 팀 이미지 URL (SSR에서 전달, 없으면 기본 이미지 사용) */
  selectedTeamImageUrl: string | null;
  /** 선택 팀 로스터가 1명(본인만)일 때 true — 온보딩 UI 분기용 */
  isSoloTeam: boolean;
  /** teamName/teamImageUrl은 클럽 생성 직후 등 팀 목록 refetch 전에 뱃지 표시를 위해 선택적으로 전달 */
  setSelectedTeamId: (
    teamId: string | number | null,
    teamIdNum?: number | null,
    teamName?: string | null,
    teamImageUrl?: string | null,
  ) => void;
};

const SelectedTeamContext = createContext<SelectedTeamContextValue | null>(
  null,
);

type SelectedTeamProviderProps = {
  /** 서버에서 findTeamMember + 쿠키 기반으로 계산한 초기값 */
  initialSelectedTeamId: string | null;
  /** 선택된 팀의 숫자 ID (FindMatch 등 API 변수용) */
  initialSelectedTeamIdNum?: number | null;
  /** 표시용 팀 이름 (선택된 팀이 있을 때 layout SSR에서 전달) */
  initialSelectedTeamName?: string | null;
  /** 표시용 팀 이미지 URL (선택된 팀이 있을 때 layout SSR에서 전달) */
  initialSelectedTeamImageUrl?: string | null;
  /** SSR findManyTeamMember totalCount 기반. Relay 없는 테스트 등에서는 이 값이 isSoloTeam으로 사용됨 */
  initialIsSoloTeam?: boolean;
  children: ReactNode;
};

/**
 * 헤더 팀 셀렉터에서 선택한 팀 ID를 전역으로 공유하고,
 * 선택 시 쿠키에 저장해 다음 접속 시 복원합니다.
 * 초기값은 layout SSR에서 findTeamMember + 쿠키로 계산해 전달합니다.
 */
export function SelectedTeamProvider({
  initialSelectedTeamId,
  initialSelectedTeamIdNum = null,
  initialSelectedTeamName = null,
  initialSelectedTeamImageUrl = null,
  initialIsSoloTeam = false,
  children,
}: SelectedTeamProviderProps) {
  const [selectedTeamId, setSelectedTeamIdState] = useState<string | null>(
    initialSelectedTeamId,
  );
  const [selectedTeamIdNum, setSelectedTeamIdNumState] = useState<
    number | null
  >(initialSelectedTeamIdNum ?? null);
  const [selectedTeamName, setSelectedTeamNameState] = useState<string | null>(
    initialSelectedTeamName ?? null,
  );
  const [selectedTeamImageUrl, setSelectedTeamImageUrlState] = useState<
    string | null
  >(initialSelectedTeamImageUrl ?? null);
  /** SSR이 넘긴 선택 팀을 쿠키에 한 번 반영 (단일/다중 팀 공통, 쿠키 미설정 시 복구) */
  const didSyncInitialTeamCookie = useRef(false);

  const setSelectedTeamId = useCallback(
    (
      teamId: string | number | null,
      teamIdNum?: number | null,
      teamName?: string | null,
      teamImageUrl?: string | null,
    ) => {
      const normalizedId = normalizeRelayTeamGlobalId(teamId);
      setSelectedTeamIdState(normalizedId);
      setSelectedTeamIdNumState(teamIdNum ?? null);
      setSelectedTeamIdCookie(normalizedId);
      if (teamId == null) {
        setSelectedTeamNameState(null);
        setSelectedTeamImageUrlState(null);
      } else if (teamName !== undefined || teamImageUrl !== undefined) {
        if (teamName !== undefined) setSelectedTeamNameState(teamName);
        if (teamImageUrl !== undefined)
          setSelectedTeamImageUrlState(teamImageUrl);
      }
    },
    [],
  );

  // SSR이 확정한 선택 팀 ID를 쿠키에 한 번 동기화 (다중 팀·쿠키 없을 때도 첫 팀이 initial로 오면 저장됨)
  useEffect(() => {
    if (initialSelectedTeamId == null || didSyncInitialTeamCookie.current) {
      return;
    }
    didSyncInitialTeamCookie.current = true;
    setSelectedTeamIdCookie(
      normalizeRelayTeamGlobalId(initialSelectedTeamId),
    );
  }, [initialSelectedTeamId]);

  const contextValueWithoutSolo = useMemo<
    Omit<SelectedTeamContextValue, "isSoloTeam">
  >(
    () => ({
      selectedTeamId,
      selectedTeamIdNum,
      selectedTeamName,
      selectedTeamImageUrl,
      setSelectedTeamId,
    }),
    [
      selectedTeamId,
      selectedTeamIdNum,
      selectedTeamName,
      selectedTeamImageUrl,
      setSelectedTeamId,
    ],
  );

  return (
    <SelectedTeamSoloBranch
      contextValueWithoutSolo={contextValueWithoutSolo}
      initialIsSoloTeam={initialIsSoloTeam}
    >
      {children}
    </SelectedTeamSoloBranch>
  );
}

/** Relay가 있으면 findManyTeamMember totalCount로 동기화, 없으면 SSR 초기값만 사용 */
function SelectedTeamSoloBranch({
  contextValueWithoutSolo,
  initialIsSoloTeam,
  children,
}: {
  contextValueWithoutSolo: Omit<SelectedTeamContextValue, "isSoloTeam">;
  initialIsSoloTeam: boolean;
  children: ReactNode;
}) {
  const relayEnv = useContext(ReactRelayContext)?.environment ?? null;
  const teamId = contextValueWithoutSolo.selectedTeamIdNum;

  if (teamId == null) {
    return (
      <SelectedTeamContext.Provider
        value={{ ...contextValueWithoutSolo, isSoloTeam: false }}
      >
        {children}
      </SelectedTeamContext.Provider>
    );
  }

  if (relayEnv == null) {
    return (
      <SelectedTeamContext.Provider
        value={{
          ...contextValueWithoutSolo,
          isSoloTeam: initialIsSoloTeam,
        }}
      >
        {children}
      </SelectedTeamContext.Provider>
    );
  }

  return (
    <SelectedTeamSoloFromRoster
      contextValueWithoutSolo={contextValueWithoutSolo}
      teamId={teamId}
    >
      {children}
    </SelectedTeamSoloFromRoster>
  );
}

function SelectedTeamSoloFromRoster({
  contextValueWithoutSolo,
  teamId,
  children,
}: {
  contextValueWithoutSolo: Omit<SelectedTeamContextValue, "isSoloTeam">;
  teamId: number;
  children: ReactNode;
}) {
  const { totalCount } = useFindManyTeamMember(teamId);
  const isSoloTeam = totalCount === 1;
  const value = useMemo<SelectedTeamContextValue>(
    () => ({ ...contextValueWithoutSolo, isSoloTeam }),
    [contextValueWithoutSolo, isSoloTeam],
  );

  return (
    <SelectedTeamContext.Provider value={value}>
      {children}
    </SelectedTeamContext.Provider>
  );
}

export function useSelectedTeamId(): SelectedTeamContextValue {
  const ctx = useContext(SelectedTeamContext);
  if (ctx == null) {
    throw new Error(
      "useSelectedTeamId must be used within SelectedTeamProvider",
    );
  }
  return ctx;
}
