import Button from "@/components/ui/Button";
import MatchHeader from "./MatchHeader";
import { MatchInfoMobile } from "./MatchInfo";
import type { UpcomingMatchDisplay } from "./upcomingMatchDisplay";

interface UpcomingMatchMobileProps {
  display: UpcomingMatchDisplay;
}

/**
 * 모바일용 다가오는 경기 컴포넌트 (< 768px)
 */
const UpcomingMatchMobile = ({ display }: UpcomingMatchMobileProps) => {
  return (
    <div className="flex flex-col gap-6 md:hidden">
      <div className="text-center">
        <MatchHeader />
        <MatchInfoMobile display={display} />
      </div>
      <div className="w-full">
        <Button
          variant="primary"
          size="m"
          className="w-full font-medium text-black text-sm"
        >
          포메이션 확인
        </Button>
      </div>
    </div>
  );
};

export default UpcomingMatchMobile;
