import Icon from "./Icon";
import arrow_down from "@/public/icons/arrow_down.svg";

const Dropdown = () => {
  return (
    <div className="py-3 pl-4 pr-1.75 flex gap-2.5 bg-Fill_Quatiary w-39.5 h-12 justify-end items-center rounded-[0.625rem] text-Fill_Tertiary">
      <span className="w-25.25 text-sm text-Label-Secondary text-ellipsis">
        2025 시즌
      </span>
      <Icon src={arrow_down} width={24} height={24} />
    </div>
  );
};

export default Dropdown;
