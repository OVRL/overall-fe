import { cn } from "@/lib/utils";
import check from "@/public/icons/check.svg";
import Icon from "@/components/Icon";
const AddressItem = ({
  address,
  onClick,
  selected,
}: {
  address: string;
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
    {address}
    {selected && <Icon src={check} alt="check" width={24} height={24} />}
  </li>
);

export default AddressItem;
