import type { Position } from "@/types/position";

export type UserProfileEditFoot = "L" | "R" | "B";

/** 유저 프로필 편집 모달 로컬 폼 초기값 (뮤테이션 연동 시 `updateUser` / `updateTeamMember` 입력으로 분리). */
export type UserProfileEditFormInitial = {
  id: number;
  name: string;
  birthDate: string;
  activityArea: string;
  activityAreaCode: string;
  mainPosition: Position | null;
  subPositions: Position[];
  foot: UserProfileEditFoot;
  height: string;
  weight: string;
  favoritePlayer: string;
};
