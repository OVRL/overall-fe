import React from "react";
import { QuarterData } from "@/types/formation";
import QuarterSelector from "./quarter/QuarterSelector";
import Icon from "../ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";
import SubTeamSelector from "./SubTeamSelector";

interface FormationControlsProps {
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  quarters: QuarterData[];
  matchType?: "MATCH" | "INTERNAL";
  selectedSubTeam?: "A" | "B";
  onSubTeamChange?: (team: "A" | "B") => void;
}

const FormationControls: React.FC<FormationControlsProps> = ({
  currentQuarterId,
  setCurrentQuarterId,
  quarters,
  matchType = "MATCH",
  selectedSubTeam,
  onSubTeamChange,
}) => {
  return (
    <section aria-label="포메이션 컨트롤">
      <div className="flex flex-col gap-4 my-6">
        <div className="flex items-center gap-6">
          <Icon src={matchLineup} alt="로고" nofill width={192} height={34} />
          {matchType === "INTERNAL" && onSubTeamChange && (
            <SubTeamSelector
              selectedSubTeam={selectedSubTeam}
              onSubTeamChange={onSubTeamChange}
            />
          )}
        </div>
        <QuarterSelector
          quarters={quarters}
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
        />
      </div>
    </section>
  );
};

export default FormationControls;
