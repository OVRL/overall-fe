import Button from "@/components/ui/Button";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = () => {
  return (
    <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
      <div className="flex gap-x-6 w-full pr-25">
        <MatchHeader />
        <MatchInfoDesktop />
      </div>
      <Button
        variant="primary"
        size="m"
        className="absolute right-4 w-25 font-medium text-black text-sm"
      >
        포메이션 확인
      </Button>
    </div>
  );
};

export default UpcomingMatchDesktop;
