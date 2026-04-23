"use client";

import { useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useClickOutside } from "@/hooks/useClickOutside";
import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import { HamburgerMenuContent } from "@/components/layout/header/HamburgerMenuContent";
import profileImg from "@/public/images/profile.webp";
import hamburgerIcon from "@/public/icons/hamburger.svg";

const DESKTOP_BREAKPOINT = "(min-width: 1024px)"; // Tailwind lg

/** 툴팁 틀: 버튼 바로 아래에서 시작해 컨텐츠 높이만큼 아래로 내려감 */
const TOOLTIP_FRAME_CLASS =
  "absolute top-full right-3 mt-2 min-w-32 rounded-xl bg-gray-900 border border-border-card shadow-lg z-10 overflow-hidden py-3 px-4";

export type HamburgerButtonProps = {
  isMenuOpen: boolean;
  onToggle: () => void;
  ariaControlsId: string;
};

/**
 * 모바일에서는 프로필(Link)과 햄버거(Toggle)가 분리되고,
 * 데스크탑에서는 프로필 버튼 하나가 메뉴 트리거 역할을 수행합니다.
 */
export function HamburgerButton({
  isMenuOpen,
  onToggle,
  ariaControlsId,
}: HamburgerButtonProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const [isFrameOpen, setIsFrameOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    if (isFrameOpen) setIsFrameOpen(false);
  });

  // 데스크탑에서는 프로필 아이콘이 툴팁을 토글
  const handleProfileClick = () => {
    if (isDesktop === true) {
      setIsFrameOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      {/* 1. 내 정보 버튼 (모바일: 링크 / 데스크탑: 툴팁 토글) */}
      {isDesktop === true ? (
        <button
          type="button"
          onClick={handleProfileClick}
          className="text-white hover:text-primary transition-all text-xl cursor-pointer px-3 h-[35px] flex items-center justify-center shrink-0 order-2 lg:order-1"
          aria-label={isFrameOpen ? "내 정보 닫기" : "내 정보 보기"}
          aria-expanded={isFrameOpen}
          aria-haspopup="dialog"
        >
          <Icon
            src={profileImg}
            alt="내 정보 보기"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      ) : (
        <Link
          href="/profile"
          className="text-white hover:text-primary transition-all text-xl cursor-pointer px-3 h-[35px] flex items-center justify-center shrink-0 order-2"
          aria-label="내 정보 보기"
        >
          <Icon
            src={profileImg}
            alt="내 정보 보기"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </Link>
      )}

      {/* 2. 햄버거 메뉴 버튼 (모바일 전용) */}
      {!isDesktop && (
        <button
          type="button"
          onClick={onToggle}
          className="text-white hover:text-primary transition-all text-xl cursor-pointer px-3 h-[35px] flex items-center justify-center shrink-0 order-1"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          aria-controls={ariaControlsId}
        >
          <Icon
            src={hamburgerIcon}
            alt="메뉴 열기"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      )}

      {/* 3. 데스크탑 전용 툴팁 메뉴 */}
      {isDesktop === true && isFrameOpen && (
        <div
          role="dialog"
          aria-label="메뉴"
          className={`${TOOLTIP_FRAME_CLASS} hidden lg:flex flex-col justify-center gap-2`}
        >
          <HamburgerMenuContent onClose={() => setIsFrameOpen(false)} />
        </div>
      )}
    </div>
  );
}
