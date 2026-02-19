import React from "react";
import { QuarterData } from "@/types/formation";
import Image from "next/image";
import QuarterSelector from "./QuarterSelector";

interface FormationControlsProps {
  currentQuarterId: number;
  setCurrentQuarterId: (id: number) => void;
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
    </section>
  );
};

export default FormationControls;
