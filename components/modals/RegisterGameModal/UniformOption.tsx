import { cn } from "@/lib/utils";

export type UniformType = "HOME" | "AWAY";

interface UniformOptionProps {
  type: UniformType;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

function UniformOption({
  type,
  label,
  isSelected,
  onSelect,
}: UniformOptionProps) {
  const isHome = type === "HOME";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 py-2.5 px-4 rounded-xl border-2 transition-colors",
        isSelected
          ? "border-Fill_AccentPrimary bg-Fill_AccentPrimary/10"
          : "border-transparent bg-Fill_Quatiary hover:bg-Fill_Quatiary/80",
      )}
    >
      <span
        className={cn(
          "w-8 h-8 rounded-full shrink-0",
          isHome ? "bg-red-600" : "bg-blue-600",
        )}
        aria-hidden
      />
      <span className="text-sm font-medium text-Label-Primary">{label}</span>
    </button>
  );
}

export default UniformOption;
