import React from "react";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
    icon: <Icon name="kakao" size={24} />,
  },
  {
    id: "naver",
    label: "네이버 로그인",
    styleClass: "bg-[#1EC800] text-white hover:bg-[#02B350]",
    icon: <Icon name="naver" size={24} />,
  },
  {
    id: "google",
    label: "구글 로그인",
    styleClass: "bg-white text-black hover:bg-gray-100",
    icon: <Icon name="google" size={24} />,
  },
] as const;

export default function SocialButtons() {
  return (
    <div className="flex flex-col gap-2 w-full">
      {SOCIAL_PROVIDERS.map((provider) => (
        <Link
          key={provider.id}
          href={`/api/auth/${provider.id}/callback`}
          className="w-full"
        >
          <Button
            size="xl"
            className={provider.styleClass}
            leftIcon={provider.icon}
          >
            {provider.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
