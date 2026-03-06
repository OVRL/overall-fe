import { Player } from "@/types/player";
import Image from "next/image";
import StatGrid from "@/components/ui/StatGrid";
import PlayerProfileDim from "@/components/ui/PlayerProfileDim";
import PlayerProfileHeader from "./PlayerProfileHeader";

interface PlayerCardProps {
  player: Player;
}

const RosterDetail = ({ player }: PlayerCardProps) => {
  const mockStat = {
    출장: 25,
    오버롤: player.overall,
    골: 40,
    어시: 24,
    기점: 16,
    클린시트: 60,
    주발: "R",
    승률: "50%",
  } as const;

  return (
    <article className="-mx-4 -mt-4 h-72.25 rounded-t-2xl overflow-hidden relative">
      <Image
        src="/images/card-bgs/normal-green.webp"
        alt=""
        role="presentation"
        fill
        priority
        className="object-cover opacity-50"
      />
      <PlayerProfileDim className="-bottom-13 h-76" />

      <div className="relative z-20 flex flex-col gap-2 h-full">
        <PlayerProfileHeader player={player} />

        <section
          className="flex-1 px-4 pb-1.5 bg-transparent"
          aria-label="선수 스탯"
        >
          <StatGrid
            stats={mockStat}
            className="h-full grid-rows-2"
            itemClassName="h-full bg-[#555555]/10 backdrop-blur-[0.625rem]"
          />
        </section>
      </div>
    </article>
  );
};

export default RosterDetail;
