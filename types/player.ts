import { Position } from "./position";

export interface Player {
  id: number;
  name: string;
  position: Position;
  number?: number;
  overall: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  pace: number;
  season?: string;
  seasonType?: "general" | "worldBest";
  /** 원본 프로필 URL */
  image?: string | null;
  /** 무효·로드 실패 시 (멤버/유저 ID 기반 플레이스홀더) */
  imageFallbackUrl?: string;
}
