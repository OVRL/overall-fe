import { QuarterData } from "@/types/formation";
import QuarterSelectorTabs from "./QuarterSelectorTabs";
import Icon from "../../ui/Icon";
import clock from "@/public/icons/clock.svg";

interface QuarterSelectorProps {
  quarters: QuarterData[];
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  /** 경기 설정 1쿼터 시간(분) — 라벨 표기용 */
  quarterDurationMinutes?: number;
}

/** 데스크톱용: 쿼터/25분 라벨 + QuarterSelectorTabs + 스쿼드 추천 버튼 */
const QuarterSelector = ({
  quarters,
  currentQuarterId,
  setCurrentQuarterId,
  quarterDurationMinutes = 25,
}: QuarterSelectorProps) => {
  const handleQuarterSelect = (id: number | null) => {
    setCurrentQuarterId(id);
    if (id != null) {
      document
        .getElementById(`quarter-board-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex items-center overflow-x-auto h-fit scrollbar-hide">
      <div className="flex-1 min-w-0 flex items-center gap-4 mr-4">
        <div className="flex items-center gap-2 text-Fill_Primary shrink-0">
          <Icon src={clock} alt="clock" />{" "}
          <span className="text-[#f7f8f8] font-semibold leading-6 whitespace-nowrap">
            쿼터 / {quarterDurationMinutes}분 경기
          </span>
        </div>
        <QuarterSelectorTabs
          quarters={quarters}
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={handleQuarterSelect}
        />
      </div>
    </div>
  );
};

export default QuarterSelector;
