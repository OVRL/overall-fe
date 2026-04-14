import React from "react";
import { QuarterData } from "@/types/formation";
import QuarterSelector from "./quarter/QuarterSelector";
import Icon from "../ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";

interface FormationControlsProps {
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  quarters: QuarterData[];
  /** 경기 API quarterDuration(분). 라벨 `쿼터 / N분 경기`에 사용 */
  quarterDurationMinutes?: number;
}

const FormationControls: React.FC<FormationControlsProps> = ({
  currentQuarterId,
  setCurrentQuarterId,
  quarters,
  quarterDurationMinutes = 25,
}) => {
  return (
    <section aria-label="포메이션 컨트롤">
      <div className="flex flex-col gap-4 my-6">
        <div className="flex items-center gap-6">
          <Icon src={matchLineup} alt="로고" nofill width={192} height={34} />
        </div>
        <QuarterSelector
          quarters={quarters}
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
          quarterDurationMinutes={quarterDurationMinutes}
        />
      </div>
    </section>
  );
};

export default FormationControls;
