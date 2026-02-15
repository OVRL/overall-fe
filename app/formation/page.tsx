"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PlayerSearchModal from "@/components/formation/PlayerSearchModal";
import AutoSquadModal from "@/components/formation/AutoSquadModal";
import TeamManagerModal from "@/components/formation/TeamManagerModal";

// Hooks
import { useFormationData } from "@/hooks/formation/useFormationData";
import { usePlayerManager } from "@/hooks/formation/usePlayerManager";
import { useAutoSquad } from "@/hooks/formation/useAutoSquad";

// Components
import FormationControls from "@/components/formation/FormationControls";
import FormationWorkspace from "@/components/formation/FormationWorkspace";
import { QuarterData, Player } from "@/types/formation";

export default function FormationPage() {
  // 1. Data Hooks
  const {
    mode,
    setMode,
    currentQuarterId,
    setCurrentQuarterId,
    quarters,
    setQuarters,
    currentQuarter,
    addQuarter,
    updateQuarterLineup,
    handleSwap,
    handleMatchupChange,
    handleReset,
    handleForceAssign,
    handleLoadMatch,
  } = useFormationData();

  const {
    players,
    playersWithCounts,
    activeTeamsCount,
    setActiveTeamsCount,
    selectedListPlayer,
    setSelectedListPlayer,
    handleAddPlayer,
    handleRemovePlayer,
    handleAddTeam,
    handleRemoveTeam,
  } = usePlayerManager(quarters, mode);

  // 2. Auto Squad Logic
  const {
    isOpen: autoSquadModalOpen,
    setIsOpen: setAutoSquadModalOpen,
    handleAutoSquad,
    availableTeams,
  } = useAutoSquad(
    players,
    mode,
    activeTeamsCount,
    setQuarters,
    setCurrentQuarterId,
  );

  // 3. UI State (Modals)
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTarget, setSearchTarget] = useState<{
    quarterId: number;
    team: "lineup" | string;
    posId: number;
  } | null>(null);
  const [managingTeam, setManagingTeam] = useState<string | null>(null);

  // 4. Helpers
  const availableTeamKeys = availableTeams.map((t) => `team${t}`);

  const isLineupFull = (() => {
    if (mode === "MATCHING") {
      const count = Object.keys(currentQuarter.lineup || {}).length;
      return count >= 11;
    } else {
      let anyFull = false;
      availableTeamKeys.forEach((k) => {
        // @ts-ignore
        if (Object.keys(currentQuarter[k] || {}).length >= 11) anyFull = true;
      });
      return anyFull;
    }
  })();

  const handlePlaceListPlayer = (team: string, posId: number) => {
    if (selectedListPlayer) {
      updateQuarterLineup(currentQuarterId, team, posId, selectedListPlayer);
      setSelectedListPlayer(null); // Clear selection after placing
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary pb-32">
      <Header showTeamSelector selectedTeam="Formation Manager" />

      {/* Main Content Area */}
      <div className="mt-6 px-4">
        <FormationWorkspace
          mode={mode}
          currentQuarterId={currentQuarterId}
          currentQuarter={currentQuarter}
          availableTeams={availableTeams}
          playersWithCounts={playersWithCounts}
          updateQuarterLineup={updateQuarterLineup}
          handleSwap={handleSwap}
          selectedListPlayer={selectedListPlayer}
          setSelectedListPlayer={setSelectedListPlayer}
          handlePlaceListPlayer={handlePlaceListPlayer}
          setSearchTarget={setSearchTarget}
          setSearchModalOpen={setSearchModalOpen}
          handleRemoveTeam={handleRemoveTeam}
          setManagingTeam={setManagingTeam}
          handleAddPlayer={handleAddPlayer}
          onRemovePlayer={(pid) => handleRemovePlayer(pid, setQuarters)}
          isLineupFull={isLineupFull}
          availableTeamKeys={availableTeamKeys}
        >
          {/* Inject Controls into the Workspace Layout */}
          <FormationControls
            mode={mode}
            setMode={setMode}
            activeTeamsCount={activeTeamsCount}
            handleAddTeam={handleAddTeam}
            handleOpenAutoSquad={() => setAutoSquadModalOpen(true)}
            currentQuarter={currentQuarter}
            availableTeams={availableTeams}
            handleMatchupChange={handleMatchupChange}
            currentQuarterId={currentQuarterId}
            setCurrentQuarterId={setCurrentQuarterId}
            handleFormationChange={(fmt) =>
              setQuarters((prev) =>
                prev.map((q) =>
                  q.id === currentQuarterId ? { ...q, formation: fmt } : q,
                ),
              )
            }
            handleReset={handleReset}
            handleLoadMatch={() => handleLoadMatch(setActiveTeamsCount)}
            quarters={quarters}
            addQuarter={addQuarter}
          />
        </FormationWorkspace>
      </div>

      {/* Modals */}
      <AutoSquadModal
        isOpen={autoSquadModalOpen}
        onClose={() => setAutoSquadModalOpen(false)}
        onConfirm={handleAutoSquad}
        players={players}
        mode={mode}
        availableTeams={availableTeams}
      />

      <PlayerSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={(p) => {
          if (searchTarget) {
            updateQuarterLineup(
              searchTarget.quarterId,
              searchTarget.team,
              searchTarget.posId,
              p,
            );
            setSearchModalOpen(false);
          }
        }}
        players={playersWithCounts}
        playingPlayerIds={
          mode === "MATCHING"
            ? Object.values(currentQuarter.lineup || {})
                .filter((p) => p)
                // @ts-ignore
                .map((p) => p!.id)
            : availableTeamKeys.flatMap((k) =>
                // @ts-ignore
                Object.values(currentQuarter[k] || {})
                  .filter((p) => p)
                  // @ts-ignore
                  .map((p) => p!.id),
              )
        }
      />

      {managingTeam && (
        <TeamManagerModal
          isOpen={!!managingTeam}
          onClose={() => setManagingTeam(null)}
          quarterId={currentQuarterId}
          teamKey={managingTeam}
          teamName={managingTeam.replace("team", "")}
          // @ts-ignore
          currentLineup={currentQuarter?.[managingTeam] || {}}
          quarters={quarters}
          allPlayers={playersWithCounts}
          currentQuarterLineups={availableTeamKeys.map(
            (k) =>
              (currentQuarter?.[k as keyof QuarterData] as Record<
                number,
                Player | null
              >) || {},
          )}
          onUpdateLineup={(qid, team, pos, p) => {
            if (p) handleForceAssign(qid, team, pos, p);
            else updateQuarterLineup(qid, team, pos, null);
          }}
        />
      )}
    </div>
  );
}
