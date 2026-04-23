import type { Position } from "@/types/position";

export type ProfileEditFoot = "L" | "R" | "B";

/** 프로필 편집 모달 로컬 폼 초기값 (뮤테이션 연동 시 `updateUser` / `updateTeamMember` 입력으로 분리). */
export type ProfileEditFormInitial = {
  name: string;
  birthDate: string;
  activityArea: string;
  activityAreaCode: string;
  mainPosition: Position | null;
  subPositions: Position[];
  foot: ProfileEditFoot;
  preferredNumber: string;
  favoritePlayer: string;
  introduction: string;
  profilePreviewUrl: string | null;
};
