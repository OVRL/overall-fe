"use client";

import React, { useState, useCallback } from "react";
import StartingXI from "@/components/home/StartingXI";
import PlayerRosterPanel from "@/components/home/Roster/PlayerRosterPanel";
import { Player } from "@/types/player";

interface SquadManagerProps {
  initialPlayers: Player[];
  upcomingMatchSlot: React.ReactNode;
}

export default function SquadManager({
  initialPlayers,
  upcomingMatchSlot,
}: SquadManagerProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Initialize selected player
  React.useEffect(() => {
    if (!selectedPlayer) {
      // Default to ID 8 (Alves) or first player
      const defaultPlayer = players.find((p) => p.id === 8) || players[0];
      if (defaultPlayer) setSelectedPlayer(defaultPlayer);
    }
  }, [players, selectedPlayer]);

  // Memoized handlers to prevent unnecessary re-renders of children
  const handlePlayersChange = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
  }, []);

  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedPlayer(player);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl justify-center items-center lg:items-start 2xl:max-w-none">
      {/* Left: Next Match + Starting XI */}
      <section className="w-full lg:w-156 xl:w-225 2xl:w-225 h-full flex flex-col gap-4">
        {upcomingMatchSlot}
        <StartingXI
          players={players}
          onPlayersChange={handlePlayersChange}
          onPlayerSelect={handlePlayerSelect}
        />
      </section>

      {/* Right: Player Card + Player List */}
      <div className="max-lg:w-full h-full flex justify-center bg-surface-card border border-border-card rounded-xl shadow-[0_4px_8px_0_rgba(0,0,0,0.5)]">
        <PlayerRosterPanel
          players={players}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={handlePlayerSelect}
          className="md:w-92 lg:w-84 xl:w-90 2xl:w-98.25"
        />
      </div>
    </div>
  );
}
