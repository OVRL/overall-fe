import type { Variants } from "framer-motion";

/** 루트: 섹션 간 순차 등장 */
export const startingXIRootVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/** 헤더 · 필드 블록 · 감독 정보 */
export const startingXISectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
    },
  },
};

/** 필드 위 선수 슬롯 — staggerChildren */
export const formationPlayersContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
};

export const formationPlayerSlotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 26,
    },
  },
};
