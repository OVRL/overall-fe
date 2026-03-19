import Button from "@/components/ui/Button";

interface SegmentToggleProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function SegmentToggle<T extends string>({
  options,
  value,
  onChange,
}: SegmentToggleProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant={value === opt.value ? "primary" : "line"}
          size="m"
          className="flex-1"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

export default SegmentToggle;
