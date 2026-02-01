import { buttonVariants } from "@/components/ui/Button";

type Props = {
  mainFoot: "left" | "right";
  setMainFoot: (mainFoot: "left" | "right") => void;
};

const SelectMainFoot = ({ mainFoot, setMainFoot }: Props) => {
  const toggleFoot = (foot: "left" | "right") => {
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
            checked={mainFoot === "left"}
            onChange={() => toggleFoot("left")}
          />
          <div
            className={buttonVariants({
              variant: mainFoot === "left" ? "primary" : "line",
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
            checked={mainFoot === "right"}
            onChange={() => toggleFoot("right")}
          />
          <div
            className={buttonVariants({
              variant: mainFoot === "right" ? "primary" : "line",
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
