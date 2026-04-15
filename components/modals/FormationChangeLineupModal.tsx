"use client";

import Button from "@/components/ui/Button";
import ModalLayout from "./ModalLayout";
import useModal from "@/hooks/useModal";
import type { ModalPropsMap } from "@/components/modals/types";

export default function FormationChangeLineupModal({
  fromFormationLabel,
  toFormationLabel,
  onKeepLineup,
  onClearLineup,
  onCancel,
}: ModalPropsMap["FORMATION_CHANGE_LINEUP"]) {
  const { hideModal } = useModal();

  const handleKeep = () => {
    onKeepLineup();
    hideModal();
  };

  const handleClear = () => {
    onClearLineup();
    hideModal();
  };

  return (
    <ModalLayout title="포메이션 변경" onClose={() => onCancel()}>
      <div className="flex flex-col gap-6 -mt-6">
        <p className="text-center text-sm text-Label-Secondary leading-relaxed px-1">
          <span className="text-Label-Primary font-medium">
            {fromFormationLabel}
          </span>
          에서{" "}
          <span className="text-Label-Primary font-medium">
            {toFormationLabel}
          </span>
          으로 바꿉니다.
          <br />
          슬롯에 배치된 선수가 있습니다. 라인업을 어떻게 할까요?
        </p>
        <p className="text-xs text-Label-Tertiary text-center px-2">
          「유지」는 슬롯 번호는 그대로 두고, 각 칸의 포지션·위치만 새 포메이션에 맞게
          바뀝니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="m"
            className="sm:min-w-28"
            onClick={() => {
              onCancel();
              hideModal();
            }}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="line"
            size="m"
            className="sm:min-w-28"
            onClick={handleKeep}
          >
            라인업 유지
          </Button>
          <Button
            type="button"
            variant="primary"
            size="m"
            className="sm:min-w-28"
            onClick={handleClear}
          >
            라인업 비우기
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
