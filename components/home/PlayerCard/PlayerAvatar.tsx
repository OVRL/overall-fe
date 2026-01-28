import Image from "next/image";
const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  overall: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  pace: number;
  image?: string;
  season?: string;
  seasonType?: "general" | "worldBest";
}

const PlayerAvatar = ({
  player,
  imageError,
  setImageError,
}: {
  player: Player;
  imageError: boolean;
  setImageError: (error: boolean) => void;
}) => {
  const playerImage =
    imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

  return (
    <div className="relative w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br">
      <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 bg-primary text-black px-1.5 md:px-2 py-0.5 md:py-1 rounded text-base md:text-lg font-black z-10">
        {player.overall}
      </div>
      <div className="absolute bottom-0 right-0 w-full h-full">
        <Image
          src={playerImage}
          alt={player.name}
          fill
          className="object-contain object-bottom"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
};

export default PlayerAvatar;
