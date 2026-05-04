import React from "react";
import StatCard from "./StatCard";
import OvrCard from "./OvrCard";
import PositionCard from "./PositionCard";
import ImgPlayer from "@/components/ui/ImgPlayer";
import Icon from "@/components/ui/Icon";
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
import { cn } from "@/lib/utils";
import edit_icon from "@/public/icons/edit.svg";

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
      <div className="flex md:hidden flex-col items-center justify-center w-full mb-2">
        <div className="relative size-[150px]">
          <div className="size-full overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
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
            pendingLabel=""
            className="absolute bottom-0 right-0 size-10 flex items-center justify-center bg-gray-1200 hover:bg-gray-1100 rounded-full border-none shadow-lg p-0"
            onClick={pickFromAlbum}
          >
            <Icon src={edit_icon} width={20} height={20} className="text-gray-400" />
          </PendingActionButton>
        </div>
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
        aria-label="프로필, OVR 및 포지션"
        className="flex min-w-0 justify-start gap-4 w-full flex-col md:flex-row shrink-0 list-none m-0 p-0"
      >
        <li className="hidden md:flex flex-col items-center justify-center shrink-0 h-[275px] flex-1 min-w-70">
          <div className="relative size-[200px]">
            <div className="size-full overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
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
              pendingLabel=""
              className="absolute bottom-0 right-0 size-10 flex items-center justify-center bg-gray-1200 hover:bg-gray-1100 rounded-full border-none shadow-lg p-0"
              onClick={pickFromAlbum}
            >
              <Icon src={edit_icon} width={20} height={20} className="text-gray-400" />
            </PendingActionButton>
          </div>
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

      {/* Row 2: 주요 스탯 (경기수, 골, 도움, 클린시트 통합 카드) */}
      <dl
        aria-label="주요 기록"
        className="grid grid-cols-2 md:flex w-full bg-gray-1300 border border-gray-1100 rounded-[0.875rem] overflow-hidden m-0 p-0"
      >
        {[
          { title: "경기 수", value: appearances, icon: whistleIcon },
          { title: "골", value: goals, icon: ballIcon },
          { title: "도움", value: assists, icon: cleatsIcon },
          { title: "클린시트", value: cleanSheets, icon: shieldIcon },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="relative flex flex-col justify-between flex-1 md:min-w-35 shrink-0 p-4 h-32 md:h-41"
          >
            <dt className="flex items-center gap-2 m-0 font-normal">
              <div
                className="size-10 bg-gray-1200 rounded-[0.625rem] flex items-center justify-center shrink-0 p-1.25"
                aria-hidden
              >
                <Icon src={stat.icon} nofill width={28} height={28} alt="" />
              </div>
              <span className="text-xl font-semibold text-gray-500 whitespace-nowrap">
                {stat.title}
              </span>
            </dt>
            <dd className="self-end text-[2rem] font-bold text-white leading-none pr-1 pb-1 m-0 tabular-nums">
              {stat.value}
            </dd>
            {/* Vertical divider */}
            <div
              className={cn(
                "absolute right-0 top-4 bottom-4 w-[1px] bg-gray-1100",
                idx === 0 ? "block" : idx === 1 ? "hidden md:block" : idx === 2 ? "block" : "hidden",
              )}
            />
            {/* Horizontal divider (mobile only) */}
            {idx < 2 && (
              <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gray-1100 md:hidden" />
            )}
          </div>
        ))}
      </dl>

      {/* Row 3: 추가 스탯 (MOM 통합 카드) */}
      <dl
        aria-label="추가 기록"
        className="flex w-full bg-gray-1300 border border-gray-1100 rounded-[0.875rem] h-41 overflow-hidden m-0 p-0"
      >
        {[
          { title: "MOM 3", value: mom3, icon: goldTrophyIcon },
          { title: "MOM 8", value: mom8, icon: silverTrophyIcon },
        ].map((stat, idx, arr) => (
          <div
            key={idx}
            className="relative flex flex-col justify-between flex-1 md:min-w-35 shrink-0 p-4"
          >
            <dt className="flex items-center gap-2 m-0 font-normal">
              <div
                className="size-10 bg-gray-1200 rounded-[0.625rem] flex items-center justify-center shrink-0 p-1.25"
                aria-hidden
              >
                <Icon src={stat.icon} nofill width={28} height={28} alt="" />
              </div>
              <span className="text-xl font-semibold text-gray-500 whitespace-nowrap">
                {stat.title}
              </span>
            </dt>
            <dd className="self-end text-[2rem] font-bold text-white leading-none pr-1 pb-1 m-0 tabular-nums">
              {stat.value}
            </dd>
            {idx < arr.length - 1 && (
              <div className="absolute right-0 top-4 bottom-4 w-[1px] bg-gray-1100" />
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
