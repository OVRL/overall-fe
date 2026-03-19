import { cn } from "@/lib/utils";
import check from "@/public/icons/check.svg";
import Icon from "@/components/ui/Icon";
const AddressItem = ({
  address,
  title,
  onClick,
  selected,
}: {
  address: string;
  /** 장소명(있으면 "장소명 (주소)" 형태로 표시) */
  title?: string;
  onClick: () => void;
  selected?: boolean;
}) => (
  <li
    className={cn(
      "w-full py-3.5 cursor-pointer hover:text-Label-Primary transition-colors flex justify-between items-center",
      selected ? "text-Label-AccentPrimary" : "text-Label-Tertiary",
    )}
    onClick={onClick}
  >
    {title ? `${title} (${address})` : address}
    {selected && <Icon src={check} alt="check" width={24} height={24} />}
  </li>
);

export default AddressItem;
