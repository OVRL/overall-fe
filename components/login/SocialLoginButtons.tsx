"use client";

import React from "react";
import SocialButton from "@/components/ui/SocialButton";

interface SocialLoginButtonsProps {
    onEmailLoginClick: () => void;
}

export default function SocialLoginButtons({ onEmailLoginClick }: SocialLoginButtonsProps) {
    return (
        <>
            <SocialButton provider="kakao" onClick={() => console.log("Kakao Login")}>
                카카오 로그인
            </SocialButton>
            <SocialButton provider="naver" onClick={() => console.log("Naver Login")}>
                네이버 로그인
            </SocialButton>
            <SocialButton provider="email" onClick={onEmailLoginClick}>
                이메일로 로그인
            </SocialButton>
        </>
    );
}
