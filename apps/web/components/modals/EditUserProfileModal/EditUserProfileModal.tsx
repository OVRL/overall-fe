"use client";

import { useCallback } from "react";
import ModalLayout from "@/components/modals/ModalLayout";
import TextField from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import Icon from "@/components/ui/Icon";
import editIcon from "@/public/icons/edit.svg";
import useModal from "@/hooks/useModal";
import OnboardingPositionChip from "@/components/OnboardingPositionChip";
import UserProfileEditFootToggle from "./UserProfileEditFootToggle";
import type { UserProfileEditFormInitial } from "./types";
import { useEditUserProfileForm } from "./hooks/useEditUserProfileForm";
import type { Position } from "@/types/position";

export type EditUserProfileModalProps = {
  initial: UserProfileEditFormInitial;
};

export default function EditUserProfileModal({
  initial,
}: EditUserProfileModalProps) {
  const { hideModal } = useModal();

  const { form, setForm, handleSubmit, isSubmitting } = useEditUserProfileForm(
    initial,
    hideModal,
  );

  const { openModal: openAddressModal } = useModal("ADDRESS_SEARCH");
  const { openModal: openPositionModal } = useModal("USER_POSITION_PICKER");

  const openActivityAreaSearch = useCallback(() => {
    openAddressModal({
      onComplete: ({ address, code }) =>
        setForm((prev) => ({
          ...prev,
          activityArea: address,
          activityAreaCode: code,
        })),
    });
  }, [openAddressModal]);

  const openPositionSelector = useCallback(
    (mode: "main" | "sub") => {
      openPositionModal({
        mode,
        mainPosition: form.mainPosition,
        subPositions: form.subPositions,
        onConfirm: (next: Position[]) => {
          setForm((prev) => ({
            ...prev,
            ...(mode === "main"
              ? { mainPosition: next.length > 0 ? next[0] : null }
              : { subPositions: next }),
          }));
        },
      });
    },
    [openPositionModal, form.mainPosition, form.subPositions, setForm],
  );

  const mainPositionSummary = (
    <div className="flex flex-wrap items-center gap-2">
      {form.mainPosition ? (
        <OnboardingPositionChip
          type="button"
          position={form.mainPosition}
          selected
          className="pointer-events-none cursor-default"
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
        />
      ) : (
        <span className="text-sm text-Label-Tertiary">미설정</span>
      )}
    </div>
  );

  const subPositionSummary = (
    <div className="flex flex-wrap items-center gap-2">
      {form.subPositions.length > 0 ? (
        form.subPositions.map((p) => (
          <OnboardingPositionChip
            key={p}
            type="button"
            position={p}
            selected
            className="pointer-events-none cursor-default"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
          />
        ))
      ) : (
        <span className="text-sm text-Label-Tertiary">미설정</span>
      )}
    </div>
  );

  return (
    <ModalLayout
      title="프로필 수정"
      wrapperClassName="max-h-[90vh] scrollbar-hide"
    >
      <div className="flex flex-col gap-y-10 pb-2">
        <div className="flex flex-col gap-y-6">
          <TextField
            variant="boxed"
            required
            readOnly
            label="이름"
            placeholder="이름을 입력해주세요"
            value={form.name}
            className="pointer-events-none text-Label-Tertiary"
          />

          <TextField
            variant="boxed"
            required
            readOnly
            label="생년월일"
            placeholder="1999-12-31"
            type="text"
            value={form.birthDate}
            className="pointer-events-none text-Label-Tertiary"
          />

          <div
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={openActivityAreaSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openActivityAreaSearch();
              }
            }}
          >
            <TextField
              variant="boxed"
              required
              label="활동지역"
              placeholder="주소검색"
              type="text"
              value={form.activityArea}
              readOnly
              className="pointer-events-none"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-Label-Primary">
                주 포지션
              </span>
              <button
                type="button"
                className="group flex shrink-0 items-center gap-1 rounded-lg py-1.5 pl-2 pr-1 text-sm font-medium text-Label-Tertiary transition-colors hover:text-Label-Secondary"
                onClick={() => openPositionSelector("main")}
                aria-label="주 포지션 편집"
              >
                <Icon
                  src={editIcon}
                  alt=""
                  className="text-gray-500 transition-colors group-hover:text-Label-Tertiary"
                  width={20}
                  height={20}
                  aria-hidden
                />
              </button>
            </div>
            {mainPositionSummary}
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-Label-Primary">
                서브 포지션
              </span>
              <button
                type="button"
                className="group flex shrink-0 items-center gap-1 rounded-lg py-1.5 pl-2 pr-1 text-sm font-medium text-Label-Tertiary transition-colors hover:text-Label-Secondary"
                onClick={() => openPositionSelector("sub")}
                aria-label="서브 포지션 편집"
              >
                <Icon
                  src={editIcon}
                  alt=""
                  className="text-gray-500 transition-colors group-hover:text-Label-Tertiary"
                  width={20}
                  height={20}
                  aria-hidden
                />
              </button>
            </div>
            {subPositionSummary}
          </div>

          <UserProfileEditFootToggle
            value={form.foot}
            onChange={(foot) => setForm((prev) => ({ ...prev, foot }))}
          />
          <TextField
            variant="boxed"
            label="신장"
            placeholder="신장을 입력해주세요. [단위: cm]"
            className="placeholder:text-gray-700 text-base"
            type="text"
            inputMode="numeric"
            value={form.height}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              const formatted =
                parts.length > 2 ? `${parts[0]}.${parts[1]}` : val;
              setForm((prev) => ({
                ...prev,
                height: formatted,
              }));
            }}
          />
          <TextField
            variant="boxed"
            label="체중"
            placeholder="체중을 입력해주세요. [단위: kg]"
            className="placeholder:text-gray-700 text-base"
            type="text"
            inputMode="numeric"
            value={form.weight}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              const formatted =
                parts.length > 2 ? `${parts[0]}.${parts[1]}` : val;
              setForm((prev) => ({
                ...prev,
                weight: formatted,
              }));
            }}
          />

          <TextField
            variant="boxed"
            label="좋아하는 선수"
            placeholder="좋아하는 선수를 입력해주세요"
            className="placeholder:text-gray-700 text-base"
            value={form.favoritePlayer}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                favoritePlayer: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex w-full gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="xl"
            className="flex-1 "
            onClick={hideModal}
          >
            취소
          </Button>
          <PendingActionButton
            type="button"
            variant="primary"
            size="xl"
            className="flex-1"
            pending={isSubmitting}
            pendingLabel="프로필 저장 중"
            onClick={handleSubmit}
          >
            저장
          </PendingActionButton>
        </div>
      </div>
    </ModalLayout>
  );
}
