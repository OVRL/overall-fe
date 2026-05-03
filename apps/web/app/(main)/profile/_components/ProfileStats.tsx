import React from "react";
import StatCard from "./StatCard";
import OvrCard from "./OvrCard";
import PositionCard from "./PositionCard";
import ImgPlayer from "@/components/ui/ImgPlayer";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

import whistleIcon from "@/public/icons/player-infos/whistle.svg";
import ballIcon from "@/public/icons/player-infos/ball.svg";
import cleatsIcon from "@/public/icons/player-infos/cleats.svg";
import signpostIcon from "@/public/icons/player-infos/signpost.svg";
import shieldIcon from "@/public/icons/player-infos/shield.svg";
import goldTrophyIcon from "@/public/icons/player-infos/gold_trophy.svg";
import silverTrophyIcon from "@/public/icons/player-infos/silver_trophy.svg";
import { useUpdateTeamMemberProfileImage } from "@/hooks/useUpdateTeamMemberProfileImage";

const statsHeadingId = "profile-stats-heading";

type ProfileStatsProps = {
  member: ProfileTeamMemberRow | null;
  overall: ProfileTeamMemberRow["overall"];
};

export default function ProfileStats({ member, overall }: ProfileStatsProps) {
  const ovrScore = overall?.ovr ?? 0;
  const appearances = overall?.appearances ?? 0;
  const goals = overall?.goals ?? 0;
  const assists = overall?.assists ?? 0;
  const keyPasses = overall?.keyPasses ?? 0;
  const cleanSheets = overall?.cleanSheets ?? 0;
  const mom3 = overall?.mom3 ?? 0;
  const mom8 = overall?.mom8 ?? 0;

  const { pickFromAlbum, fileInputRef, onHiddenFileChange, previewImage, isUpdating } =
    useUpdateTeamMemberProfileImage({
      memberId: member?.id ?? 0,
      currentImage: member?.profileImg,
    });

  return (
    <section
      aria-labelledby={statsHeadingId}
      className="flex min-w-0 flex-col gap-4 max-md:gap-y-3 w-full max-w-300"
    >
      <h2 id={statsHeadingId} className="sr-only">
        활동 통계
      </h2>

      {/* 모바일 전용 프로필 영역: 가로 스크롤 리스트 밖 상단에 위치 */}
      <div className="flex md:hidden flex-col items-center justify-center gap-4 w-full mb-2">
        <div className="relative size-[150px] overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
          <ImgPlayer
            src={previewImage}
            alt="프로필 이미지"
            sizes="150px"
            className="size-full object-cover object-bottom"
          />
        </div>
        <PendingActionButton
          type="button"
          variant="ghost"
          pending={isUpdating}
          pendingLabel="프로필 이미지 업로드 중"
          className="flex h-8 w-auto items-center justify-center px-3 text-xs font-semibold text-Label-Tertiary bg-gray-1000 hover:bg-gray-900 rounded-lg border-none"
          onClick={pickFromAlbum}
        >
          수정하기
        </PendingActionButton>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onHiddenFileChange}
      />

      {/* Row 1: 프로필(데스크탑) & OVR & 주 포지션 */}
      <ul
        aria-label="프로필, OVR 및 포지션. 가로로 스크롤하여 전체를 볼 수 있습니다."
        className="flex min-w-0 justify-start gap-4 w-full flex-nowrap max-md:overflow-x-auto max-md:snap-x scrollbar-hide shrink-0 list-none m-0 p-0"
      >
        <li className="hidden md:flex flex-col items-center justify-center gap-4 shrink-0 h-[275px] w-[200px]">
          <div className="relative size-[200px] overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
            <ImgPlayer
              src={previewImage}
              alt="프로필 이미지"
              sizes="200px"
              className="size-full object-cover object-bottom"
            />
          </div>
          <PendingActionButton
            type="button"
            variant="ghost"
            pending={isUpdating}
            pendingLabel="프로필 이미지 업로드 중"
            className="flex h-9.5 w-auto items-center justify-center px-3 text-sm font-semibold text-Label-Tertiary bg-gray-1000 hover:bg-gray-900 rounded-lg border-none"
            onClick={pickFromAlbum}
          >
            수정하기
          </PendingActionButton>
        </li>
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
