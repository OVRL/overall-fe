import Image from "next/image";
import silverTrophyIcon from "@/public/icons/player-infos/silver_trophy.svg";

interface BasePosition {
  name: string;
  count: number;
}

interface PositionCardProps {
  positions: BasePosition[];
}

// TODO: 실제 포지션 타입 정의에 맞추어 색상 매핑을 추가합니다.
const POSITION_COLORS: Record<string, string> = {
  FW: "bg-Position-FW-Red",
  AM: "bg-Position-MF-Green",
  RB: "bg-Position-DF-Blue",
  // 필요한 포지션 색상 추가
};

/** 프로필 통계 영역에 PositionCard가 하나만 있을 때 사용 (페이지당 id 유일). */
const POSITION_CARD_HEADING_ID = "profile-position-card-heading";

export default function PositionCard({ positions }: PositionCardProps) {
  if (positions.length === 0) {
    return null;
  }

  const mainPosition = positions[0];
  const subPositions = positions.slice(1);

  return (
    <section
      aria-labelledby={POSITION_CARD_HEADING_ID}
      className="flex-1 min-w-70 snap-start bg-gray-1200 border border-gray-1100 rounded-[0.875rem] p-4 flex flex-col justify-between shrink-0"
    >
      <div className="flex items-center gap-2">
        <div
          className="size-10 bg-gray-1300 rounded-lg flex items-center justify-center shrink-0 p-1.5"
          aria-hidden
        >
          <Image src={silverTrophyIcon} alt="" width={28} height={28} />
        </div>
        <span
          id={POSITION_CARD_HEADING_ID}
          className="text-base font-semibold text-gray-500"
        >
          주 포지션
        </span>
      </div>
      <ul className="flex items-center justify-center w-full gap-6 pb-2 m-0 list-none p-0">
        {mainPosition && (
          <li className="flex flex-col items-center gap-2">
            <div
              className={`size-22.5 rounded-full ${
                POSITION_COLORS[mainPosition.name] || "bg-gray-300"
              } flex items-center justify-center`}
            >
              <span className="text-[2rem] font-bold text-black" translate="no">
                {mainPosition.name}
              </span>
            </div>
            <span className="text-sm font-medium text-[#a6a5a5] tabular-nums">
              {mainPosition.count}회
            </span>
          </li>
        )}
        {subPositions.map((pos) => (
          <li key={pos.name} className="flex flex-col items-center gap-2">
            <div
              className={`size-16 rounded-full ${
                POSITION_COLORS[pos.name] || "bg-gray-300"
              } flex items-center justify-center`}
            >
              <span
                className="text-[1.625rem] font-bold text-black"
                translate="no"
              >
                {pos.name}
              </span>
            </div>
            <span className="text-sm font-medium text-[#a6a5a5] tabular-nums">
              {pos.count}회
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
