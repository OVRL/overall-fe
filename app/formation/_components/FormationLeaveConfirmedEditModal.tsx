"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Props = {
  open: boolean;
  onCancel: () => void;
  /** 종료: 변경 미반영 후 이전 페이지로 이동 (기획서 4-3) */
  onConfirmLeave: () => void;
};

/**
 * 확정 수정 플로우 — [확정] 없이 이탈 시 (기획서 4-3).
 * 임시저장 없이 로컬 변경만 버리고 나갑니다.
 */
export function FormationLeaveConfirmedEditModal({
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
          <ConfirmModal.Title>수정 종료</ConfirmModal.Title>
          <ConfirmModal.Description>
            포메이션을 확정하지 않으면, 저장되지 않습니다.
            <br />
            정말 종료하시겠습니까?
          </ConfirmModal.Description>
          <ConfirmModal.Actions className="flex-col sm:flex-row">
            <ConfirmModal.CancelButton onClick={onCancel}>
              취소
            </ConfirmModal.CancelButton>
            <ConfirmModal.ConfirmButton onClick={onConfirmLeave}>
              종료
            </ConfirmModal.ConfirmButton>
          </ConfirmModal.Actions>
        </ConfirmModal>
      </div>
    </div>
  );
}
