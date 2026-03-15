import TeamInfo from "./TeamInfo";
import type { UpcomingMatchDisplay } from "./upcomingMatchDisplay";

interface MatchInfoProps {
  display: UpcomingMatchDisplay;
}

/**
 * 모바일용 매치 정보 (날짜 + 가로형 팀 정보)
 */
export function MatchInfoMobile({ display }: MatchInfoProps) {
  const { formattedDateTime, homeTeam, awayTeam } = display;
  return (
    <div className="mt-6">
      <div className="text-gray-500 text-[0.8125rem] mb-2">{formattedDateTime}</div>
      <div className="flex items-center justify-center gap-3 flex-nowrap">
        <TeamInfo
          name={homeTeam.name}
          logo={homeTeam.emblemUrl}
          reverse={true}
        />
        <span className="text-gray-500 text-[0.8125rem]">VS</span>
        <TeamInfo
          name={awayTeam.name}
          logo={awayTeam.emblemUrl}
          reverse={false}
        />
      </div>
    </div>
  );
}

/**
 * PC용 매치 정보 (날짜 위, 팀 아래 세로 배치)
 */
export function MatchInfoDesktop({ display }: MatchInfoProps) {
  const { formattedDateTime, homeTeam, awayTeam } = display;
  return (
    <div className="flex flex-col items-center justify-center flex-2 gap-2">
      <span className="text-gray-500 text-[0.8125rem] whitespace-nowrap">
        {formattedDateTime}
      </span>
      <div className="flex items-center gap-3">
        <TeamInfo
          name={homeTeam.name}
          logo={homeTeam.emblemUrl}
          reverse={true}
        />
        <span className="text-gray-500 text-[0.8125rem] font-bold">VS</span>
        <TeamInfo
          name={awayTeam.name}
          logo={awayTeam.emblemUrl}
          reverse={false}
        />
      </div>
    </div>
  );
}
