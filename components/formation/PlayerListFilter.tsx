import AssistiveChip from "@/components/ui/AssistiveChip";
import Button from "../ui/Button";
import calendar from "@/public/icons/calendar.svg";
import Icon from "../ui/Icon";

interface PlayerListFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activePosTab: string;
  onPosTabChange: (tab: string) => void;
  className?: string;
}

const PlayerListFilter = ({
  searchTerm,
  onSearchChange,
  activePosTab,
  onPosTabChange,
  className,
}: PlayerListFilterProps) => {
  const tabs = ["전체", "FW", "MF", "DF", "GK"];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-Fill_Tertiary flex gap-2.5">
        <Icon src={calendar} alt="calendar icon" aria-hidden={true} />
        <h3 className="text-[#f7f7f8] font-semibold leading-6">선수 명단</h3>
      </div>
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex w-full gap-2">
          <button className="h-12 flex-1 flex rounded-[0.625rem] bg-Fill_Quatiary justify-center items-center text-sm text-Label-Secondary">
            선수 검색
          </button>
          <Button variant="ghost" className="w-12 h-12" size="xs">
            검색
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2 w-full">
        {tabs.map((tab) => (
          <AssistiveChip
            key={tab}
            label={tab}
            variant={activePosTab === tab ? "select2" : "default"}
            onClick={() => onPosTabChange(tab)}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerListFilter;
