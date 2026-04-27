"use client";

import React, { Fragment, Suspense, useState, useCallback } from "react";
import StartingXI from "@/components/home/StartingXI";
import HomeStartingXIWithBestEleven from "@/components/home/StartingXI/HomeStartingXIWithBestEleven";
import HomePlayerRosterSlot from "@/components/home/Roster/HomePlayerRosterSlot";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { Player } from "@/types/player";
import Skeleton from "@/components/ui/Skeleton";

interface SquadManagerProps {
  initialPlayers: Player[];
  upcomingMatchSlot: React.ReactNode;
}

function StartingXISkeleton() {
  return (
    <div
      className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 flex-1 border border-border-card min-h-80 flex flex-col gap-4"
      aria-busy="true"
      aria-label="Starting XI 로딩 중"
    >
      <Skeleton className="h-8 w-32 rounded-md" />
      <Skeleton className="flex-1 min-h-64 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

export default function SquadManager({
  initialPlayers,
  upcomingMatchSlot,
}: SquadManagerProps) {
  const { isSoloTeam, selectedTeamIdNum } = useSelectedTeamId();
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
        {selectedTeamIdNum != null ? (
          <Suspense key="home-starting-xi" fallback={<StartingXISkeleton />}>
            <HomeStartingXIWithBestEleven
              teamId={selectedTeamIdNum}
              fallbackPlayers={players}
              isSoloTeam={isSoloTeam}
              onPlayersChange={handlePlayersChange}
              onPlayerSelect={handlePlayerSelect}
            />
          </Suspense>
        ) : (
          <StartingXI
            key="home-starting-xi"
            players={players}
            isSoloTeam={isSoloTeam}
            onPlayersChange={handlePlayersChange}
            onPlayerSelect={handlePlayerSelect}
          />
        )}
      </section>

      {/* Right: Player Card + Player List (자체 쿼리로 데이터 조회) */}
      <div
        key="home-squad-roster"
        className="relative overflow-hidden max-lg:w-full h-full flex justify-center bg-surface-card border border-border-card rounded-xl shadow-card"
      >
        <HomePlayerRosterSlot className="w-92 md:w-92 lg:w-84 xl:w-90 2xl:w-98.2" />
      </div>
    </div>
  );
}
