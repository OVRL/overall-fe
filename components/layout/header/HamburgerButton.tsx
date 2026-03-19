"use client";

import { useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useClickOutside } from "@/hooks/useClickOutside";
import Icon from "@/components/ui/Icon";
import { HamburgerMenuContent } from "@/components/layout/header/HamburgerMenuContent";
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
 * 햄버거 버튼: 뷰포트에 따라 단일 책임으로 동작 분기
 * - 모바일: 클릭 시 메뉴 토글 (onToggle)
 * - PC(lg~): 클릭 시 툴팁 모양 틀만 토글 (내부 UI는 이 컴포넌트 안에서 구현)
 */
export function HamburgerButton({
  isMenuOpen,
  onToggle,
  ariaControlsId,
}: HamburgerButtonProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const [isFrameOpen, setIsFrameOpen] = useState(false);

  const handleClick = () => {
    if (isDesktop === true) {
      setIsFrameOpen((prev) => !prev);
      return;
    }
    onToggle();
  };

  const isToggleButton = isDesktop !== true;
  /** PC에서만 클릭 시 툴팁 틀 노출 (모바일은 기존 드롭다운만 사용) */
  const isFrameVisible = isDesktop === true && isFrameOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    if (isFrameOpen) setIsFrameOpen(false);
  });

  return (
    <div ref={containerRef} className="relative group">
      <button
        type="button"
        onClick={handleClick}
        className="text-white hover:text-primary transition-colors text-xl cursor-pointer p-3"
        aria-label={
          isToggleButton
            ? isMenuOpen
              ? "메뉴 닫기"
              : "메뉴 열기"
            : isFrameOpen
            ? "메뉴 닫기"
            : "메뉴 열기"
        }
        aria-expanded={isToggleButton ? isMenuOpen : isFrameOpen}
        aria-controls={isToggleButton ? ariaControlsId : undefined}
        aria-haspopup={isDesktop === true ? "dialog" : undefined}
      >
        <Icon src={hamburgerIcon} alt="메뉴 열기" className="w-6 h-6" nofill />
      </button>
      {/* PC에서 클릭 시 노출되는 툴팁 모양 틀 (내부: 내 정보 / 로그아웃 / 팀 목록) */}
      {isFrameVisible && (
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
