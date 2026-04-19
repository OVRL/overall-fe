"use client";

import { useState } from "react";
import ModalLayout from "@/components/modals/ModalLayout";
import OnboardingFormationSelector from "@/app/onboarding/_component/OnboardingFormationSelector";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import useModal from "@/hooks/useModal";
import type { Position } from "@/types/position";

export type ProfileSubPositionPickerModalProps = {
  mainPosition: Position | null;
  initialSubPositions: Position[];
  onConfirm: (next: Position[]) => void;
};

export default function ProfileSubPositionPickerModal({
  mainPosition,
  initialSubPositions,
  onConfirm,
}: ProfileSubPositionPickerModalProps) {
  const { hideModal } = useModal();
  const [subPositions, setSubPositions] = useState<Position[]>(() => [
    ...initialSubPositions,
  ]);

  const isComplete = subPositions.length === 2;

  const handleConfirm = () => {
    if (!isComplete) return;
    onConfirm(subPositions);
    hideModal();
  };

  return (
    <ModalLayout title="서브 포지션" wrapperClassName="max-h-[85vh]">
      <div className="flex flex-col gap-y-8 pb-2">
        <p className="text-center text-sm text-Label-Tertiary">
          메인 포지션을 제외하고 서브 포지션을 최대 2개 선택해주세요.
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <OnboardingFormationSelector
            value={subPositions}
            onChange={(next) => {
              if (next.length <= 2) setSubPositions(next);
            }}
            className="h-auto w-full md:max-w-layout"
            multiSelect
            disabledPositions={mainPosition ? [mainPosition] : []}
          />
        </div>
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="line"
            size="l"
            className="flex-1 border-gray-1000 bg-gray-1100"
            onClick={hideModal}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="l"
            className={cn("flex-1", !isComplete && "opacity-50")}
            disabled={!isComplete}
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
