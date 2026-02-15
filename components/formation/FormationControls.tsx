import React from "react";
import { QuarterData, TeamType } from "@/types/formation";
import { FormationType } from "@/types/formation";

interface FormationControlsProps {
  mode: "MATCHING" | "IN_HOUSE";
  setMode: (mode: "MATCHING" | "IN_HOUSE") => void;
  activeTeamsCount: number;
  handleAddTeam: () => void;
  handleOpenAutoSquad: () => void;
  currentQuarter: QuarterData;
  availableTeams: string[];
  handleMatchupChange: (side: "home" | "away", team: TeamType) => void;
  currentQuarterId: number;
  setCurrentQuarterId: (id: number) => void;
  handleFormationChange: (formation: FormationType) => void;
  handleReset: () => void;
  handleLoadMatch: () => void;
  quarters: QuarterData[];
  addQuarter: () => void;
}

const FormationControls: React.FC<FormationControlsProps> = ({
  mode,
  setMode,
  activeTeamsCount,
  handleAddTeam,
  handleOpenAutoSquad,
  currentQuarter,
  availableTeams,
  handleMatchupChange,
  currentQuarterId,
  setCurrentQuarterId,
  handleFormationChange,
  handleReset,
  handleLoadMatch,
  quarters,
  addQuarter,
}) => {
  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 items-center">
          <div className="bg-surface-secondary p-1 rounded-lg flex">
            <button
              onClick={() => setMode("MATCHING")}
              className={`px-4 md:px-6 py-2 rounded-md font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
                mode === "MATCHING" ? "bg-primary text-black" : "text-gray-400"
              }`}
            >
              매칭
            </button>
            <button
              onClick={() => setMode("IN_HOUSE")}
              className={`px-4 md:px-6 py-2 rounded-md font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
                mode === "IN_HOUSE" ? "bg-primary text-black" : "text-gray-400"
              }`}
            >
              내전
            </button>
          </div>
          <button
            onClick={handleOpenAutoSquad}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-yellow-300">★</span> 스쿼드 추천
          </button>
          {mode === "IN_HOUSE" && activeTeamsCount < 4 && (
            <button
              onClick={handleAddTeam}
              className="bg-surface-tertiary hover:bg-surface-secondary text-primary border border-primary/30 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1"
            >
              <span>+ 팀</span>
              <span className="bg-primary text-black text-[10px] px-1 rounded">
                {String.fromCharCode(65 + activeTeamsCount)}
              </span>
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {mode === "IN_HOUSE" && (
            <div className="bg-surface-secondary px-3 py-2 rounded-lg border border-gray-700 flex items-center gap-2 text-sm text-gray-300 mr-2">
              <span className="font-bold text-white">매치업:</span>
              <select
                value={currentQuarter?.matchup.home}
                onChange={(e) =>
                  handleMatchupChange("home", e.target.value as TeamType)
                }
                className="bg-surface-tertiary text-white px-2 py-0.5 rounded border border-gray-600 outline-none"
              >
                {availableTeams.map((t) => (
                  <option key={t} value={t}>
                    {t}팀
                  </option>
                ))}
              </select>
              <span>vs</span>
              <select
                value={currentQuarter?.matchup.away}
                onChange={(e) =>
                  handleMatchupChange("away", e.target.value as TeamType)
                }
                className="bg-surface-tertiary text-white px-2 py-0.5 rounded border border-gray-600 outline-none"
              >
                {availableTeams.map((t) => (
                  <option key={t} value={t}>
                    {t}팀
                  </option>
                ))}
              </select>
            </div>
          )}
          <select
            className="bg-surface-secondary text-white px-3 py-2 rounded-lg border border-gray-700"
            value={currentQuarter?.formation}
            onChange={(e) =>
              handleFormationChange(e.target.value as FormationType)
            }
          >
            <option value="4-2-3-1">4-2-3-1</option>
            <option value="4-4-2">4-4-2</option>
            <option value="4-3-3">4-3-3</option>
          </select>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/30 font-bold hover:bg-red-500/20 whitespace-nowrap"
          >
            초기화
          </button>
          {mode === "IN_HOUSE" && (
            <button
              onClick={handleLoadMatch}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 font-bold hover:bg-blue-500/20 whitespace-nowrap"
            >
              불러오기
            </button>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {quarters.map((q) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuarterId(q.id)}
            className={`flex-shrink-0 w-12 h-12 rounded-full border-2 font-bold transition-all ${
              currentQuarterId === q.id
                ? "bg-primary border-primary text-black scale-110"
                : "bg-surface-secondary border-gray-700 text-gray-400"
            }`}
          >
            {q.id}Q
          </button>
        ))}
        {quarters.length < 10 && (
          <button
            onClick={addQuarter}
            className="w-10 h-10 rounded-full bg-surface-tertiary border border-dashed border-gray-600 text-gray-400 hover:text-white"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default FormationControls;
