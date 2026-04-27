export type RegionSearchDisplayInput = {
  readonly code?: string | null;
  readonly sidoName?: string | null;
  readonly siggName?: string | null;
  readonly name?: string | null;
  readonly dongName?: string | null;
  readonly riName?: string | null;
};

/**
 * RegionSearchModel 표시용 문자열 (행정 코드 문자열 자체는 노출하지 않음).
 * 시·군·구·동 조합을 우선하고, 없으면 name을 사용한다.
 * API가 name에 행정코드를 넣은 경우(code와 동일)에는 빈 문자열로 처리한다.
 */
export function formatRegionSearchDisplay(
  region: RegionSearchDisplayInput | null | undefined,
): string {
  if (region == null) return "";

  const code =
    region.code != null && String(region.code).trim() !== ""
      ? String(region.code).trim()
      : "";

  const compositeParts = [
    region.sidoName?.trim(),
    region.siggName?.trim(),
    region.dongName?.trim(),
    region.riName?.trim(),
  ].filter((p): p is string => Boolean(p && p.length > 0));

  const fromComposite = compositeParts.join(" ");
  if (fromComposite !== "") return fromComposite;

  const rawName =
    typeof region.name === "string" ? region.name.trim() : "";
  if (rawName === "") return "";
  if (code !== "" && rawName === code) return "";
  return rawName;
}

/**
 * activityArea 등에 행정 구역 코드만 문자열로 들어온 경우 (지역명이 아님).
 * 법정동·행정동 코드 형태의 숫자열을 걸러낸다.
 */
export function isAdministrativeRegionCodeLike(value: string): boolean {
  const v = value.trim();
  if (v.length < 8) return false;
  return /^\d+$/.test(v);
}
