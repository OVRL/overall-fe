"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import useModal from "@/hooks/useModal";
import {
  applyFormationChangeDecision,
  getCurrentFormationForScope,
  needsFormationChangeConfirm,
  type FormationChangeScope,
} from "@/lib/formation/formationChangePolicy";
import type { FormationType, QuarterData } from "@/types/formation";

/**
 * 포메이션 드롭다운 변경 시: 배치 없음 → 즉시 반영(keep과 동일),
 * 배치 있음 → 확인 모달(취소 / 변경).
 */
export function useFormationChangeFlow(
  quarters: QuarterData[],
  setQuarters: Dispatch<SetStateAction<QuarterData[]>>,
  scope: FormationChangeScope | null,
) {
  const { openModal } = useModal("FORMATION_CHANGE_LINEUP");

  const onFormationChangeIntent = useCallback(
    (quarterId: number, nextFormation: FormationType) => {
      if (scope == null) return;

      const q = quarters.find((h) => h.id === quarterId);
      if (q == null) return;

      const current = getCurrentFormationForScope(q, scope);
      if (current === nextFormation) return;

      const applyKeep = () => {
        setQuarters((prev) =>
          prev.map((qu) =>
            qu.id === quarterId
              ? applyFormationChangeDecision(qu, nextFormation, "keep", scope)
              : qu,
          ),
        );
      };

      if (!needsFormationChangeConfirm(q, scope)) {
        applyKeep();
        return;
      }

      openModal({
        onConfirm: applyKeep,
        onCancel: () => {},
      });
    },
    [quarters, scope, setQuarters, openModal],
  );

  return { onFormationChangeIntent };
}
