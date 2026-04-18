import React, { Children, cloneElement, isValidElement } from "react";
import type { FormationMatchPageSnapshot } from "@/types/formationMatchPageSnapshot";

/**
 * RSC가 `children` 클라이언트 컴포넌트에 넘기는 `savedInitialQuarters`가
 * 페이로드 경로상 누락·지연되는 경우가 있어, 이미 부모 props로 안정 전달된
 * `ssrSnapshot.initialQuarters`를 동일 트리에서 주입합니다.
 */
export function mergeSsrInitialQuartersIntoChildren(
  children: React.ReactNode,
  ssrSnapshot: FormationMatchPageSnapshot,
): React.ReactNode {
  const ssrQuarters = ssrSnapshot.initialQuarters;
  const useSsrQuarters =
    ssrQuarters != null && ssrQuarters.length > 0 ? ssrQuarters : null;

  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (useSsrQuarters == null) return child;
    const prev = child.props as Record<string, unknown>;
    return cloneElement(child, {
      ...prev,
      savedInitialQuarters: useSsrQuarters,
      savedInitialInHouseDraftTeamByKey:
        ssrSnapshot.initialInHouseDraftTeamByKey,
      savedDraftMatchFormationId: ssrSnapshot.savedDraftMatchFormationId,
      savedLatestConfirmedMatchFormationId:
        ssrSnapshot.savedLatestConfirmedMatchFormationId,
      savedInitialFormationPrimarySource:
        ssrSnapshot.savedInitialFormationPrimarySource,
      savedInitialFormationSourceRevision:
        ssrSnapshot.savedInitialFormationSourceRevision,
    } as Record<string, unknown>);
  });
}
