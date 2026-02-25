import React from "react";
import { QuarterData } from "@/types/formation";
import QuarterSelector from "./quarter/QuarterSelector";
import Icon from "../ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";

interface FormationControlsProps {
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  quarters: QuarterData[];
  addQuarter: () => void;
}

const FormationControls: React.FC<FormationControlsProps> = ({
  currentQuarterId,
  setCurrentQuarterId,
  quarters,
  addQuarter,
}) => {
  return (
    <section aria-label="포메이션 컨트롤">
      <div className="flex flex-col gap-4 my-6">
        <Icon src={matchLineup} alt="로고" nofill width={192} height={34} />
        <QuarterSelector
          quarters={quarters}
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
          addQuarter={addQuarter}
        />
      </div>
    </section>
  );
};

export default FormationControls;
