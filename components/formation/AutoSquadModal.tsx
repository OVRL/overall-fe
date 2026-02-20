"use client";

import React, { useState } from "react";
import { Player } from "@/app/formation/page";
import { FormationType } from "@/components/formation/FormationBoard";

interface AutoSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    quarters: number,
    formation: FormationType,
    teamPools?: Record<string, Player[]>,
  ) => void;
  players: Player[]; // Full list
  mode: "MATCHING" | "IN_HOUSE";
  availableTeams: string[];
}

export default function AutoSquadModal({
  isOpen,
  onClose,
  onConfirm,
  players,
  mode,
  availableTeams,
}: AutoSquadModalProps) {
  const [quarterCount, setQuarterCount] = useState(4);
  const [formation, setFormation] = useState<FormationType>("4-2-3-1");

  // In-House Draft State
  const [step, setStep] = useState<"SETTINGS" | "DRAFT">("SETTINGS");
  const [teamPools, setTeamPools] = useState<Record<string, Player[]>>({});
  const [unassigned, setUnassigned] = useState<Player[]>([]);

  // Initialize pools on open
  React.useEffect(() => {
    if (isOpen) {
      setStep("SETTINGS");
      setUnassigned([...players]);
      const initialPools: Record<string, Player[]> = {};
      availableTeams.forEach((t) => (initialPools[t] = []));
      setTeamPools(initialPools);
    }
  }, [isOpen, players, availableTeams]);

  const handleAssign = (player: Player, targetTeam: string) => {
    // Remove from current location
    const newUnassigned = unassigned.filter((p) => p.id !== player.id);
    const newPools = { ...teamPools };
    Object.keys(newPools).forEach((t) => {
      newPools[t] = newPools[t].filter((p) => p.id !== player.id);
    });

    // Add to target
    if (targetTeam === "UNASSIGNED") {
      setUnassigned([...newUnassigned, player]);
      setTeamPools(newPools);
    } else {
      setUnassigned(newUnassigned);
      newPools[targetTeam] = [...newPools[targetTeam], player];
      setTeamPools(newPools);
    }
  };

  const handleAutoDistribute = () => {
    // Simple round-robin distribution for convenience
    const newPools: Record<string, Player[]> = {};
    availableTeams.forEach((t) => (newPools[t] = []));

    // Sort by OVR desc for fair balance
    const sorted = [...players].sort((a, b) => b.overall - a.overall);

    sorted.forEach((p, i) => {
      const teamIndex = i % availableTeams.length;
      const team = availableTeams[teamIndex];
      newPools[team].push(p);
    });

    setUnassigned([]);
    setTeamPools(newPools);
  };

  const handleConfirm = () => {
    if (mode === "IN_HOUSE" && step === "SETTINGS") {
      setStep("DRAFT");
      return;
    }
    onConfirm(
      quarterCount,
      formation,
      mode === "IN_HOUSE" ? teamPools : undefined,
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-surface-secondary rounded-xl w-[95%] border border-gray-700 shadow-2xl overflow-hidden flex flex-col transition-all ${step === "DRAFT" ? "max-w-[50rem] h-[80vh]" : "max-w-[25rem]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <h3 className="text-white font-bold text-xl">
            스쿼드 자동 추천 (AI)
          </h3>
          <p className="text-gray-400 text-sm">
            {step === "SETTINGS"
              ? "쿼터 수와 포메이션을 설정하세요."
              : "내전 팀원을 배정하세요. (자동 배정 가능)"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          {step === "SETTINGS" && (
            <>
              {/* Formation */}
              <div className="mb-6">
                <label className="text-white text-sm font-bold block mb-2">
                  포메이션
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["4-4-2", "4-3-3", "4-2-3-1", "3-5-2"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormation(fmt as FormationType)}
                      className={`py-2 rounded text-sm font-bold border transition-colors ${
                        formation === fmt
                          ? "bg-primary text-black border-primary"
                          : "bg-surface-card text-gray-400 border-transparent hover:border-gray-600"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quarters */}
              <div className="mb-2">
                <label className="text-white text-sm font-bold block mb-2">
                  생성할 쿼터 수
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setQuarterCount(Math.max(1, quarterCount - 1))
                    }
                    className="w-10 h-10 rounded bg-surface-card text-white hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-primary w-12 text-center">
                    {quarterCount}
                  </span>
                  <button
                    onClick={() =>
                      setQuarterCount(Math.min(10, quarterCount + 1))
                    }
                    className="w-10 h-10 rounded bg-surface-card text-white hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "DRAFT" && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-end">
                <button
                  onClick={handleAutoDistribute}
                  className="text-xs bg-surface-card text-primary px-3 py-1 rounded border border-primary/30 hover:bg-primary/10"
                >
                  ⚡ 밸런스 자동 분배
                </button>
              </div>

              <div className="flex gap-4 h-full overflow-hidden">
                {/* Pool */}
                {unassigned.length > 0 && (
                  <div className="w-1/3 bg-surface-card rounded-lg p-2 overflow-y-auto border border-dashed border-gray-600">
                    <div className="text-xs text-gray-400 mb-2 font-bold text-center">
                      미배정 ({unassigned.length})
                    </div>
                    <div className="space-y-1">
                      {unassigned.map((p) => (
                        <div
                          key={p.id}
                          className="bg-surface-secondary p-1.5 rounded flex justify-between items-center text-xs border border-gray-700"
                        >
                          <span className="text-white truncate max-w-[3.75rem]">
                            {p.name}
                          </span>
                          <div className="flex gap-1">
                            {availableTeams.map((t) => (
                              <button
                                key={t}
                                onClick={() => handleAssign(p, t)}
                                className="px-1.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-white"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {availableTeams.map((team) => (
                    <div
                      key={team}
                      className="bg-surface-secondary border border-gray-700 rounded-lg flex flex-col overflow-hidden"
                    >
                      <div
                        className={`p-2 font-bold text-center text-white text-sm bg-${team === "A" ? "blue" : team === "B" ? "red" : "green"}-900/50`}
                      >
                        {team}팀 ({teamPools[team]?.length || 0})
                      </div>
                      <div className="flex-1 p-2 overflow-y-auto space-y-1">
                        {teamPools[team]?.map((p) => (
                          <div
                            key={p.id}
                            className="flex justify-between items-center text-xs p-1 hover:bg-white/5 rounded group cursor-pointer"
                            onClick={() => handleAssign(p, "UNASSIGNED")}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 w-4">
                                {p.position}
                              </span>
                              <span className="text-gray-200">{p.name}</span>
                            </div>
                            <span className="text-gray-600 group-hover:text-red-400">
                              ✕
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={() => (step === "DRAFT" ? setStep("SETTINGS") : onClose())}
            className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg font-bold hover:bg-gray-600 transition-colors"
          >
            {step === "DRAFT" ? "뒤로" : "취소"}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-colors shadow-lg"
          >
            {step === "SETTINGS" && mode === "IN_HOUSE"
              ? "팀 배정하기"
              : "스쿼드 생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
