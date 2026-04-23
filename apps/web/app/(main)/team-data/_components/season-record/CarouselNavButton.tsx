import Icon from "@/components/ui/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";
import arrowForward from "@/public/icons/arrow_forward.svg";

const POSITION_CLASS = {
  left: "-left-4",
  right: "-right-4",
} as const;

const ICON_SRC = {
  left: arrowBack,
  right: arrowForward,
} as const;

export interface CarouselNavButtonProps {
  /** 버튼 방향 (위치·아이콘 결정) */
  direction: "left" | "right";
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 접근성 라벨 */
  ariaLabel: string;
  /** 표시 여부 (false면 null 반환) */
  visible?: boolean;
}

/**
 * 캐러셀 좌/우 스크롤 네비게이션 버튼.
 * SRP: "캐러셀 방향 버튼 하나"만 담당.
 */
export default function CarouselNavButton({
  direction,
  onClick,
  ariaLabel,
  visible = true,
}: CarouselNavButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute ${POSITION_CLASS[direction]} top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-Fill_AccentPrimary opacity-0 shadow-lg transition-all duration-300 md:flex cursor-pointer group-hover:opacity-100 hover:bg-Fill_AccentPrimary/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
      aria-label={ariaLabel}
    >
      <Icon src={ICON_SRC[direction]} alt="" />
    </button>
  );
}
