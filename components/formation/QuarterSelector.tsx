import { QuarterData } from "@/types/formation";
import QuarterButton from "@/components/ui/QuarterButton";
import Icon from "../ui/Icon";
import clock from "@/public/icons/clock.svg";
import soccerField from "@/public/icons/soccer_field.svg";
import Button from "../ui/Button";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

interface QuarterSelectorProps {
  quarters: QuarterData[];
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  addQuarter: () => void;
}

const QuarterSelector = ({
  quarters,
  currentQuarterId,
  setCurrentQuarterId,
  addQuarter,
}: QuarterSelectorProps) => {
  const scrollRef = useHorizontalScroll();

  return (
    <div className="flex items-center overflow-x-auto h-fit scrollbar-hide">
      <div className="flex-1 min-w-0 flex items-center gap-4 mr-4">
        <div className="flex items-center gap-2 text-Fill_Primary shrink-0">
          <Icon src={clock} alt="clock" />{" "}
          <span className="text-[#f7f8f8] font-semibold leading-6 whitespace-nowrap">
            쿼터 / 25분 경기
          </span>
        </div>
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1"
        >
          {quarters.map((q) => (
            <div key={q.id} className="shrink-0">
              <QuarterButton
                onClick={() => {
                  if (currentQuarterId === q.id) {
                    setCurrentQuarterId(null);
                  } else {
                    setCurrentQuarterId(q.id);
                    // 자연스러운 스크롤 이동
                    document
                      .getElementById(`quarter-board-${q.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                variant={currentQuarterId === q.id ? "selected" : "default"}
              >
                {q.id}Q
              </QuarterButton>
            </div>
          ))}
          {quarters.length < 10 && (
            <div className="shrink-0">
              <QuarterButton onClick={addQuarter} variant="add" size="sm">
                +
              </QuarterButton>
            </div>
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
