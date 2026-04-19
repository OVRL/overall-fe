import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";

export function buildPlayerOptions(
  rows: findMatchAttendanceQuery["response"]["findMatchAttendance"],
): { label: string; value: string }[] {
  const seen = new Set<string>();
  const out: { label: string; value: string }[] = [];
  for (const row of rows) {
    const name = row.user?.name?.trim();
    if (!name) continue;
    const value = String(row.userId);
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ label: name, value });
  }
  return out;
}

export function optionsExcludingOthers(
  all: { label: string; value: string }[],
  current: string | undefined,
  others: (string | undefined)[],
): { label: string; value: string }[] {
  const blocked = new Set(
    others.filter((v): v is string => v != null && v !== ""),
  );
  return all.filter((o) => o.value === current || !blocked.has(o.value));
}
