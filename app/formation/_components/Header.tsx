"use client";

import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";

type MobileHeaderProps = {
  variant: "mobile";
  /** 미지정 시 웹뷰 대응 브릿지 라우터로 뒤로가기 */
  onBack?: () => void;
  onReset?: () => void;
  /** 임시저장 (포메이션 드래프트) */
  onSaveDraft?: () => void;
  isSaveDraftPending?: boolean;
  leftAction: {
    icon: StaticImageData;
    alt: string;
  };
  logo: ReactNode;
  rightLabel: string;
  onRightClick: () => void;
  /** `onSaveConfirm` 미전달 시 비활성 (로그인 없음 등) */
  saveConfirmDisabled?: boolean;
  isSaveConfirmPending?: boolean;
};

type DesktopHeaderProps = {
  variant?: "desktop";
  onBack?: () => void;
  onReset?: () => void;
  onSaveDraft?: () => void;
  isSaveDraftPending?: boolean;
  onSaveConfirm?: () => void;
  isSaveConfirmPending?: boolean;
  /** 확정 버튼 비활성 (쿼터 미완성 등) — `onSaveConfirm`이 있어도 적용 */
  saveConfirmDisabled?: boolean;
  /** 좌측 뒤로가기 옆 안내 문구 */
  hintText?: string;
  /** 확정 버튼 라벨 */
  confirmLabel?: string;
};

export type HeaderProps = MobileHeaderProps | DesktopHeaderProps;

function isMobileHeaderProps(p: object): p is MobileHeaderProps {
  return "variant" in p && (p as MobileHeaderProps).variant === "mobile";
}

const Header = (props?: HeaderProps) => {
  const router = useRouter();
  const bridgeRouter = useBridgeRouter();
  const p = props ?? {};

  if (isMobileHeaderProps(p)) {
    const {
      leftAction,
      logo,
      rightLabel,
      onRightClick,
      onBack: mobileOnBack,
      onReset: mobileOnReset,
      onSaveDraft: mobileOnSaveDraft,
      isSaveDraftPending: mobileSaveDraftPending,
      isSaveConfirmPending: mobileSaveConfirmPending,
      saveConfirmDisabled: mobileSaveConfirmDisabled,
    } = p;
    const handleMobileBack = () => {
      if (mobileOnBack) mobileOnBack();
      else bridgeRouter.back();
    };
    const handleMobileReset = () => {
      mobileOnReset?.();
    };
    return (
      <header className="relative flex items-center justify-between p-4">
        <button
          type="button"
          onClick={handleMobileBack}
          className="z-10 p-3 transition-all cursor-pointer hover:bg-gray-100/10 active:scale-95"
          aria-label={leftAction.alt}
        >
          <Icon
            src={leftAction.icon}
            alt={leftAction.alt}
            width={24}
            height={24}
          />
        </button>
        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <div className="pointer-events-auto">{logo}</div>
        </div>
        <div className="z-10 flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleMobileReset}
            className="z-10 cursor-pointer p-2 font-semibold text-red-400"
          >
            초기화
          </button>
          {mobileOnSaveDraft != null ? (
            <button
              type="button"
              onClick={mobileOnSaveDraft}
              disabled={mobileSaveDraftPending === true}
              className="text-Label-Tertiary z-10 cursor-pointer p-2 text-sm font-semibold disabled:opacity-50"
            >
              임시저장
            </button>
          ) : null}
          <button
            type="button"
            onClick={onRightClick}
            disabled={
              mobileSaveConfirmPending === true ||
              mobileSaveConfirmDisabled === true
            }
            className="text-[#F7F8F8] z-10 cursor-pointer p-2 font-semibold disabled:opacity-50"
          >
            {rightLabel}
          </button>
        </div>
      </header>
    );
  }

  const {
    onBack,
    onReset: desktopOnReset,
    onSaveDraft: desktopOnSaveDraft,
    isSaveDraftPending: desktopSaveDraftPending,
    onSaveConfirm: desktopOnSaveConfirm,
    isSaveConfirmPending: desktopSaveConfirmPending,
    saveConfirmDisabled: desktopSaveConfirmDisabled,
    hintText: desktopHintText,
    confirmLabel: desktopConfirmLabel,
  } = p;
  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const desktopHint =
    desktopHintText ??
    "쿼터별로 선수를 배정한 뒤 확정해 주세요.";
  const desktopConfirm = desktopConfirmLabel ?? "확정";
  const desktopConfirmBlocked =
    desktopSaveConfirmPending === true ||
    desktopOnSaveConfirm == null ||
    desktopSaveConfirmDisabled === true;

  return (
    <header className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-1 md:items-center">
        <button
          type="button"
          onClick={handleBack}
          className="shrink-0 p-3 transition-all cursor-pointer hover:bg-gray-100/10 active:scale-95"
          aria-label="뒤로 가기"
        >
          <Icon src={arrowBack} alt="뒤로 가기" width={24} height={24} />
        </button>
        <p className="text-text-primary min-w-0 pt-2 text-sm font-semibold leading-snug md:pt-0 md:text-base md:leading-6">
          {desktopHint}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:gap-4">
        <Button
          variant="line"
          size="m"
          className="w-fit border-red-500 p-3 font-semibold text-red-400"
          onClick={() => desktopOnReset?.()}
        >
          초기화
        </Button>
        {desktopOnSaveDraft != null ? (
          <Button
            type="button"
            variant="line"
            size="m"
            className="w-fit p-3 font-semibold"
            disabled={desktopSaveDraftPending === true}
            onClick={desktopOnSaveDraft}
          >
            임시저장
          </Button>
        ) : null}
        <Button
          type="button"
          variant="primary"
          size="m"
          className="w-fit p-3 font-semibold"
          disabled={desktopConfirmBlocked}
          onClick={() => desktopOnSaveConfirm?.()}
        >
          {desktopConfirm}
        </Button>
      </div>
    </header>
  );
};

export default Header;
