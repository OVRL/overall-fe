import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  gender: "M" | "W";
  setGender: (gender: "M" | "W") => void;
  disabled?: boolean;
};

const selectedClass =
  "bg-[var(--color-PrimaryAlpha20)] text-Label-AccentPrimary border-transparent";

const SelectGender = ({ gender, setGender, disabled = false }: Props) => {
  const toggleGender = (gender: "M" | "W") => {
    if (disabled) return;
    setGender(gender);
  };
  return (
    <div
      className="flex flex-col gap-y-4 px-3"
      aria-disabled={disabled}
    >
      <span className="text-Label-Primary font-semibold text-sm leading-4">
        성별
      </span>
      <div className="flex gap-x-2">
        <label className={disabled ? "flex-1 cursor-not-allowed" : "flex-1 cursor-pointer"}>
          <input
            type="checkbox"
            className="hidden"
            checked={gender === "M"}
            disabled={disabled}
            onChange={() => toggleGender("M")}
          />
          <div
            className={cn(
              buttonVariants({ variant: "line", size: "m" }),
              gender === "M" && selectedClass,
            )}
          >
            남
          </div>
        </label>
        <label className={disabled ? "flex-1 cursor-not-allowed" : "flex-1 cursor-pointer"}>
          <input
            type="checkbox"
            className="hidden"
            checked={gender === "W"}
            disabled={disabled}
            onChange={() => toggleGender("W")}
          />
          <div
            className={cn(
              buttonVariants({ variant: "line", size: "m" }),
              gender === "W" && selectedClass,
            )}
          >
            여
          </div>
        </label>
      </div>
    </div>
  );
};

export default SelectGender;
