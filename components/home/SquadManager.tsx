"use client";

import React, { Fragment, useState, useCallback } from "react";
import StartingXI from "@/components/home/StartingXI";
import PlayerRosterPanel from "@/components/home/Roster/PlayerRosterPanel";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { Player } from "@/types/player";

interface SquadManagerProps {
  initialPlayers: Player[];
  upcomingMatchSlot: React.ReactNode;
}

export default function SquadManager({
  initialPlayers,
  upcomingMatchSlot,
}: SquadManagerProps) {
  const { isSoloTeam } = useSelectedTeamId();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handlePlayersChange = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
  }, []);

  const handlePlayerSelect = useCallback((_player: Player) => {
    // StartingXI 전용 선택 핸들러 (추후 해당 쿼리 연동 시 사용)
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center items-center lg:items-start 2xl:max-w-none">
      {/* Left: Next Match + Starting XI — 형제 노드가 내부적으로 배열이 되므로 key 부여 */}
      <section
        key="home-squad-main"
        className="w-full lg:w-156 xl:w-225 2xl:w-225 h-full flex flex-col gap-4"
      >
        <Fragment key="home-upcoming-match">{upcomingMatchSlot}</Fragment>
        <StartingXI
          key="home-starting-xi"
          players={players}
          isSoloTeam={isSoloTeam}
          onPlayersChange={handlePlayersChange}
          onPlayerSelect={handlePlayerSelect}
        />
      </section>

      {/* Right: Player Card + Player List (자체 쿼리로 데이터 조회) */}
      <div
        key="home-squad-roster"
        className="relative overflow-hidden max-lg:w-full h-full flex justify-center bg-surface-card border border-border-card rounded-xl shadow-card"
      >
        <PlayerRosterPanel className="w-92 md:w-92 lg:w-84 xl:w-90 2xl:w-98.2" />
      </div>
    </div>
  );
}
