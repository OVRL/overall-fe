"use client";

import Icon from "@/components/ui/Icon";
import useModal from "@/hooks/useModal";
import plus from "@/public/icons/plus.svg";

const RegisterGameButton = () => {
  const { openModal } = useModal("REGISTER_GAME");

  return (
    <li>
      <button
        type="button"
        onClick={() => openModal({})}
        className="flex items-center justify-center lg:justify-start w-full lg:w-auto gap-1 border border-fill-primary text-Label-AccentPrimary py-3 lg:py-1.5 px-4 lg:px-3 rounded-lg lg:rounded-[1.25rem] text-[0.9375rem] font-semibold cursor-pointer"
      >
        <Icon src={plus} alt="plus icon" aria-hidden /> 경기 등록하기
      </button>
    </li>
  );
};

export default RegisterGameButton;
