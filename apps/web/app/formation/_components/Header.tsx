"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";
import { shareFormation } from "@/lib/kakao-share";

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
};

export type HeaderProps = MobileHeaderProps | DesktopHeaderProps;

function isMobileHeaderProps(p: object): p is MobileHeaderProps {
  return "variant" in p && (p as MobileHeaderProps).variant === "mobile";
}

/** 연속 탭으로 `router.back()`이 두 번 호출되는 것을 막기 위한 최소 간격(ms) */
const BACK_NAV_COOLDOWN_MS = 700;

const Header = (props?: HeaderProps) => {
  const router = useRouter();
  const bridgeRouter = useBridgeRouter();
  const lastBackNavigationAtRef = useRef(0);
  const p = props ?? {};

  const guardNavigateBack = (navigate: () => void) => {
    const now = Date.now();
    if (now - lastBackNavigationAtRef.current < BACK_NAV_COOLDOWN_MS) {
      return;
    }
    lastBackNavigationAtRef.current = now;
    navigate();
  };

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
      guardNavigateBack(() => {
        if (mobileOnBack) mobileOnBack();
        else bridgeRouter.back();
      });
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
            onClick={() => shareFormation({ matchTitle: "포메이션 공유", matchUrl: window.location.href })}
            className="z-10 cursor-pointer p-2"
            aria-label="카카오톡으로 공유"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#3A1D1D">
              <path d="M12 3C6.477 3 2 6.82 2 11.5c0 2.93 1.77 5.5 4.47 7.1L5.5 21.5l3.44-2.03C10.1 19.82 11.04 20 12 20c5.523 0 10-3.82 10-8.5S17.523 3 12 3z"/>
            </svg>
          </button>
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
  } = p;
  const handleBack = () => {
    guardNavigateBack(() => {
      if (onBack) onBack();
      else router.back();
    });
  };

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleBack}
          className="p-3 transition-all cursor-pointer hover:bg-gray-100/10 active:scale-95"
          aria-label="뒤로 가기"
        >
          <Icon src={arrowBack} alt="뒤로 가기" width={24} height={24} nofill />
        </button>
        <p className="text-[#F7F8F8] font-semibold leading-6">
          라인업·팀 드래프트는 자동 저장됩니다. 경기 반영은 「포메이션 저장하기」를
          눌러 주세요.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="line"
          size="m"
          className="w-fit p-3 font-semibold flex items-center gap-2"
          onClick={() => shareFormation({ matchTitle: "포메이션 공유", matchUrl: window.location.href })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#3A1D1D" className="dark:fill-[#FEE500]">
            <path d="M12 3C6.477 3 2 6.82 2 11.5c0 2.93 1.77 5.5 4.47 7.1L5.5 21.5l3.44-2.03C10.1 19.82 11.04 20 12 20c5.523 0 10-3.82 10-8.5S17.523 3 12 3z"/>
          </svg>
          카카오로 공유
        </Button>
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
          disabled={
            desktopSaveConfirmPending === true || desktopOnSaveConfirm == null
          }
          onClick={() => desktopOnSaveConfirm?.()}
        >
          포메이션 저장하기
        </Button>
      </div>
    </header>
  );
};

export default Header;
