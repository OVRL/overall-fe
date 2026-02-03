import { buttonVariants } from "@/components/ui/Button";

type Props = {
  gender: "M" | "W";
  setGender: (gender: "M" | "W") => void;
};

const SelectGender = ({ gender, setGender }: Props) => {
  const toggleGender = (gender: "M" | "W") => {
    setGender(gender);
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
            checked={gender === "M"}
            onChange={() => toggleGender("M")}
          />
          <div
            className={buttonVariants({
              variant: gender === "M" ? "primary" : "line",
              size: "m",
            })}
          >
            남
          </div>
        </label>
        <label className="flex-1 cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={gender === "W"}
            onChange={() => toggleGender("W")}
          />
          <div
            className={buttonVariants({
              variant: gender === "W" ? "primary" : "line",
              size: "m",
            })}
          >
            여
          </div>
        </label>
      </div>
    </div>
  );
};

export default SelectGender;
