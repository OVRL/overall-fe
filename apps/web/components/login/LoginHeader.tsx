"use client";
import Icon from "@/components/ui/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";

interface LoginHeaderProps {
  onBack?: () => void;
}

export default function LoginHeader({ onBack }: LoginHeaderProps) {
  return (
    <header className="relative flex items-center justify-center h-14 w-full">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-0 p-2 text-white hover:text-primary transition-colors"
        >
          <Icon src={arrowBack} alt="back" />
        </button>
      )}
      <h1 className="text-xl text-Label-Primary font-bold">오버롤 로그인</h1>
    </header>
  );
}
