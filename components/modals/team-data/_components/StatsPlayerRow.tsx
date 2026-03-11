import PositionChip from "@/components/PositionChip";
import type { Player } from "@/app/(main)/team-data/_types/player";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Racing_Sans_One } from "next/font/google";

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
});

interface StatsPlayerRowProps {
  player: Player;
  index: number;
  onPlayerClick?: (player: Player) => void;
}

const StatsPlayerRow = ({
  player,
  index,
  onPlayerClick,
}: StatsPlayerRowProps) => {
  return (
    <li
      className="flex items-center hover:bg-gray-800/50 transition-colors cursor-pointer justify-between"
      onClick={() => onPlayerClick?.(player)}
    >
      {/* 순위 - 1등은 primary, 나머지는 흰색 */}
      <span
        className={`${racingSansOne.className} text-sm w-7.5 text-center ${index === 0 ? "text-Label-AccentPrimary" : "text-Label-Primary"}`}
      >
        {index + 1}
      </span>

      <div className="flex gap-2">
        {/* 선수 이미지 */}
        <ProfileAvatar src={player.image || ""} alt={player.name} size={36} />

        {/* 포지션 칩 + 이름 */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div className="w-10.5 flex justify-center">
            <PositionChip
              position={player.position}
              variant="outline"
              className="text-[10px] px-1.5 py-0.5"
            />
          </div>
          <span
            className={`w-18.75 text-sm truncate ${index === 0 ? "text-Label-AccentPrimary" : "text-Label-Primary"}`}
          >
            {player.name}
          </span>
        </div>
      </div>
      {/* 능력치 값 (숫자만 추출) */}
      <span className="text-Label-AccentPrimary w-12.25 font-bold text-sm shrink-0">
        {String(player.value).replace(/[^0-9]/g, "")}
      </span>
    </li>
  );
};

export default StatsPlayerRow;
