"use client";
import Icon from "@/components/ui/Icon";
import { useRouter } from "next/navigation";

interface LoginHeaderProps {
  onBack?: () => void;
}

export default function LoginHeader({ onBack }: LoginHeaderProps) {
  return (
    <div className="flex items-center justify-center relative pb-10 lg:pb-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-0 p-2 text-white hover:text-primary transition-colors"
        >
          <Icon name="arrow_back" size={24} />
        </button>
      )}
      <h1 className="text-xl text-gray-100 font-bold">오버롤 로그인</h1>
    </div>
  );
}
