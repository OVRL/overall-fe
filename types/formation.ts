import { FormationType } from "@/constants/formation";

export type { FormationType } from "@/constants/formation";

/** 포메이션 라인업 후보 출처 — 팀원(참석) vs 경기 용병 */
export type FormationRosterKind = "TEAM_MEMBER" | "MERCENARY";

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  overall: number;
  image?: string;
  /** 프로필 없을 때 플레이스홀더 시드용 (없으면 `m:{id}` 해시) */
  imageFallbackUrl?: string | null;
  /** 기본값은 팀원 — 용병은 tactics 저장 시 `mercenaryId` 분기에 사용 */
  rosterKind?: FormationRosterKind;
  /** `rosterKind === "MERCENARY"`일 때 서버 `MatchMercenaryModel.id` (보통 `id`와 동일) */
  mercenaryId?: number;
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
