import Icon from "@/components/ui/Icon";
import calendar from "@/public/icons/calendar.svg";

/**
 * 다가오는 경기 컴포넌트 헤더 (타이틀)
 */
const MatchHeader = () => (
  <div className="flex items-center justify-center md:justify-start gap-2.5">
    {/* SVG 아이콘 */}
    <Icon src={calendar} nofill />
    <span className="font-semibold leading-6 whitespace-nowrap text-white">
      다가오는 경기
    </span>
  </div>
);

export default MatchHeader;
