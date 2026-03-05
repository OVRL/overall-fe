import type { PlayerStats } from "../_types/player";

/** 테이블 컬럼 메타: 헤더 라벨, 정렬 여부, 정렬, 통계 키/기본값 */
export interface PlayerTableColumnConfig {
  key: string;
  sortable: boolean;
  align: "left" | "center";
  /** 통계 컬럼일 때 stats에서 읽을 키 */
  statsKey?: keyof PlayerStats;
  /** 통계 컬럼 기본값 (없을 때 표시) */
  defaultValue?: number | string;
  /** 정렬 없을 때 기본 하이라이트(OVR) */
  defaultHighlight?: boolean;
}

export const PLAYER_TABLE_COLUMNS: PlayerTableColumnConfig[] = [
  { key: "등수", sortable: false, align: "center" },
  { key: "포지션", sortable: false, align: "center" },
  { key: "등번호", sortable: false, align: "center" },
  { key: "이름", sortable: false, align: "left" },
  { key: "OVR", sortable: true, align: "center", defaultHighlight: true },
  {
    key: "출장수",
    sortable: true,
    align: "center",
    statsKey: "출장",
    defaultValue: 10,
  },
  {
    key: "득점",
    sortable: true,
    align: "center",
    statsKey: "득점",
    defaultValue: 7,
  },
  {
    key: "도움",
    sortable: true,
    align: "center",
    statsKey: "도움",
    defaultValue: 3,
  },
  {
    key: "기점",
    sortable: true,
    align: "center",
    statsKey: "기점",
    defaultValue: 4,
  },
  {
    key: "공격P",
    sortable: true,
    align: "center",
    statsKey: "공격P",
    defaultValue: 10,
  },
  {
    key: "클린시트",
    sortable: true,
    align: "center",
    statsKey: "클린시트",
    defaultValue: 2,
  },
  {
    key: "MOM3",
    sortable: true,
    align: "center",
    statsKey: "MOM3",
    defaultValue: 5,
  },
  {
    key: "승률",
    sortable: true,
    align: "center",
    statsKey: "승률",
    defaultValue: "40%",
  },
];

/** 정렬 가능 컬럼 키 Set (O(1) 조회) */
export const SORTABLE_COLUMN_KEYS = new Set(
  PLAYER_TABLE_COLUMNS.filter((c) => c.sortable).map((c) => c.key),
);

/** 컬럼별 너비 매핑 객체 */
export const COLUMN_WIDTH_MAP: Record<string, string> = {
  등수: "w-13 shrink-0",
  포지션: "w-10.5 shrink-0",
  등번호: "w-13.25 shrink-0",
  이름: "justify-start w-31.25 shrink-0",
  default: "w-12.25 shrink-0",
};
