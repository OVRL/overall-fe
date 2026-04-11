export type RegionSearchDisplayInput = {
  readonly sidoName?: string | null;
  readonly siggName?: string | null;
  readonly name?: string | null;
  readonly dongName?: string | null;
  readonly riName?: string | null;
};

/**
 * RegionSearchModel 표시용 문자열 (code 미사용).
 * 현재는 `name`만 사용합니다.
 */
export function formatRegionSearchDisplay(
  region: RegionSearchDisplayInput | null | undefined,
): string {
  if (region == null) return "";
  const raw = region.name;
  if (raw == null || typeof raw !== "string") return "";
  return raw.trim();
}
