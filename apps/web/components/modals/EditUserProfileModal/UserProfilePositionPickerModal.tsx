"use client";

import { useState } from "react";
import ModalLayout from "@/components/modals/ModalLayout";
import OnboardingFormationSelector from "@/app/onboarding/_component/OnboardingFormationSelector";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import useModal from "@/hooks/useModal";
import type { Position } from "@/types/position";

export type UserProfilePositionPickerModalProps = {
  mode: "main" | "sub";
  mainPosition: Position | null;
  subPositions: Position[];
  onConfirm: (next: Position[]) => void;
};

export default function UserProfilePositionPickerModal({
  mode,
  mainPosition,
  subPositions: initialSubPositions,
  onConfirm,
}: UserProfilePositionPickerModalProps) {
  const { hideModal } = useModal();

  const isMainMode = mode === "main";

  // 현재 모달에서 선택 중인 임시 포지션 상태
  const [selectedPositions, setSelectedPositions] = useState<Position[]>(() =>
    isMainMode ? (mainPosition ? [mainPosition] : []) : [...initialSubPositions],
  );

  const disabledPositions = isMainMode ? initialSubPositions : (mainPosition ? [mainPosition] : []);

  // 메인은 반드시 1개, 서브는 0~2개 선택 가능 (요구사항에 따라 다를 수 있으나 isComplete 논리 조정)
  const isComplete = isMainMode ? selectedPositions.length === 1 : selectedPositions.length <= 2;

  const handleConfirm = () => {
    if (!isComplete) return;
    onConfirm(selectedPositions);
    hideModal();
  };

  const title = isMainMode ? "주 포지션" : "서브 포지션";
  const description = isMainMode
    ? "서브 포지션을 제외하고 주 포지션을 1개 선택해주세요."
    : "메인 포지션을 제외하고 서브 포지션을 최대 2개 선택해주세요.";

  return (
    <ModalLayout title={title} wrapperClassName="max-h-[85vh]">
      <div className="flex flex-col gap-y-8 pb-2">
        <p className="text-center text-sm text-Label-Tertiary">
          {description}
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <OnboardingFormationSelector
            value={selectedPositions}
            onChange={(next) => {
              if (isMainMode) {
                setSelectedPositions(next); // single select
              } else {
                // 서브 포지션: 2개를 초과하면 가장 오래된 것(첫번째)을 밀어냄
                if (next.length <= 2) {
                  setSelectedPositions(next);
                } else {
                  setSelectedPositions(next.slice(next.length - 2));
                }
              }
            }}
            className="h-auto w-full md:max-w-layout"
            multiSelect={!isMainMode}
            disabledPositions={disabledPositions}
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
