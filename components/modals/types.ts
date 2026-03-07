import { ComponentType } from "react";
import { Player } from "@/types/formation";
import type { Player as TeamDataPlayer } from "@/app/(main)/team-data/_types/player";

export interface ModalPropsMap {
  // 예시:
  // ALERT: { message: string };
  // CONFIRM: { title: string; onConfirm: () => void };
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
  PLAYER_SEARCH: {
    onComplete: (player: Player) => void;
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
}

export type ModalKey = keyof ModalPropsMap;

export type ModalComponentMap = {
  [K in ModalKey]: ComponentType<ModalPropsMap[K]>;
};

export type ModalInstance = {
  [K in ModalKey]: {
    id: string;
    key: K;
    props: ModalPropsMap[K];
  };
}[ModalKey];
