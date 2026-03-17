import Image from "next/image";
import { cn } from "@/lib/utils";
import plus from "@/public/icons/plus.svg";
import check from "@/public/icons/check.svg";
import Icon from "@/components/ui/Icon";
import type { TeamSearchResult } from "@/hooks/useTeamSearch";

interface TeamItemProps {
  team: TeamSearchResult;
  isSelected: boolean;
  onSelect: (team: TeamSearchResult) => void;
}

const DEFAULT_EMBLEM = "/icons/teamemblum_default.svg";

/**
 * 팀 검색 결과/외부팀 한 건 표시 (엠블럼 + 이름, 선택 아이콘)
 */
const TeamItem = ({ team, isSelected, onSelect }: TeamItemProps) => (
  <li
    onClick={() => onSelect(team)}
    className={cn(
      "flex items-center justify-between pt-3.75 pl-3 pb-3.25 transition-colors cursor-pointer hover:bg-surface-secondary rounded-xl",
      isSelected && "text-Label-AccentPrimary",
    )}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative w-7.5 h-7.5 shrink-0 rounded-full overflow-hidden bg-border-card">
        <Image
          src={team.emblem ?? DEFAULT_EMBLEM}
          alt=""
          fill
          sizes="30px"
          className="object-cover"
          unoptimized={!(team.emblem ?? DEFAULT_EMBLEM).startsWith("/")}
        />
      </div>
      <span className="text-Label-Primary truncate">{team.name}</span>
    </div>
    <Icon
      src={isSelected ? check : plus}
      alt={isSelected ? "선택됨" : "선택"}
      className={cn(
        isSelected ? "text-Label-AccentPrimary" : "text-Fill_Tertiary",
      )}
    />
  </li>
);

export default TeamItem;
