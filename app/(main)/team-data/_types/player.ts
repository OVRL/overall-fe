import type { Position } from "@/types/position";

export interface PlayerStats {
  출장: number;
  오버롤: number;
  골: number;
  어시: number;
  기점: number;
  클린시트: number;
  주발?: "L" | "R" | "B";
  승률: string;
  득점?: number;
  도움?: number;
  공격P?: number;
  MOM3?: number;
  MOM8?: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  value: string | number;
  image?: string;
  position: Position;
  backNumber: number;
  ovr: number;
  stats?: PlayerStats;
  cumulativeStats?: PlayerStats;
}

export type StatTabType = "시즌기록" | "명예의 전당" | "통산 기록";
