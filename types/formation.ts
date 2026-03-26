import { FormationType } from "@/constants/formation";

export type { FormationType } from "@/constants/formation";

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  overall: number;
  image?: string;
  season?: string;
  seasonType?: "general" | "worldBest";
  // Formation specific props
  quarterCount?: number;
  // New Props for Algorithm
  age?: string;
  attendance?: number;
  isMom?: boolean;
  joinDate?: string;
  stats?: {
    matches: number;
    goals: number;
    assists: number;
    contributions: number;
    cleanSheets: number;
    winRate: string;
  };
}

export type TeamType = "A" | "B" | "C" | "D";

export interface QuarterData {
  id: number;
  type: "MATCHING" | "IN_HOUSE";
  formation: FormationType;
  lineup?: Record<number, Player | null>;
  teamA?: Record<number, Player | null>;
  teamB?: Record<number, Player | null>;
  teamC?: Record<number, Player | null>;
  teamD?: Record<number, Player | null>;
  matchup: { home: TeamType; away: TeamType };
}
