import React from "react";
import { cn } from "@/lib/utils";
import MatchScheduleCardDesktop from "./MatchScheduleCardDesktop";
import type { UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import type { MatchScheduleVenueInput } from "@/lib/formation/matchToScheduleCardProps";

interface MatchScheduleCardProps {
  matchScheduleLine?: string;
  venue?: MatchScheduleVenueInput;
  opponent?: string;
  /** 추후 상대 전적 — UI 숨김, 데이터 파이프라인용으로 유지 */
  opponentRecord?: string;
  uniformDesign?: UniformDesign;
  uniformKindLabel?: string;
  opponentEmblemSrc?: string | null;
  className?: string;
}

const DEFAULT_VENUE: MatchScheduleVenueInput = {
  address: "수원 월드컵 보조 구장 A",
  latitude: 0,
  longitude: 0,
};

const MatchScheduleCard: React.FC<MatchScheduleCardProps> = ({
  matchScheduleLine = "2026-02-03(목) 18:00~20:00",
  venue = DEFAULT_VENUE,
  opponent = "FC 빠름셀로나",
  opponentRecord = "전적 2승 1무 1패",
  uniformDesign = "SOLID_RED",
  uniformKindLabel = "홈 유니폼",
  opponentEmblemSrc,
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
        <MatchScheduleCardDesktop
          matchScheduleLine={matchScheduleLine}
          venue={venue}
          opponent={opponent}
          opponentRecord={opponentRecord}
          uniformDesign={uniformDesign}
          uniformKindLabel={uniformKindLabel}
          opponentEmblemSrc={opponentEmblemSrc}
        />
      </div>
    </section>
  );
};

export default MatchScheduleCard;
