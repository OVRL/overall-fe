import React from "react";

import UpcomingMatch from "@/components/home/UpcomingMatch";
import SquadManager from "@/components/home/SquadManager";
import { INITIAL_PLAYERS } from "@/data/players";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-primary flex flex-col">
      <main className="w-full p-6 flex-1 flex justify-center">
        <SquadManager
          initialPlayers={INITIAL_PLAYERS}
          upcomingMatchSlot={<UpcomingMatch />}
        />
      </main>
    </div>
  );
}
