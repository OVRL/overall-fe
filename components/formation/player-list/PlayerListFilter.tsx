import AssistiveChip from "@/components/ui/AssistiveChip";
import calendar from "@/public/icons/calendar.svg";
import Icon from "../../ui/Icon";

interface PlayerListFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activePosTab: string;
  onPosTabChange: (tab: string) => void;
  className?: string;
}

const PlayerListFilter = ({
  activePosTab,
  onPosTabChange,
}: PlayerListFilterProps) => {
  const tabs = ["전체", "FW", "MF", "DF", "GK"];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-Fill_Tertiary flex gap-2.5">
        <Icon src={calendar} alt="calendar icon" aria-hidden={true} />
        <h3 className="text-[#f7f7f8] font-semibold leading-6">선수 명단</h3>
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
