"use client";

import { useCallback, useState } from "react";
import ModalLayout from "@/components/modals/ModalLayout";
import TextField from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import editIcon from "@/public/icons/edit.svg";
import useModal from "@/hooks/useModal";
import OnboardingPositionChip from "@/components/OnboardingPositionChip";
import ProfileEditImageBlock from "./ProfileEditImageBlock";
import ProfileEditFootToggle from "./ProfileEditFootToggle";
import type { ProfileEditFormInitial } from "./types";

export type EditProfileModalProps = {
  initial: ProfileEditFormInitial;
};

export default function EditProfileModal({ initial }: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileEditFormInitial>(() => ({
    ...initial,
    subPositions: [...initial.subPositions],
  }));

  const { hideModal } = useModal();
  const { openModal: openAddressModal } = useModal("ADDRESS_SEARCH");
  const { openModal: openSubPositionModal } = useModal(
    "PROFILE_EDIT_SUB_POSITIONS",
  );

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

  const openSubPositions = useCallback(() => {
    openSubPositionModal({
      mainPosition: form.mainPosition,
      initialSubPositions: form.subPositions,
      onConfirm: (next) =>
        setForm((prev) => ({ ...prev, subPositions: [...next] })),
    });
  }, [openSubPositionModal, form.mainPosition, form.subPositions]);

  const positionSummary = (
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
      ) : null}
      {form.subPositions.map((p) => (
        <OnboardingPositionChip
          key={p}
          type="button"
          position={p}
          selected
          className="pointer-events-none cursor-default"
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
        />
      ))}
      {!form.mainPosition && form.subPositions.length === 0 ? (
        <span className="text-sm text-Label-Tertiary">미설정</span>
      ) : null}
    </div>
  );

  return (
    <ModalLayout
      title="프로필 수정"
      wrapperClassName="max-h-[90vh] scrollbar-hide"
    >
      <div className="flex flex-col gap-y-10 pb-2">
        <ProfileEditImageBlock
          currentImage={form.profilePreviewUrl}
          onDefaultImageSelect={(image) =>
            setForm((prev) => ({ ...prev, profilePreviewUrl: image }))
          }
        />

        <div className="flex flex-col gap-y-6">
          <TextField
            variant="boxed"
            required
            label="이름"
            placeholder="이름을 입력해주세요"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <TextField
            variant="boxed"
            required
            label="생년월일"
            placeholder="1999-00-00"
            type="text"
            value={form.birthDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, birthDate: e.target.value }))
            }
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
                포지션
              </span>
              <button
                type="button"
                className="group flex shrink-0 items-center gap-1 rounded-lg py-1.5 pl-2 pr-1 text-sm font-medium text-Label-Tertiary transition-colors hover:text-Label-Secondary"
                onClick={openSubPositions}
                aria-label="포지션 편집"
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
            {positionSummary}
          </div>

          <ProfileEditFootToggle
            value={form.foot}
            onChange={(foot) => setForm((prev) => ({ ...prev, foot }))}
          />

          <TextField
            variant="boxed"
            label="선호하는 등번호"
            placeholder="선호하는 등번호를 적어주세요."
            type="text"
            inputMode="numeric"
            value={form.preferredNumber}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                preferredNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
          />

          <TextField
            variant="boxed"
            label="좋아하는 선수"
            placeholder="좋아하는 선수를 입력해주세요"
            value={form.favoritePlayer}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                favoritePlayer: e.target.value,
              }))
            }
          />

          <TextField
            variant="boxed"
            multiline
            rows={4}
            label="간단 소개"
            placeholder="자신을 소개하는 글을 작성해주세요."
            value={form.introduction}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                introduction: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex w-full gap-3 pt-2">
          <Button
            type="button"
            variant="line"
            size="l"
            className="flex-1 border-gray-1000 bg-gray-1100 text-white"
            onClick={hideModal}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="l"
            className="flex-1"
            onClick={hideModal}
          >
            저장
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
