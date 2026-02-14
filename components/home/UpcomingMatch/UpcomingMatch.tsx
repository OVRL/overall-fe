import UpcomingMatchDesktop from "./UpcomingMatchDesktop";
import UpcomingMatchMobile from "./UpcomingMatchMobile";

/**
 * 다가오는 경기 카드 컴포넌트
 * 반응형 분기 처리 (Mobile < 768px, Desktop >= 768px)
 */
const UpcomingMatch = () => {
  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      <UpcomingMatchMobile />
      <UpcomingMatchDesktop />
    </div>
  );
};

export default UpcomingMatch;
