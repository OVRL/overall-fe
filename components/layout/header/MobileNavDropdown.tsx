"use client";

import { motion } from "motion/react";
import Link from "@/components/Link";
import RegisterGameButton from "@/components/layout/header/RegisterGameButton";
import { X } from "lucide-react";
import { GlobalPortalConsumer } from "@/components/GlobalPortal/GlobalPortal";

export type MobileNavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

type MobileNavDropdownProps = {
  /** 메뉴 항목 목록 */
  menuItems: MobileNavItem[];
  /** 현재 경로 (활성 링크 판단용) */
  currentPathname: string;
  /** 링크 클릭 시 호출 (메뉴 닫기 등) */
  onLinkClick: () => void;
  /** nav 요소 id (aria-controls와 매칭) */
  id: string;
  /** player 등 일반 멤버는 경기 등록 버튼 미표시 */
  showRegisterGame?: boolean;
};

/**
 * 글로벌 헤더용 모바일 전체 화면 네비게이션 드롭다운 (Toss Simplicity 스타일).
 */
export function MobileNavDropdown({
  menuItems,
  onLinkClick,
  id,
  showRegisterGame = true,
}: MobileNavDropdownProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      y: 15, 
      transition: { duration: 0.3 } 
    },
  };

  return (
    <GlobalPortalConsumer>
      <motion.nav
        id={id}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex flex-col items-center justify-between py-12"
        aria-label="모바일 전체 메뉴"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onLinkClick}
          className="absolute top-6 right-6 p-4 text-white hover:opacity-70 transition-opacity z-10"
          aria-label="메뉴 닫기"
        >
          <X size={36} strokeWidth={1.5} />
        </button>

        {/* 중앙 링크 및 버튼 그룹 */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-8 gap-y-5 list-none">
          {menuItems.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="w-full text-center"
            >
              <Link
                href={item.href}
                onClick={onLinkClick}
                className="group inline-flex items-center justify-center gap-4 py-2 text-[24px] font-bold text-white transition-all active:scale-95"
              >
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}

          {/* 경기 등록 버튼 너비 축소 (max-w-[200px] 적용) */}
          {showRegisterGame && (
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-[200px] pt-3"
            >
              <RegisterGameButton />
            </motion.div>
          )}
        </div>

        {/* 하단 포인트 요소 */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col items-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-Fill-AccentPrimary shadow-[0_0_10px_var(--color-Fill_AccentPrimary)]" />
        </motion.div>
      </motion.nav>
    </GlobalPortalConsumer>
  );
}
