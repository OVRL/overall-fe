import TeamInfo from "./TeamInfo";

const TEAMS = {
  HOME: {
    name: "바르셀로나 FC",
    logo: "/images/ovr.png",
    logoColor: "bg-[#004d98]",
  },
  AWAY: {
    name: "리버풀",
    logo: "/images/ovr.png",
    logoColor: "bg-[#c41e3a]",
  },
};

/**
 * 모바일용 매치 정보 (날짜 + 가로형 팀 정보)
 */
export const MatchInfoMobile = () => (
  <div className="mt-6">
    {/* 날짜 */}
    <div className="text-gray-500 text-[0.8125rem] mb-2">01.25 (토) 15:00</div>

    {/* 팀 정보 */}
    <div className="flex items-center justify-center gap-3 flex-nowrap">
      <TeamInfo
        name={TEAMS.HOME.name}
        logo={TEAMS.HOME.logo}
        logoColor={TEAMS.HOME.logoColor}
        reverse={true}
      />
      <span className="text-gray-500 text-[0.8125rem]">VS</span>
      <TeamInfo
        name={TEAMS.AWAY.name}
        logo={TEAMS.AWAY.logo}
        logoColor={TEAMS.AWAY.logoColor}
        reverse={false}
      />
    </div>
  </div>
);

/**
 * PC용 매치 정보 (날짜 위, 팀 아래 세로 배치)
 */
export const MatchInfoDesktop = () => (
  <div className="flex flex-col items-center justify-center flex-2 gap-2">
    <span className="text-gray-500 text-[0.8125rem] whitespace-nowrap">
      01.25 (토) 15:00
    </span>
    <div className="flex items-center gap-3">
      <TeamInfo
        name={TEAMS.HOME.name}
        logo={TEAMS.HOME.logo}
        logoColor={TEAMS.HOME.logoColor}
        reverse={true}
      />

      <span className="text-gray-500 text-[0.8125rem] font-bold">VS</span>

      <TeamInfo
        name={TEAMS.AWAY.name}
        logo={TEAMS.AWAY.logo}
        logoColor={TEAMS.AWAY.logoColor}
        reverse={false}
      />
    </div>
  </div>
);
