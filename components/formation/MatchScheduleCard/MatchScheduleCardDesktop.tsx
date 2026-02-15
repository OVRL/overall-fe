import React from "react";
import Image from "next/image";
import fire from "@/public/icons/fire.svg";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import MatchInfoRow from "./MatchInfoRow";

interface MatchScheduleCardDesktopProps {
  matchDate: string;
  matchTime: string;
  stadium: string;
  opponent: string;
  opponentRecord: string;
  homeUniform: string;
}

const MatchScheduleCardDesktop: React.FC<MatchScheduleCardDesktopProps> = ({
  matchDate,
  matchTime,
  stadium,
  opponent,
  opponentRecord,
  homeUniform,
}) => {
  return (
    <div className="hidden md:flex flex-col gap-4 relative">
      <div className="flex items-center gap-2.5">
        <Icon src={fire} nofill width={24} height={24} />
        <h2 className="font-semibold text-[#f7f8f8] leading-6">경기 정보</h2>
      </div>
      <Button
        variant="primary"
        size="s"
        className="absolute top-3 right-3 w-fit px-3.5 py-3"
      >
        경기 설정 변경
      </Button>
      <div className="flex items-center justify-between w-full max-w-170">
        {/* Left Column: Match & Uniform */}
        <div className="flex flex-col gap-3">
          <MatchInfoRow title="매칭 상대">
            <div className="flex gap-1 items-center">
              <div className="w-[30px] h-[30px] bg-gray-600 rounded-full overflow-hidden relative">
                <Image
                  src="/images/ovr.png"
                  alt="Team Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {opponent}
              </span>
              <span className="text-[0.8125rem] text-Label-Tertiary">
                {opponentRecord}
              </span>
            </div>
          </MatchInfoRow>

          <MatchInfoRow title="유니폼">
            <div className="flex gap-1 items-center flex-1">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden relative">
                <Image
                  src="/images/ovr_rogo.webp"
                  alt="Uniform"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-[#f7f8f8]">
                홈 유니폼
              </span>
              <span className="text-[13px] text-[#a6a5a5]">{homeUniform}</span>
            </div>
          </MatchInfoRow>
        </div>

        {/* Right Column: Schedule & Stadium */}
        <div className="flex flex-col gap-3">
          <MatchInfoRow title="경기 일정">
            <div className="flex gap-3 items-center">
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {matchDate} {matchTime}
              </span>
            </div>
          </MatchInfoRow>

          <MatchInfoRow title="경기 구장">
            <div className="flex gap-3 items-center">
              <span className="text-sm font-semibold text-[#f7f8f8]">
                {stadium}
              </span>
              <div className="flex flex-1 gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  className="px-3 text-Label-Tertiary"
                >
                  지도
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="whitespace-nowrap w-fit px-3 text-Label-Tertiary"
                >
                  주소 복사
                </Button>
              </div>
            </div>
          </MatchInfoRow>
        </div>
      </div>
    </div>
  );
};

export default MatchScheduleCardDesktop;
