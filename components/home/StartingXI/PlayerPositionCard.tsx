import { Player } from "@/types/player";
import PlayerCard from "@/components/ui/PlayerCard";

interface PlayerPositionCardProps {
  player: Player;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 포메이션 내 선수 카드 컴포넌트
 */
const PlayerPositionCard = ({ player }: PlayerPositionCardProps) => {
  const playerImage = player.image ? player.image : DEFAULT_PLAYER_IMAGE;

  return (
    <div className="relative flex flex-col items-center">
      {/* 주장 배지 (첫 번째 선수에만 - Mock logic) */}
      {player.id === 5 && (
        <div className="absolute top-1 left-2 z-20 bg-yellow-400 text-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[0.625rem] md:text-xs font-black shadow-sm">
          C
        </div>
      )}
      {(
        [
          { type: "L", className: "hidden xl:flex" },
          { type: "S", className: "hidden md:flex xl:hidden" },
          { type: "XS", className: "flex md:hidden" },
        ] as const
      ).map(({ type, className }) => (
        <PlayerCard
          key={type}
          type={type}
          imgUrl={playerImage}
          playerName={player.name}
          className={className}
        />
      ))}
    </div>
  );
};

export default PlayerPositionCard;
