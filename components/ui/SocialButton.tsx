import React from "react";

const Icons = {
    kakao: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3A1D1D]">
            <path d="M12 3C5.925 3 1 6.925 1 11.775C1 14.65 2.875 17.225 5.675 18.725C5.45 19.55 4.75 21.325 4.675 21.65C4.6 21.9 4.9 22.025 5.125 21.875C6.15 21.2 8.35 19.725 9.4 19.025C10.225 19.15 11.1 19.2 12 19.2C18.075 19.2 23 15.275 23 10.425C23 5.575 18.075 3 12 3Z" />
        </svg>
    ),
    naver: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
            <path d="M16.42 20H21V4H16.33L7.75 15.68V4H3V20H7.8L16.42 20Z" />
        </svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6L12 13L2 6" />
        </svg>
    )
};

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    provider: "kakao" | "naver" | "email";
    children: React.ReactNode;
}

export default function SocialButton({ provider, children, className = "", ...props }: SocialButtonProps) {

    const providerStyles = {
        kakao: "bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]",
        naver: "bg-[#03C75A] text-white hover:bg-[#02B350]",
        email: "bg-white text-black hover:bg-gray-100",
    };

    const icon = provider === "kakao" ? Icons.kakao : provider === "naver" ? Icons.naver : Icons.mail;

    return (
        <button
            className={`
        w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-[15px]
        transition-transform duration-200 active:scale-[0.98]
        ${providerStyles[provider]}
        ${className}
      `}
            {...props}
        >
            <span className="shrink-0">{icon}</span>
            <span>{children}</span>
        </button>
    );
}
