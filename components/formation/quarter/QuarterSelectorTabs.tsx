import { QuarterData } from "@/types/formation";
import QuarterButton from "@/components/ui/QuarterButton";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

export interface QuarterSelectorTabsProps {
  quarters: QuarterData[];
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  addQuarter: () => void;
}

/**
 * 쿼터 버튼 나열 + 추가 버튼만 담당.
 * 데스크톱(QuarterSelector)과 모바일(FormationBuilderMobile)에서 공통 사용.
 */
const QuarterSelectorTabs = ({
  quarters,
  currentQuarterId,
  setCurrentQuarterId,
  addQuarter,
}: QuarterSelectorTabsProps) => {
  const scrollRef = useHorizontalScroll();

  return (
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
  );
};

export default QuarterSelectorTabs;
