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
  leftAction: {
    icon: StaticImageData;
    alt: string;
  };
  logo: ReactNode;
  rightLabel: string;
  onRightClick: () => void;
};

type DesktopHeaderProps = {
  variant?: "desktop";
  onBack?: () => void;
  onReset?: () => void;
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
        <div className="z-10 flex shrink-0 items-center">
          <button
            type="button"
            onClick={handleMobileReset}
            className="z-10 cursor-pointer p-2 font-semibold text-red-400"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onRightClick}
            className="text-[#F7F8F8] z-10 cursor-pointer p-2 font-semibold"
          >
            {rightLabel}
          </button>
        </div>
      </header>
    );
  }

  const { onBack, onReset: desktopOnReset } = p;
  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
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
          <Icon src={arrowBack} alt="뒤로 가기" width={24} height={24} />
        </button>
        <p className="text-[#F7F8F8] font-semibold leading-6">
          모든 변경사항은 저장 버튼을 눌러야 반영됩니다.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="line"
          size="m"
          className="w-fit border-red-500 p-3 font-semibold text-red-400"
          onClick={() => desktopOnReset?.()}
        >
          초기화
        </Button>
        <Button variant="primary" size="m" className="w-fit p-3 font-semibold">
          포메이션 저장하기
        </Button>
      </div>
    </header>
  );
};

export default Header;
