"use client";

import React, { useState, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import UpcomingMatch from "@/components/home/UpcomingMatch";
import StartingXI from "@/components/home/StartingXI";
import PlayerCard from "@/components/home/PlayerCard";
import PlayerList from "@/components/home/PlayerList";

import { Player } from "@/types/player";

// Initial Data moved outside component to prevent recreation on re-renders
const INITIAL_PLAYERS: Player[] = [
  {
    id: 1,
    name: "박무트",
    position: "GK",
    number: 26,
    overall: 90,
    shooting: 25,
    passing: 40,
    dribbling: 16,
    defending: 90,
    physical: 60,
    pace: 50,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-1.png",
  },
  {
    id: 2,
    name: "호남두호남두",
    position: "LB",
    number: 26,
    overall: 90,
    shooting: 40,
    passing: 85,
    dribbling: 80,
    defending: 75,
    physical: 70,
    pace: 85,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-2.png",
  },
  {
    id: 3,
    name: "가깝밤베스",
    position: "CB",
    number: 26,
    overall: 90,
    shooting: 30,
    passing: 65,
    dribbling: 55,
    defending: 90,
    physical: 85,
    pace: 65,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-3.png",
  },
  {
    id: 4,
    name: "다라에밤베스",
    position: "CB",
    number: 26,
    overall: 90,
    shooting: 35,
    passing: 70,
    dribbling: 60,
    defending: 92,
    physical: 88,
    pace: 68,
    season: "3M",
    seasonType: "worldBest",
    image: "/images/player/img_player-4.png",
  },
  {
    id: 5,
    name: "박무트",
    position: "RB",
    number: 26,
    overall: 90,
    shooting: 45,
    passing: 80,
    dribbling: 75,
    defending: 78,
    physical: 72,
    pace: 82,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-5.png",
  },
  {
    id: 6,
    name: "렌디",
    position: "CDM",
    number: 26,
    overall: 90,
    shooting: 65,
    passing: 88,
    dribbling: 82,
    defending: 72,
    physical: 75,
    pace: 78,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-6.png",
  },
  {
    id: 7,
    name: "제스퍼",
    position: "CDM",
    number: 26,
    overall: 90,
    shooting: 75,
    passing: 90,
    dribbling: 88,
    defending: 65,
    physical: 68,
    pace: 80,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-7.png",
  },
  {
    id: 8,
    name: "알베스",
    position: "CAM",
    number: 26,
    overall: 99,
    shooting: 70,
    passing: 92,
    dribbling: 85,
    defending: 68,
    physical: 70,
    pace: 82,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-8.png",
  },
  {
    id: 9,
    name: "수원알베스",
    position: "ST",
    number: 26,
    overall: 90,
    shooting: 92,
    passing: 82,
    dribbling: 88,
    defending: 40,
    physical: 78,
    pace: 90,
    season: "3M",
    seasonType: "worldBest",
    image: "/images/player/img_player-9.png",
  },
  {
    id: 10,
    name: "박무트",
    position: "ST",
    number: 26,
    overall: 90,
    shooting: 99,
    passing: 90,
    dribbling: 95,
    defending: 35,
    physical: 80,
    pace: 95,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-10.png",
  },
  {
    id: 11,
    name: "박무트",
    position: "ST",
    number: 26,
    overall: 90,
    shooting: 94,
    passing: 85,
    dribbling: 90,
    defending: 38,
    physical: 82,
    pace: 92,
    season: "26",
    seasonType: "general",
    image: "/images/player/img_player-11.png",
  },
];

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
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
    <div className="min-h-screen bg-surface-primary">
      <Header showTeamSelector selectedTeam="바르셀로나 FC" />

      <main className="max-w-[1400px] mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left: Next Match + Starting XI */}
          <div>
            <UpcomingMatch />
            <StartingXI
              players={players}
              onPlayersChange={handlePlayersChange}
              onPlayerSelect={handlePlayerSelect}
            />
          </div>

          {/* Right: Player Card + Player List */}
          <div>
            {selectedPlayer && <PlayerCard player={selectedPlayer} />}
            <PlayerList players={players} onPlayerSelect={handlePlayerSelect} />
          </div>
        </div>
      </main>
    </div>
  );
}
