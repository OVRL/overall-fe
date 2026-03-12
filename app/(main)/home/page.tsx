"use client";

import React, { useEffect } from "react";
import UpcomingMatch from "@/components/home/UpcomingMatch";
import SquadManager from "@/components/home/SquadManager";
import { INITIAL_PLAYERS } from "@/data/players";
import { useUserStore } from "@/contexts/UserContext";

export default function HomePage() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("Global User State (Zustand): ", user);
  }, [user]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="w-full py-6 sm:px-2 lg:px-6 flex-1 flex justify-center">
        <SquadManager
          initialPlayers={INITIAL_PLAYERS}
          upcomingMatchSlot={<UpcomingMatch />}
        />
      </main>
    </div>
  );
}
