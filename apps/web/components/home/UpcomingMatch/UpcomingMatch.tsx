import NoUpcomingMatch from "./NoUpcomingMatch";
import UpcomingMatchDesktop from "./UpcomingMatchDesktop";
import UpcomingMatchMobile from "./UpcomingMatchMobile";
import type { UpcomingMatchDisplay } from "./upcomingMatchDisplay";

interface UpcomingMatchProps {
  /** 다가오는 경기 1건 표시 데이터(matchId 포함). null이면 다가오는 경기 없음 UI */
  display: UpcomingMatchDisplay | null;
}

/**
 * 다가오는 경기 카드 컴포넌트 (프리젠테이셔널)
 * 반응형 분기 처리 (Mobile < 768px, Desktop >= 768px)
 * display가 null이면 "다가오는 경기가 없습니다" 표시
 */
const UpcomingMatch = ({ display }: UpcomingMatchProps) => {
  if (display == null) {
    return (
      <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
        <NoUpcomingMatch />
      </div>
    );
  }

  const mainPanel = {
    display,
    primary: { kind: "attendance" as const },
    sectionTitle: "다가오는 경기",
  };

  const noopCopy = () => {};

  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      <UpcomingMatchMobile
        splitMomBanner={null}
        main={mainPanel}
        onCopyTeamCode={noopCopy}
      />
      <UpcomingMatchDesktop
        splitMomBanner={null}
        main={mainPanel}
        onCopyTeamCode={noopCopy}
      />
    </div>
  );
};

export default UpcomingMatch;
