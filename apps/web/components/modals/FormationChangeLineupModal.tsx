"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import useModal from "@/hooks/useModal";
import type { ModalPropsMap } from "@/components/modals/types";

export default function FormationChangeLineupModal({
  onConfirm,
  onCancel,
}: ModalPropsMap["FORMATION_CHANGE_LINEUP"]) {
  const { hideModal } = useModal();

  const handleCancel = () => {
    onCancel();
    hideModal();
  };

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <ConfirmModal>
      <ConfirmModal.Title>포메이션 변경</ConfirmModal.Title>
      <ConfirmModal.Description>
        포메이션 변경 시<br />
        배치된 선수가 변경될 수 있습니다. <br />
        변경하시겠습니까?
      </ConfirmModal.Description>
      <ConfirmModal.Actions>
        <ConfirmModal.CancelButton onClick={handleCancel}>
          취소
        </ConfirmModal.CancelButton>
        <ConfirmModal.ConfirmButton onClick={handleConfirm}>
          변경
        </ConfirmModal.ConfirmButton>
      </ConfirmModal.Actions>
    </ConfirmModal>
  );
}
