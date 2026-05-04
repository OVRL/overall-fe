import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  mainFoot: "L" | "R" | "B";
  setMainFoot: (mainFoot: "L" | "R" | "B") => void;
};

const selectedClass =
  "bg-[var(--color-PrimaryAlpha20)] text-Label-AccentPrimary border-transparent";

const SelectMainFoot = ({ mainFoot, setMainFoot }: Props) => {
  const toggleFoot = (foot: "L" | "R" | "B") => {
    setMainFoot(foot);
  };
  return (
    <div className="flex flex-col gap-y-4 px-3">
      <span className="text-Label-Primary font-semibold text-sm leading-4">
        주로 사용하는 발
      </span>
      <div className="flex gap-x-2">
        <label className="flex-1 cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={mainFoot === "L"}
            onChange={() => toggleFoot("L")}
          />
          <div
            className={cn(
              buttonVariants({ variant: "line", size: "m" }),
              mainFoot === "L" && selectedClass,
            )}
          >
            왼발
          </div>
        </label>
        <label className="flex-1 cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={mainFoot === "B"}
            onChange={() => toggleFoot("B")}
          />
          <div
            className={cn(
              buttonVariants({ variant: "line", size: "m" }),
              mainFoot === "B" && selectedClass,
            )}
          >
            양발
          </div>
        </label>
        <label className="flex-1 cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={mainFoot === "R"}
            onChange={() => toggleFoot("R")}
          />
          <div
            className={cn(
              buttonVariants({ variant: "line", size: "m" }),
              mainFoot === "R" && selectedClass,
            )}
          >
            오른발
          </div>
        </label>
      </div>
    </div>
  );
};

export default SelectMainFoot;
