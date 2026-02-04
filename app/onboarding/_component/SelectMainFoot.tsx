import { buttonVariants } from "@/components/ui/Button";

type Props = {
  mainFoot: "L" | "R" | "B";
  setMainFoot: (mainFoot: "L" | "R" | "B") => void;
};

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
            className={buttonVariants({
              variant: mainFoot === "L" ? "primary" : "line",
              size: "m",
            })}
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
            className={buttonVariants({
              variant: mainFoot === "B" ? "primary" : "line",
              size: "m",
            })}
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
            className={buttonVariants({
              variant: mainFoot === "R" ? "primary" : "line",
              size: "m",
            })}
          >
            오른발
          </div>
        </label>
      </div>
    </div>
  );
};

export default SelectMainFoot;
