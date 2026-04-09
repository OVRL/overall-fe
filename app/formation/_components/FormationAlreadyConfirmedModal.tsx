"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Props = {
  open: boolean;
  /** 확인하러 가기 — 확정 데이터 기준으로 화면을 다시 맞춤 */
  onGoToConfirmed: () => void;
};

const COPY =
  "이미 확정된 포메이션이 있습니다. 확정된 내용을 확인하고 변경이 필요하면 수정해주세요.";

/**
 * 기획서 §5 Case 1 — 타인이 먼저 확정한 뒤 본인이 확정을 시도했을 때.
 */
export function FormationAlreadyConfirmedModal({
  open,
  onGoToConfirmed,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={`포메이션 확정. ${COPY}`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmModal>
          <ConfirmModal.Title>포메이션 확정</ConfirmModal.Title>
          <ConfirmModal.Description>{COPY}</ConfirmModal.Description>
          <ConfirmModal.Actions className="flex-col">
            <ConfirmModal.ConfirmButton onClick={onGoToConfirmed}>
              확인하러 가기
            </ConfirmModal.ConfirmButton>
          </ConfirmModal.Actions>
        </ConfirmModal>
      </div>
    </div>
  );
}
