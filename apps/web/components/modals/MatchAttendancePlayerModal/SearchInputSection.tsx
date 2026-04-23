import TextField from "@/components/ui/TextField";

interface SearchInputSectionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInputSection = ({
  id,
  value,
  onChange,
}: SearchInputSectionProps) => (
  <TextField
    id={id}
    label="선수 이름"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onClear={() => onChange("")}
    placeholder="선수 이름으로 검색하기"
  />
);

export default SearchInputSection;
