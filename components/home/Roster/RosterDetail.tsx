import Image from "next/image";
import StatGrid from "@/components/ui/StatGrid";
import PlayerProfileDim from "@/components/ui/PlayerProfileDim";
import PlayerProfileHeader from "./PlayerProfileHeader";
import type { RosterMember } from "./useFindManyTeamMemberQuery";

interface RosterDetailProps {
  member: Readonly<RosterMember>;
}

const RosterDetail = ({ member }: RosterDetailProps) => {
  const overall = member.overall;
  const stat = overall
    ? {
        출장: overall.appearances,
        오버롤: overall.ovr,
        골: overall.goals,
        어시: overall.assists,
        기점: overall.keyPasses,
        클린시트: overall.cleanSheets,
        주발: "R" as const,
        승률: `${overall.winRate}%`,
      }
    : {
        출장: 0,
        오버롤: 0,
        골: 0,
        어시: 0,
        기점: 0,
        클린시트: 0,
        주발: "R" as const,
        승률: "0%",
      };

  return (
    <article className="-mx-4 -mt-4 h-72.25 rounded-t-2xl">
      <div className="absolute top-0 left-0 w-full h-72.25 z-0 overflow-hidden">
        <div className="bg-linear-to-t from-surface-card to-black/0 absolute top-0 left-0 w-full h-full z-20" />
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-surface-card opacity-50" />
        <Image
          src="/images/card-bgs/normal-green.webp"
          alt=""
          role="presentation"
          fill
          sizes="(max-width: 768px) 100vw, min(50vw, 28rem)"
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-20 flex flex-col gap-2 h-full overflow-hidden rounded-t-2xl">
        <PlayerProfileDim className="-bottom-13 h-59 lg:h-76 w-full -z-10 opacity-50 lg:opacity-100 to-surface-card" />
        <PlayerProfileHeader member={member} />

        <section
          className="flex-1 px-4 pb-1.5 bg-transparent z-30"
          aria-label="선수 스탯"
        >
          <StatGrid
            stats={stat}
            className="h-full grid-rows-2"
            itemClassName="h-full bg-[#555555]/10 backdrop-blur-[0.625rem]"
          />
        </section>
      </div>
    </article>
  );
};

export default RosterDetail;
