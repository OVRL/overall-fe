import { Player } from "@/types/player";
import PlayerCard from "@/components/ui/PlayerCard";
import captain from "@/public/images/captain.webp";
import Image from "next/image";
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
        <Image
          src={captain}
          alt="captain"
          width={24}
          height={24}
          quality={100}
          className="absolute bottom-4 right-2 z-20"
        />
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
