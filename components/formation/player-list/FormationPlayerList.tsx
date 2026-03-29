"use client";

import React from "react";
import { Player } from "@/types/formation";
import PlayerListFilter from "./PlayerListFilter";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import plus from "@/public/icons/plus.svg";
import FormationPlayerGroupList from "./FormationPlayerGroupList";
import useModal from "@/hooks/useModal";
import { useFormationPlayerList } from "@/hooks/formation/useFormationPlayerList";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";

export interface FormationPlayerListProps {
  players: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer?: (id: number) => void;
  targetPosition?: string | null;
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
}

export default function FormationPlayerList({
  players,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  onRemovePlayer,
  targetPosition,
  activePosition,
}: FormationPlayerListProps) {
  const { openModal } = useModal("PLAYER_SEARCH");
  const { matchId, teamId } = useFormationMatchIds();
  const {
    searchTerm,
    setSearchTerm,
    activePosTab,
    setActivePosTab,
    filteredPlayers,
  } = useFormationPlayerList({ players, targetPosition, activePosition });

  return (
    <section
      aria-label="선수 목록"
      className="w-full lg:w-90 2xl:w-90 flex flex-col shrink-0 transition-all duration-300"
    >
      <div className="w-full h-full flex-1 flex justify-center bg-surface-card border border-border-card rounded-xl shadow-card">
        <aside className="h-full p-4 flex flex-col gap-3 w-full md:w-92 lg:w-full">
          <PlayerListFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activePosTab={activePosTab}
            onPosTabChange={setActivePosTab}
          />
          <Button
            variant="line"
            size="m"
            onClick={() => {
              openModal({
                matchId,
                teamId,
              });
            }}
            className="flex gap-1 text-Label-Primary font-semibold"
          >
            <Icon src={plus} alt="plus icon" aria-hidden={true} />
            선수 추가
          </Button>

          <FormationPlayerGroupList
            filteredPlayers={filteredPlayers}
            currentQuarterLineups={currentQuarterLineups}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={onSelectPlayer}
            onRemovePlayer={onRemovePlayer}
          />
        </aside>
      </div>
    </section>
  );
}
