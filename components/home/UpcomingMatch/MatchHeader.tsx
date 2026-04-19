import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import calendar from "@/public/icons/calendar.svg";

type MatchHeaderProps = {
  /** 기본: 다가오는 경기 */
  title?: string;
  /** 캘린더 아이콘(`Icon` nofill)에 적용할 클래스 — 틴트·불투명도 등 */
  iconClassName?: string;
  /** 행 컨테이너 — 타이틀은 `text-*` 상속 (기본 `text-white`) */
  rowClassName?: string;
};

/**
 * 다가오는 경기 컴포넌트 헤더 (타이틀)
 */
const MatchHeader = ({
  title = "다가오는 경기",
  iconClassName,
  rowClassName,
}: MatchHeaderProps) => (
  <div
    className={cn(
      "flex items-center justify-center md:justify-start gap-2.5 text-white",
      rowClassName,
    )}
  >
    {/* SVG 아이콘 */}
    <Icon src={calendar} nofill className={cn("shrink-0", iconClassName)} />
    <span className="font-semibold leading-6 whitespace-nowrap">
      {title}
    </span>
  </div>
);

export default MatchHeader;
