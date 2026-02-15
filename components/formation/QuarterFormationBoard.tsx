import QuarterButton from "../ui/QuarterButton";
import Dropdown from "../ui/Dropdown";
import ObjectField from "./ObjectField";
import { QuarterData } from "@/types/formation";

interface QuarterFormationBoardProps {
  quarter: QuarterData;
}

const QuarterFormationBoard: React.FC<QuarterFormationBoardProps> = ({
  quarter,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border border-border-card shadow-card bg-surface-card">
      <div className="flex justify-between">
        <QuarterButton variant="default">{quarter.id}Q</QuarterButton>
        <Dropdown />
      </div>
      <ObjectField type="full" />
    </div>
  );
};

export default QuarterFormationBoard;
