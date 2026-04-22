import { ComponentType } from "react";

import type { ProfileEditFormInitial } from "./EditProfileModal/types";
import type { ProfileSubPositionPickerModalProps } from "./EditProfileModal/ProfileSubPositionPickerModal";
import type { Player as TeamDataPlayer } from "@/app/(main)/team-data/_types/player";
import type { TeamSearchResult } from "@/hooks/useTeamSearch";
import type { Player } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";

export interface ModalPropsMap {
  // 예시:
  // ALERT: { message: string };
  CONFIRM: {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
  DEFAULT_IMAGE_SELECT: {
    initialImage: string;
    onSave: (image: string) => void;
  };
  ADDRESS_SEARCH: {
    onComplete: (result: { address: string; code: string }) => void;
  };
  EDIT_PROFILE_IMAGE: {
    initialImage: string;
    onSave: (image: string, file: File) => void;
  };
  EDIT_EMBLEM_IMAGE: {
    initialImage: string;
    onSave: (image: string, file: File) => void;
  };
  /** 포메이션 — 매치 참석·용병 반영용 선수 검색/편집 모달 */
  FORMATION_MATCH_ATTENDANCE_PLAYER: {
    matchId: number;
    teamId: number;
  };
  PLAYER_SEARCH: {
    onComplete: (player: Player) => void;
    excludeMercenaries?: boolean;
    isTeamSearch?: boolean;
    teamPlayers?: Player[];
    targetPosition?: string | null;
    title?: string;
  };
  TEAM_SEARCH: {
    onComplete: (result: TeamSearchResult) => void;
  };
  DETAIL_ADDRESS_SEARCH: {
    onComplete: (result: {
      address: string;
      latitude: number;
      longitude: number;
    }) => void;
  };
  TEAM_DATA_PLAYER_DETAIL: {
    player: TeamDataPlayer | null;
  };
  TEAM_DATA_STAT_RANKING: {
    category: string;
    players: TeamDataPlayer[];
    onPlayerClick?: (player: TeamDataPlayer) => void;
  };
  REGISTER_GAME: Record<string, never>;
  ATTENDANCE_VOTE: Record<string, never>;
  /** 홈 직전 경기 MOM 투표 (참석자 목록: findMatchAttendance) */
  MOM_VOTE: {
    matchId: number;
    teamId: number;
  };
  TEAM_CREATED: Record<string, never>;
  /** 랜딩 — 팀 코드 입력 후 팀 정보 확인(초대 코드 조회 UI, 데이터는 추후 API 연동) */
  TEAM_INFO: {
    inviteCode: string;
    /** true면 열기 전에 fetchQuery로 스토어를 채운 경우 — 모달은 store-only로 읽어 Suspense 없이 한 번에 표시 */
    prefetchedAtOpen?: boolean;
  };
  EDIT_GAME: {
    matchId: number;
    teamId: number;
  };
  /** 포메이션 경기 카드 — 지도 버튼 */
  FORMATION_VENUE_MAP: {
    address: string;
    latitude: number;
    longitude: number;
  };
  /** 포메이션 빌더 — 라인업이 있을 때 포메이션 변경 확인 */
  FORMATION_CHANGE_LINEUP: {
    onConfirm: () => void;
    onCancel: () => void;
  };
  /** 포메이션 빌더(모바일) — 내전 팀 드래프트 전체 참석자 편집 */
  FORMATION_MOBILE_TEAM_DRAFT: {
    players: Player[];
    initialDraftByKey: InHouseDraftTeamByPlayerKey;
    onApply: (next: InHouseDraftTeamByPlayerKey) => void;
  };
  /** 홈 등 — 확정 포메이션 읽기 전용 MATCH LINEUP 모달 */
  FORMATION_CHECK_LINEUP: {
    matchId: number;
    teamId: number;
  };
  /** 마이페이지 — 프로필 편집 (UI만, 저장 뮤테이션은 추후) */
  EDIT_PROFILE: {
    initial: ProfileEditFormInitial;
  };
  /** 프로필 편집 — 서브 포지션 선택 (온보딩 `SubFormationCollect`와 동일 셀렉터) */
  PROFILE_EDIT_SUB_POSITIONS: ProfileSubPositionPickerModalProps;
}

export type ModalKey = keyof ModalPropsMap;

export type ModalComponentMap = {
  [K in ModalKey]: ComponentType<ModalPropsMap[K]>;
};

/** showModal / openModal 호출 시 래퍼 동작 옵션 */
export type OpenModalOptions = {
  /** false면 어두운 배경(오버레이) 클릭 시 닫히지 않음. 기본 true */
  closeOnBackdropClick?: boolean;
};

export type ModalInstance = {
  [K in ModalKey]: {
    id: string;
    key: K;
    props: ModalPropsMap[K];
    /** undefined면 true와 동일 */
    closeOnBackdropClick?: boolean;
  };
}[ModalKey];
