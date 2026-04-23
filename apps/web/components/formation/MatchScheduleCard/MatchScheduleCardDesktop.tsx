"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import fire from "@/public/icons/fire.svg";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { EmblemImage } from "@/components/ui/EmblemImage";
import MatchInfoRow from "./MatchInfoRow";
import { MatchScheduleCardVenueRow } from "./MatchScheduleCardVenueRow";
import { cn } from "@/lib/utils";
import type { UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import type { MatchScheduleVenueInput } from "@/lib/formation/matchToScheduleCardProps";
import useModal from "@/hooks/useModal";

interface MatchScheduleCardDesktopProps {
  /** 예: 2026-02-03(목) 18:00~20:00 */
  matchScheduleLine: string;
  venue: MatchScheduleVenueInput;
  opponent: string;
  /** 추후 상대 전적 API 연동 시 노출 예정 — props는 유지하고 UI만 숨김 */
  opponentRecord: string;
  uniformDesign: UniformDesign;
  uniformKindLabel: string;
  opponentEmblemSrc?: string | null;
  matchId: number;
  teamId: number;
}

const SHOW_OPPONENT_RECORD = false;

const MatchScheduleCardDesktop: React.FC<MatchScheduleCardDesktopProps> = ({
  matchScheduleLine,
  venue,
  opponent,
  opponentRecord,
  uniformDesign,
  uniformKindLabel,
  opponentEmblemSrc,
  matchId,
  teamId,
}) => {
  const { openModal } = useModal("EDIT_GAME");
  const uniformImagePath = getUniformImagePath(uniformDesign);

  const handleEditClick = useCallback(() => {
    openModal({ matchId, teamId });
  }, [openModal, matchId, teamId]);

  return (
    <div className="relative flex flex-col gap-4">
      {/* 모바일 포메이션 아코디언 바깥에 동일 제목이 있어 중복을 피함 */}
      <div className="hidden items-center gap-2.5 pr-28 md:flex">
        <Icon src={fire} nofill width={24} height={24} />
        <h2 className="font-semibold text-[#f7f8f8] leading-6">경기 정보</h2>
      </div>
      <div className="flex w-full flex-col gap-3 md:max-w-170 md:flex-row md:items-start md:justify-between md:gap-4">
        {/* Left Column: Match & Uniform */}
        <div className="flex flex-col gap-3">
          <MatchInfoRow title="매칭 상대">
            <div className="flex gap-1 items-center">
              <div className="w-7.5 h-7.5 rounded-full overflow-hidden relative shrink-0">
                <EmblemImage
                  src={opponentEmblemSrc}
                  alt={`${opponent} 엠블럼`}
                  fill
                  sizes="30px"
                />
              </div>
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {opponent}
              </span>
              {SHOW_OPPONENT_RECORD ? (
                <span className="text-[0.8125rem] text-Label-Tertiary">
                  {opponentRecord}
                </span>
              ) : null}
            </div>
          </MatchInfoRow>

          <MatchInfoRow title="유니폼">
            <div className="flex gap-1 items-center flex-1">
              <span
                className="relative w-7.5 h-7.5 shrink-0 overflow-hidden"
                aria-hidden
              >
                <Image
                  src={uniformImagePath}
                  alt=""
                  width={30}
                  height={30}
                  sizes="1.875rem"
                  quality={100}
                  className="object-contain w-full h-full"
                />
              </span>
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {uniformKindLabel}
              </span>
            </div>
          </MatchInfoRow>
        </div>

        {/* Right Column: Schedule & Stadium */}
        <div className="flex flex-col gap-3">
          <MatchInfoRow title="경기 일정">
            <div className="flex gap-3 items-center">
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {matchScheduleLine}
              </span>
            </div>
          </MatchInfoRow>

          <MatchInfoRow title="경기 구장">
            <MatchScheduleCardVenueRow venue={venue} />
          </MatchInfoRow>
        </div>
      </div>
      <Button
        variant="primary"
        size="s"
        onClick={handleEditClick}
        className={cn(
          "w-full shrink-0 justify-center px-3.5 py-3 md:absolute md:-top-1 md:-right-3 md:mt-0 md:w-fit",
        )}
      >
        경기 설정 변경
      </Button>
    </div>
  );
};

export default MatchScheduleCardDesktop;
