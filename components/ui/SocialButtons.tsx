import React from "react";
import Icon from "@/components/Icon";
import kakaoLogo from "@/public/icons/kakao_logo.svg";
import naverLogo from "@/public/icons/naver_logo.svg";
import googleLogo from "@/public/icons/google_logo.svg";

export type SocialProvider = "kakao" | "naver" | "google";

interface SocialOption {
  id: SocialProvider;
  label: string;
  icon: React.ReactNode;
  styleClass: string;
}

const SOCIAL_PROVIDERS: SocialOption[] = [
  {
    id: "kakao",
    label: "카카오 로그인",
    styleClass: "bg-[#FEE500] text-[#3A1D1D] hover:bg-[#FDD835]",
    icon: <Icon src={kakaoLogo} width={24} height={24} alt="Kakao" />,
  },
  {
    id: "naver",
    label: "네이버 로그인",
    styleClass: "bg-[#1EC800] text-white hover:bg-[#02B350]",
    icon: <Icon src={naverLogo} alt="Naver" width={24} height={24} />,
  },
  {
    id: "google",
    label: "구글 로그인",
    styleClass: "bg-white text-black hover:bg-gray-100",
    icon: <Icon src={googleLogo} alt="Google" nofill width={24} height={24} />,
  },
] as const;

export default function SocialButtons() {
  return (
    <ul className="flex justify-center gap-6.25">
      {SOCIAL_PROVIDERS.map((provider) => (
        <li key={provider.id}>
          <button
            type="button"
            aria-label={provider.label}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full
              transition-all duration-200 active:scale-95
              shadow-sm hover:shadow-md cursor-pointer
              ${provider.styleClass}
            `}
          >
            {provider.icon}
          </button>
        </li>
      ))}
    </ul>
  );
}
