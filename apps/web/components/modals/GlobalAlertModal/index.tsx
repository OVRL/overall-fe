import React from "react";
import { AlertModal } from "@/components/ui/AlertModal";
import useModal from "@/hooks/useModal";
import { ModalPropsMap } from "../types";

export default function GlobalAlertModal({
  title,
  description,
  confirmText,
  onConfirm,
}: ModalPropsMap["ALERT"]) {
  const { hideModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <AlertModal>
      <AlertModal.Title>{title}</AlertModal.Title>
      {description && (
        <AlertModal.Description>{description}</AlertModal.Description>
      )}
      <AlertModal.Actions>
        <AlertModal.PrimaryButton onClick={handleConfirm}>
          {confirmText ?? "확인"}
        </AlertModal.PrimaryButton>
      </AlertModal.Actions>
    </AlertModal>
  );
}
