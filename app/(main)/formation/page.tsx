"use client";

import React from "react";

// import PlayerSearchModal from "@/components/formation/PlayerSearchModal";
// import AutoSquadModal from "@/components/formation/AutoSquadModal";
// import TeamManagerModal from "@/components/formation/TeamManagerModal";

// Hooks
import { useFormationData } from "@/hooks/formation/useFormationData";
import { usePlayerManager } from "@/hooks/formation/usePlayerManager";
import { useAutoSquad } from "@/hooks/formation/useAutoSquad";

// Components
import FormationControls from "@/components/formation/FormationControls";
import FormationWorkspace from "@/components/formation/FormationWorkspace";
// import { QuarterData, Player } from "@/types/formation";
import MatchScheduleCard from "@/components/formation/MatchScheduleCard";
import { Player } from "@/types/formation";

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
    handleMatchupChange,
    handleReset,
    handleLoadMatch,
  } = useFormationData();

  const {
    playersWithCounts,
    activeTeamsCount,
    setActiveTeamsCount,
    selectedListPlayer,
    setSelectedListPlayer,
    handleAddPlayer,
    handleRemovePlayer,
    handleAddTeam,
  } = usePlayerManager(quarters, mode);

  // 2. 자동 선발 로직 (Auto Squad Logic)
  const { setIsOpen: setAutoSquadModalOpen, availableTeams } = useAutoSquad(
    [], // players (위에서 구조 분해 할당되지 않았다면 제거)
    mode,
    activeTeamsCount,
    setQuarters,
    setCurrentQuarterId,
  );

  // 3. 포메이션 인터랙션 로직 (Formation Interaction Logic)
  const [activePosition, setActivePosition] = React.useState<{
    quarterId: number;
    index: number;
    role: string; // Position 타입이어야 하지만 당장은 엄격한 타입 체크 회피
  } | null>(null);

  const handleAssignPlayer = (player: Player) => {
    if (!activePosition) return;

    const { quarterId, index, role } = activePosition;

    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id !== quarterId) return q;

        // 매칭 모드인 경우 (Matching Mode)
        if (mode === "MATCHING") {
          const newLineup = { ...q.lineup };
          newLineup[index] = { ...player, position: role }; // 해당 인덱스에 선수 할당
          return { ...q, lineup: newLineup };
        }

        return q;
      }),
    );

    // 할당 후 활성 포지션 초기화? 아니면 유지?
    // 일단 초기화합니다.
    setActivePosition(null);
  };

  const isLineupFull = (() => {
    if (mode === "MATCHING") {
      const count = Object.keys(currentQuarter.lineup || {}).length;
      return count >= 11;
    } else {
      return false;
    }
  })();

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Main Content Area */}
      <section className="flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl justify-center items-center lg:items-start 2xl:max-w-none">
        <FormationWorkspace
          quarters={quarters}
          playersWithCounts={playersWithCounts}
          selectedListPlayer={selectedListPlayer}
          setSelectedListPlayer={setSelectedListPlayer}
          handleAddPlayer={handleAddPlayer}
          onRemovePlayer={(pid) => handleRemovePlayer(pid, setQuarters)}
          isLineupFull={isLineupFull}
          activePosition={activePosition}
          setActivePosition={setActivePosition}
          onAssignPlayer={handleAssignPlayer}
          onQuarterFormationChange={(qid, fmt) => {
            setQuarters((prev) =>
              prev.map((q) => (q.id === qid ? { ...q, formation: fmt } : q)),
            );
          }}
        >
          <section aria-label="매치 정보">
            <MatchScheduleCard
              // 목 데이터 - 실제 앱에서는 props로 전달
              matchDate="2026-02-03(목)"
              matchTime="18:00~20:00"
              stadium="수원 월드컵 보조 구장 A"
              opponent="FC 빠름셀로나"
              opponentRecord="전적 2승 1무 1패"
              homeUniform="빨강"
            />
          </section>

          <section aria-label="포메이션 컨트롤">
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
          </section>
        </FormationWorkspace>
      </section>
    </main>
  );
}
