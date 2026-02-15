import React from "react";
import FieldBoard from "@/components/formation/board/FieldBoard"; // New Board
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import FormationLayout from "@/components/formation/layout/FormationLayout"; // New Layout
import MatchScheduleCard from "@/components/formation/MatchScheduleCard"; // New Match Info
import { Player, QuarterData } from "@/types/formation";

interface FormationWorkspaceProps {
  mode: "MATCHING" | "IN_HOUSE";
  currentQuarterId: number;
  currentQuarter: QuarterData;
  availableTeams: string[];
  playersWithCounts: Player[];
  updateQuarterLineup: (
    quarterId: number,
    team: string,
    positionId: number,
    player: Player | null,
  ) => void;
  handleSwap: (
    quarterId: number,
    team: string,
    pos1: number,
    pos2: number,
  ) => void;
  selectedListPlayer: Player | null;
  setSelectedListPlayer: (player: Player | null) => void;
  handlePlaceListPlayer: (team: string, posId: number) => void;
  setSearchTarget: (
    target: { quarterId: number; team: string; posId: number } | null,
  ) => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  handleRemoveTeam: () => void;
  setManagingTeam: (team: string) => void;
  handleAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: number) => void;

  isLineupFull: boolean;
  availableTeamKeys: string[];
  // Include FormationControls in the layout? Or pass as children?
  // User might want Controls OUTSIDE the layout grid or inside.
  // In `app/home/page.tsx`, Header is outside.
  // FormationControls was previously above FormationWorkspace.
  children?: React.ReactNode; // For FormationControls if we want to inject it inside
}

const FormationWorkspace: React.FC<FormationWorkspaceProps> = ({
  mode,
  currentQuarterId,
  currentQuarter,
  availableTeams,
  playersWithCounts,
  updateQuarterLineup,
  handleSwap,
  selectedListPlayer,
  setSelectedListPlayer,
  handlePlaceListPlayer,
  setSearchTarget,
  setSearchModalOpen,
  handleRemoveTeam,
  setManagingTeam,
  handleAddPlayer,
  onRemovePlayer,
  isLineupFull,
  availableTeamKeys,
  children,
}) => {
  return (
    <FormationLayout
      sidebar={
        <div className="h-full flex flex-col">
          {/* Mobile: FormationControls might need to be here or above? 
               Usually controls are global. 
           */}
          <FormationPlayerList
            players={playersWithCounts}
            currentQuarterLineups={
              mode === "MATCHING"
                ? [currentQuarter?.lineup || {}]
                : availableTeamKeys.map(
                    (k) =>
                      (currentQuarter?.[k as keyof QuarterData] as Record<
                        number,
                        Player | null
                      >) || {},
                  )
            }
            selectedPlayer={selectedListPlayer}
            onSelectPlayer={setSelectedListPlayer}
            isLineupFull={isLineupFull}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={onRemovePlayer}
          />
        </div>
      }
    >
      {/* Left Column Content */}

      {/* 1. Controls (Optional placement here, or passed as children) */}
      {children}

      {/* 2. Match Info Card */}
      <MatchScheduleCard
        // Mock Data - In real app, pass via props
        matchDate="2026-02-03(목)"
        matchTime="18:00~20:00"
        stadium="수원 월드컵 보조 구장 A"
        opponent="FC 빠름셀로나"
        opponentRecord="전적 2승 1무 1패"
        homeUniform="빨강"
      />

      {/* 3. Field Board(s) */}
      <div className="flex-1">
        {mode === "MATCHING" ? (
          <FieldBoard
            quarterId={currentQuarterId}
            // label="매칭 라인업" // Removed label to look cleaner with MatchCard, or keep it?
            // MatchScheduleCard acts as the header info.
            lineup={currentQuarter?.lineup || {}}
            formation={currentQuarter?.formation}
            onUpdate={(pos, p) =>
              updateQuarterLineup(currentQuarterId, "lineup", pos, p)
            }
            onSwap={(p1, p2) => handleSwap(currentQuarterId, "lineup", p1, p2)}
            selectedListPlayer={selectedListPlayer}
            onPlaceListPlayer={(pos) => handlePlaceListPlayer("lineup", pos)}
            onPositionClick={(pos) => {
              setSearchTarget({
                quarterId: currentQuarterId,
                team: "lineup",
                posId: pos,
              });
              setSearchModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTeams.map((teamStr, index) => {
              const teamKey = `team${teamStr}`;
              // @ts-ignore
              const teamLineup = currentQuarter?.[teamKey] || {};
              const colors: Record<
                string,
                "blue" | "red" | "green" | "purple"
              > = {
                A: "blue",
                B: "red",
                C: "green",
                D: "purple",
              };
              const isRemovable =
                index === availableTeams.length - 1 && index >= 2;

              return (
                <FieldBoard
                  key={teamStr}
                  quarterId={currentQuarterId}
                  label={`${teamStr}팀 라인업`}
                  teamColor={colors[teamStr] || "blue"}
                  lineup={teamLineup}
                  formation={currentQuarter?.formation}
                  onUpdate={(pos, p) =>
                    updateQuarterLineup(currentQuarterId, teamKey, pos, p)
                  }
                  onSwap={(p1, p2) =>
                    handleSwap(currentQuarterId, teamKey, p1, p2)
                  }
                  selectedListPlayer={selectedListPlayer}
                  onPlaceListPlayer={(pos) =>
                    handlePlaceListPlayer(teamKey, pos)
                  }
                  onPositionClick={(pos) => {
                    setSearchTarget({
                      quarterId: currentQuarterId,
                      team: teamKey,
                      posId: pos,
                    });
                    setSearchModalOpen(true);
                  }}
                  onRemoveTeam={isRemovable ? handleRemoveTeam : undefined}
                  onExpand={() => setManagingTeam(teamKey)}
                />
              );
            })}
          </div>
        )}
      </div>
    </FormationLayout>
  );
};

export default FormationWorkspace;
