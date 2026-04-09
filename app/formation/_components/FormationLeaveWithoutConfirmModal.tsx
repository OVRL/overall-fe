"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Props = {
  open: boolean;
  onCancel: () => void;
  /** 확인: 임시저장 최신화 후 이탈 */
  onConfirmLeave: () => void;
};

const COPY =
  "[확정] 전까지 등록한 선수는 자동 저장됩니다. 단, 다른 관리자가 이어서 등록할 경우, 최신 상태로 변경될 수 있습니다. 확정하지 않고 등록을 종료하시겠습니까?";

/**
 * 최초 등록 플로우 — 확정 전 이탈 시 (기획서 2-2).
 */
export function FormationLeaveWithoutConfirmModal({
  open,
  onCancel,
  onConfirmLeave,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div onClick={(e) => e.stopPropagation()}>
      <ConfirmModal>
        <ConfirmModal.Title>등록 종료</ConfirmModal.Title>
        <ConfirmModal.Description>{COPY}</ConfirmModal.Description>
        <ConfirmModal.Actions className="flex-col sm:flex-row">
          <ConfirmModal.CancelButton onClick={onCancel}>
            취소
          </ConfirmModal.CancelButton>
          <ConfirmModal.ConfirmButton onClick={onConfirmLeave}>
            확인
          </ConfirmModal.ConfirmButton>
        </ConfirmModal.Actions>
      </ConfirmModal>
      </div>
    </div>
  );
}
