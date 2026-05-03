import type { Player, PlayerStats } from "../_types/player";

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
  /** 표시 단위 (예: '골', '경기', 'P') */
  suffix?: string;
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
    defaultValue: 0,
    suffix: "경기",
  },
  {
    key: "득점",
    sortable: true,
    align: "center",
    statsKey: "득점",
    defaultValue: 0,
    suffix: "골",
  },
  {
    key: "도움",
    sortable: true,
    align: "center",
    statsKey: "도움",
    defaultValue: 0,
    suffix: "개",
  },
  {
    key: "기점",
    sortable: true,
    align: "center",
    statsKey: "기점",
    defaultValue: 0,
    suffix: "P",
  },
  {
    key: "공격P",
    sortable: true,
    align: "center",
    statsKey: "공격P",
    defaultValue: 0,
    suffix: "P",
  },
  {
    key: "클린시트",
    sortable: true,
    align: "center",
    statsKey: "클린시트",
    defaultValue: 0,
    suffix: "회",
  },
  {
    key: "MOM3",
    sortable: true,
    align: "center",
    statsKey: "MOM3",
    defaultValue: 0,
    suffix: "회",
  },
  {
    key: "MOM8",
    sortable: true,
    align: "center",
    statsKey: "MOM8",
    defaultValue: 0,
    suffix: "회",
  },
  {
    key: "승률",
    sortable: true,
    align: "center",
    statsKey: "승률",
    defaultValue: "0%",
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
  이름: "w-31.25 shrink-0",
  default: "w-12.25 shrink-0",
};

/**
 * 선수 데이터를 설정된 컬럼 규칙에 따라 포맷팅된 문자열로 반환
 */
export const formatPlayerValue = (
  player: Player,
  colKey: string,
): string | number => {
  const col = PLAYER_TABLE_COLUMNS.find((c) => c.key === colKey);
  if (!col) return "-";

  if (col.key === "OVR") return player.ovr;

  if (col.statsKey) {
    const rawValue = player.stats?.[col.statsKey] ?? col.defaultValue;
    if (col.suffix && typeof rawValue === "number") {
      return `${rawValue}${col.suffix}`;
    }
    return rawValue ?? "-";
  }

  return "-";
};
