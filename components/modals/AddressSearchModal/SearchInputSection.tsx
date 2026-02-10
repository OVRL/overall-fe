import { cn } from "@/lib/utils";
import search from "@/public/icons/search.svg";
import Icon from "@/components/Icon";

const SearchInputSection = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-3.75">
    <span className="font-semibold text-sm leading-4 text-Label-Primary">
      주소 검색
    </span>
    <div className="relative text-Fill_Primary">
      <div className="absolute bottom-3.25 left-0 p-0.75">
        <Icon src={search} width={24} height={24} />
      </div>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="지역이나 동네로 검색하기"
        className={cn(
          "w-full bg-transparent pb-3.75 text-base text-Label-Tertiary placeholder:text-Label-Tertiary outline-none border-b border-Fill_Tertiary transition-colors pl-7.25",
        )}
      />
    </div>
  </div>
);

export default SearchInputSection;
