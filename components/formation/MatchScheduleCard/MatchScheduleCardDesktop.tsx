import React from "react";
import Image from "next/image";
import fire from "@/public/icons/fire.svg";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { EmblemImage } from "@/components/ui/EmblemImage";
import MatchInfoRow from "./MatchInfoRow";
import { MatchScheduleCardVenueRow } from "./MatchScheduleCardVenueRow";
import type { UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import type { MatchScheduleVenueInput } from "@/lib/formation/matchToScheduleCardProps";

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
}) => {
  const uniformImagePath = getUniformImagePath(uniformDesign);

  return (
    <div className="hidden md:flex flex-col gap-4 relative">
      <div className="flex items-center gap-2.5">
        <Icon src={fire} nofill width={24} height={24} />
        <h2 className="font-semibold text-[#f7f8f8] leading-6">경기 정보</h2>
      </div>
      <Button
        variant="primary"
        size="s"
        className="absolute -top-1 -right-3 w-fit px-3.5 py-3"
      >
        경기 설정 변경
      </Button>
      <div className="flex items-center justify-between w-full max-w-170">
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
    </div>
  );
};

export default MatchScheduleCardDesktop;
