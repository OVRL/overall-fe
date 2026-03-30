import React from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import useModal from "@/hooks/useModal";
import { ModalPropsMap } from "../types";

export default function GlobalConfirmModal({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ModalPropsMap["CONFIRM"]) {
  const { hideModal } = useModal();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    hideModal();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    hideModal();
  };

  return (
    <ConfirmModal>
      <ConfirmModal.Title>{title}</ConfirmModal.Title>
      {description && (
        <ConfirmModal.Description>{description}</ConfirmModal.Description>
      )}
      <ConfirmModal.Actions>
        <ConfirmModal.CancelButton onClick={handleCancel}>
          {cancelText ?? "취소"}
        </ConfirmModal.CancelButton>
        <ConfirmModal.ConfirmButton onClick={handleConfirm}>
          {confirmText ?? "확인"}
        </ConfirmModal.ConfirmButton>
      </ConfirmModal.Actions>
    </ConfirmModal>
  );
}
