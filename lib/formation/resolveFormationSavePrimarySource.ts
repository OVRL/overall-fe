import type { FormationMatchFormationPrimarySource } from "@/types/formationMatchPageSnapshot";

/**
 * SSR에서 `savedInitialFormationPrimarySource`가 없을 때,
 * 확정·드래프트 행 id가 둘 다 있으면 UI·저장 분기는 확정을 우선한다(`pickPrimary`와 동일).
 */
export function resolveFormationSavePrimarySource(input: {
  savedInitialFormationPrimarySource: FormationMatchFormationPrimarySource | null;
  savedLatestConfirmedMatchFormationId: number | null;
  savedDraftMatchFormationId: number | null;
}): FormationMatchFormationPrimarySource | null {
  const {
    savedInitialFormationPrimarySource,
    savedLatestConfirmedMatchFormationId,
    savedDraftMatchFormationId,
  } = input;

  if (savedInitialFormationPrimarySource != null) {
    return savedInitialFormationPrimarySource;
  }
  if (
    savedLatestConfirmedMatchFormationId != null &&
    savedDraftMatchFormationId != null
  ) {
    return "confirmed";
  }
  return null;
}
