import React from "react";
import StatCard from "./StatCard";
import OvrCard from "./OvrCard";
import PositionCard from "./PositionCard";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

import whistleIcon from "@/public/icons/player-infos/whistle.svg";
import ballIcon from "@/public/icons/player-infos/ball.svg";
import cleatsIcon from "@/public/icons/player-infos/cleats.svg";
import signpostIcon from "@/public/icons/player-infos/signpost.svg";
import shieldIcon from "@/public/icons/player-infos/shield.svg";
import goldTrophyIcon from "@/public/icons/player-infos/gold_trophy.svg";
import silverTrophyIcon from "@/public/icons/player-infos/silver_trophy.svg";

const statsHeadingId = "profile-stats-heading";

type ProfileStatsProps = {
  overall: ProfileTeamMemberRow["overall"];
};

export default function ProfileStats({ overall }: ProfileStatsProps) {
  const ovrScore = overall?.ovr ?? 0;
  const appearances = overall?.appearances ?? 0;
  const goals = overall?.goals ?? 0;
  const assists = overall?.assists ?? 0;
  const keyPasses = overall?.keyPasses ?? 0;
  const cleanSheets = overall?.cleanSheets ?? 0;
  const mom3 = overall?.mom3 ?? 0;
  const mom8 = overall?.mom8 ?? 0;

  return (
    <section
      aria-labelledby={statsHeadingId}
      className="flex min-w-0 flex-col gap-4 max-md:gap-y-3 w-full max-w-300"
    >
      <h2 id={statsHeadingId} className="sr-only">
        활동 통계
      </h2>

      {/* Row 1: OVR & 주 포지션 */}
      <ul
        aria-label="OVR 및 포지션. 가로로 스크롤하여 전체를 볼 수 있습니다."
        className="flex min-w-0 justify-start gap-4 w-full flex-nowrap max-md:overflow-x-auto max-md:snap-x scrollbar-hide shrink-0 list-none m-0 p-0"
      >
        <li className="contents">
          <OvrCard ovrScore={ovrScore} />
        </li>
        <li className="contents">
          <PositionCard
            positions={[
              { name: "FW", count: 42 },
              { name: "AM", count: 10 },
              { name: "RB", count: 4 },
            ]}
          />
        </li>
      </ul>

      {/* Row 2: 주요 스탯 */}
      <ul
        aria-label="주요 기록. 가로로 스크롤하여 전체를 볼 수 있습니다."
        className="flex min-w-0 justify-start gap-4 w-full flex-nowrap max-md:overflow-x-auto max-md:snap-x scrollbar-hide shrink-0 list-none m-0 p-0"
      >
        <li className="contents">
          <StatCard title="경기 수" value={appearances} icon={whistleIcon} />
        </li>
        <li className="contents">
          <StatCard title="골" value={goals} icon={ballIcon} />
        </li>
        <li className="contents">
          <StatCard title="도움" value={assists} icon={cleatsIcon} />
        </li>
        <li className="contents">
          <StatCard title="기점" value={keyPasses} icon={signpostIcon} />
        </li>
      </ul>

      {/* Row 3: 추가 스탯 */}
      <ul
        aria-label="추가 기록. 가로로 스크롤하여 전체를 볼 수 있습니다."
        className="flex min-w-0 justify-start gap-4 w-full flex-nowrap max-md:overflow-x-auto max-md:snap-x scrollbar-hide shrink-0 list-none m-0 p-0"
      >
        <li className="contents">
          <StatCard title="클린시트" value={cleanSheets} icon={shieldIcon} />
        </li>
        <li className="contents">
          <StatCard title="MOM 3" value={mom3} icon={goldTrophyIcon} />
        </li>
        <li className="contents">
          <StatCard title="MOM 8" value={mom8} icon={silverTrophyIcon} />
        </li>
      </ul>
    </section>
  );
}
