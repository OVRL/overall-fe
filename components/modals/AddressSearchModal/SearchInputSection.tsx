import { cn } from "@/lib/utils";
import search from "@/public/icons/search.svg";
import Icon from "@/components/ui/Icon";

const SearchInputSection = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-3.75 px-3">
    <span className="font-semibold text-sm leading-4 text-Label-Primary">
      주소 검색
    </span>
    <div className="flex items-center border-b border-white/20 pb-3.75 gap-2 text-Fill_Primary">
      <Icon src={search} width={24} height={24} className="shrink-0" />
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="지역이나 동네로 검색하기"
        className={cn(
          "flex-1 bg-transparent text-base text-Label-Tertiary placeholder:text-Label-Tertiary outline-none",
        )}
      />
    </div>
  </div>
);

export default SearchInputSection;
