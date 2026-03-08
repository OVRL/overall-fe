import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";
import plus from "@/public/icons/plus.svg";
import check from "@/public/icons/check.svg";
import Icon from "@/components/ui/Icon";
interface PlayerItemProps {
  player: Player;
  isSelected: boolean;
  onSelect: (player: Player) => void;
}

/**
 * 개별 플레이어 아이템 컴포넌트
 */
const PlayerItem = ({ player, isSelected, onSelect }: PlayerItemProps) => (
  <li
    onClick={() => onSelect(player)}
    className={cn(
      "flex items-center justify-between pt-3.75 pl-3 pb-3.25 transition-colors cursor-pointer hover:bg-surface-secondary rounded-xl",
      isSelected && "text-Label-AccentPrimary",
    )}
  >
    <span className="text-Label-Tertiary truncate w-36.75">{player.name}</span>
    <Icon
      src={isSelected ? check : plus}
      alt={isSelected ? "선택됨" : "선택"}
      className={cn(
        isSelected ? "text-Label-AccentPrimary" : "text-Fill_Tertiary",
      )}
    />
  </li>
);

export default PlayerItem;
