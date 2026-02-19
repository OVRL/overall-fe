import React from "react";
import { cn } from "@/lib/utils";
import MatchScheduleCardMobile from "./MatchScheduleCardMobile";
import MatchScheduleCardDesktop from "./MatchScheduleCardDesktop";

interface MatchScheduleCardProps {
  matchDate?: string;
  matchTime?: string;
  stadium?: string;
  opponent?: string;
  opponentRecord?: string;
  homeUniform?: string;
  className?: string;
}

const MatchScheduleCard: React.FC<MatchScheduleCardProps> = ({
  matchDate = "2026-02-03(목)",
  matchTime = "18:00~20:00",
  stadium = "수원 월드컵 보조 구장 A",
  opponent = "FC 빠름셀로나",
  opponentRecord = "전적 2승 1무 1패",
  homeUniform = "빨강",
  className,
}) => {
  return (
    <section aria-label="경기 정보">
      <div
        className={cn(
          "bg-surface-card border border-border-card rounded-xl shadow-[0_4px_8px_rgba(0, 0, 0, 0.50)] w-full shrink-0 py-4 px-6",
          className,
        )}
      >
        <MatchScheduleCardMobile matchDate={matchDate} />
        <MatchScheduleCardDesktop
          matchDate={matchDate}
          matchTime={matchTime}
          stadium={stadium}
          opponent={opponent}
          opponentRecord={opponentRecord}
          homeUniform={homeUniform}
        />
      </div>
    </section>
  );
};

export default MatchScheduleCard;
