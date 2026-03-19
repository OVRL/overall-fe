import UpcomingMatch from "@/components/home/UpcomingMatch";
import SquadManager from "@/components/home/SquadManager";
import TeamCreatedModalTrigger from "@/components/home/TeamCreatedModalTrigger";
import { INITIAL_PLAYERS } from "@/data/players";

export default async function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <TeamCreatedModalTrigger />
      <main className="w-full py-6 sm:px-2 lg:px-6 flex-1 flex justify-center">
        <SquadManager
          initialPlayers={INITIAL_PLAYERS}
          upcomingMatchSlot={<UpcomingMatch />}
        />
      </main>
    </div>
  );
}
