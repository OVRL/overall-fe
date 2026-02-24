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
        className="flex items-center gap-1 border border-fill-primary text-Label-AccentPrimary py-1.5 px-3 rounded-[1.25rem] text-sm font-semibold"
      >
        <Icon src={plus} alt="plus icon" aria-hidden /> 경기 등록하기
      </button>
    </li>
  );
};

export default RegisterGameButton;
