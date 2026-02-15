import React from "react";
import { QuarterData } from "@/types/formation";
import QuarterButton from "@/components/ui/QuarterButton";
import Icon from "../ui/Icon";
import clock from "@/public/icons/clock.svg";
import soccerField from "@/public/icons/soccer_field.svg";
import Button from "../ui/Button";

interface QuarterSelectorProps {
  quarters: QuarterData[];
  currentQuarterId: number;
  setCurrentQuarterId: (id: number) => void;
  addQuarter: () => void;
}

const QuarterSelector: React.FC<QuarterSelectorProps> = ({
  quarters,
  currentQuarterId,
  setCurrentQuarterId,
  addQuarter,
}) => {
  return (
    <div
      className="flex items-center overflow-x-auto scrollbar-none h-fit"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2 text-Fill_Primary">
          <Icon src={clock} alt="clock" />{" "}
          <span className="text-[#f7f8f8] font-semibold leading-6">
            쿼터 / 25분 경기
          </span>
        </div>
        <div className="flex items-center gap-2">
          {quarters.map((q) => (
            <QuarterButton
              key={q.id}
              onClick={() => setCurrentQuarterId(q.id)}
              variant={currentQuarterId === q.id ? "selected" : "default"}
            >
              {q.id}Q
            </QuarterButton>
          ))}
          {quarters.length < 10 && (
            <QuarterButton onClick={addQuarter} variant="add" size="sm">
              +
            </QuarterButton>
          )}
        </div>
      </div>

      <Button className="flex h-12 items-center max-w-40 rounded-[0.625rem] bg-[linear-gradient(282deg,#12FFDB_0%,#9000FF_98.2%)]">
        <Icon
          src={soccerField}
          alt="soccerField"
          width={30}
          height={30}
          nofill
        />
        <span className="text-white font-bold text-lg">스쿼드 추천</span>
      </Button>
    </div>
  );
};

export default QuarterSelector;
