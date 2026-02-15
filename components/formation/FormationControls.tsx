import React from "react";
import { QuarterData, TeamType } from "@/types/formation";
import { FormationType } from "@/types/formation";
import Image from "next/image";
import QuarterSelector from "./QuarterSelector";

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
      {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
            className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 whitespace-nowrap"
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
        </div>
      </div> */}
      <Image
        src="/images/title_matchlineup.webp"
        alt="matchlineup"
        width={192}
        height={34}
      />
      <QuarterSelector
        quarters={quarters}
        currentQuarterId={currentQuarterId}
        setCurrentQuarterId={setCurrentQuarterId}
        addQuarter={addQuarter}
      />
    </div>
  );
};

export default FormationControls;
