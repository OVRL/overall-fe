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
import { setSelectedTeamIdCookie } from "@/lib/cookie/selectedTeamId";

export type SelectedTeamContextValue = {
  selectedTeamId: string | null;
  /** FindMatch(createdTeamId) 등 API 변수용 숫자 팀 ID */
  selectedTeamIdNum: number | null;
  /** 표시용 팀 이름 (SSR에서 전달, 홈 등에서 추가 요청 없이 사용) */
  selectedTeamName: string | null;
  /** 표시용 팀 이미지 URL (SSR에서 전달, 없으면 기본 이미지 사용) */
  selectedTeamImageUrl: string | null;
  /** 로스터 팀원 1명(나 혼자) 여부. layout SSR findManyTeamMember totalCount 기반, 홈 온보딩 분기용 */
  isSoloTeam: boolean;
  setSelectedTeamId: (teamId: string | null, teamIdNum?: number | null) => void;
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
  /** SSR에서 팀이 1개라서 초기값을 넣어준 경우. 클라이언트에서 쿠키에 한 번 저장해 다음 접속 시 서버가 읽을 수 있게 함 */
  initialSelectedTeamIdFromSingleTeam?: boolean;
  /** layout SSR findManyTeamMember totalCount 기반. 팀원 1명이면 true (홈 온보딩 분기용) */
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
  initialSelectedTeamIdFromSingleTeam = false,
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
  const didPersistSingleTeam = useRef(false);

  const setSelectedTeamId = useCallback(
    (teamId: string | null, teamIdNum?: number | null) => {
      setSelectedTeamIdState(teamId);
      setSelectedTeamIdNumState(teamIdNum ?? null);
      setSelectedTeamIdCookie(teamId);
      if (teamId == null) {
        setSelectedTeamNameState(null);
        setSelectedTeamImageUrlState(null);
      }
    },
    [],
  );

  // SSR에서 팀 1개로 초기값만 준 경우, 쿠키에 한 번 저장해 두어 다음 접속 시 서버가 읽을 수 있게 함
  useEffect(() => {
    if (
      initialSelectedTeamIdFromSingleTeam &&
      initialSelectedTeamId != null &&
      !didPersistSingleTeam.current
    ) {
      didPersistSingleTeam.current = true;
      setSelectedTeamIdCookie(initialSelectedTeamId);
    }
  }, [initialSelectedTeamIdFromSingleTeam, initialSelectedTeamId]);

  const value = useMemo<SelectedTeamContextValue>(
    () => ({
      selectedTeamId,
      selectedTeamIdNum,
      selectedTeamName,
      selectedTeamImageUrl,
      isSoloTeam: initialIsSoloTeam,
      setSelectedTeamId,
    }),
    [
      selectedTeamId,
      selectedTeamIdNum,
      selectedTeamName,
      selectedTeamImageUrl,
      initialIsSoloTeam,
      setSelectedTeamId,
    ],
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
