import PositionChip from "@/components/PositionChip";
import ImgPlayer from "@/components/ui/ImgPlayer";
import { Player } from "@/types/player";

interface PlayerProfileHeaderProps {
  player: Player;
}

const PlayerProfileHeader = ({ player }: PlayerProfileHeaderProps) => {
  return (
    <div className="relative w-full h-39.75">
      <div className="absolute top-5.5 left-5.5 w-28 h-34 flex flex-col z-10">
        <span
          className="h-8 w-9.75 truncate font-bold text-3xl leading-8 text-white mb-3"
          aria-label={`등번호 ${player.number}`}
        >
          {player.number}
        </span>
        <h3 className="w-23.5 h-6 truncate font-bold text-lg leading-6 mb-1 text-white">
          {player.name}
        </h3>
        <div className="inline-flex gap-1 mb-4">
          <PositionChip position={player.position} />
        </div>
        <dl className="flex flex-col gap-1 text-gray-500 text-[0.6875rem]">
          <div className="flex gap-1">
            <dt className="sr-only">입단일</dt>
            <dd>입단 2023. 09. 03</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">나이</dt>
            <dd>나이 만 30세</dd>
          </div>
        </dl>
      </div>
      <ImgPlayer
        src={player.image || ""}
        alt={`${player.name} 프로필 이미지`}
        className="size-45 absolute right-7.25 top-4 z-10"
      />
    </div>
  );
};

export default PlayerProfileHeader;
