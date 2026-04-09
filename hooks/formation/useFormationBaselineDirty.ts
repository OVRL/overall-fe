"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";

/**
 * 첫 레이아웃 시점의 값을 기준선으로 두고, 이후 값이 달라졌는지(더티) 판별합니다.
 * 포메이션 페이지 이탈 가드 등에 사용합니다.
 */
export function useFormationBaselineDirty<T>(
  value: T,
  serialize: (v: T) => string,
): boolean {
  const [baseline, setBaseline] = useState<string | null>(null);

  useLayoutEffect(() => {
    setBaseline((prev) => (prev === null ? serialize(value) : prev));
  }, [value, serialize]);

  return useMemo(() => {
    if (baseline === null) return false;
    return serialize(value) !== baseline;
  }, [value, baseline, serialize]);
}

export function useSerializeQuartersStable() {
  return useCallback((q: unknown) => JSON.stringify(q), []);
}
