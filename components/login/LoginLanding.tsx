"use client";

import React from "react";
import Image from "next/image";
import SocialButton from "@/components/ui/SocialButton";

interface LoginLandingProps {
    onEmailLoginClick: () => void;
}

export default function LoginLanding({ onEmailLoginClick }: LoginLandingProps) {
    return (
        <div className="flex flex-col h-full w-full justify-between items-center bg-gradient-to-br from-[#C2FF34] via-[#3A4A2A] to-black relative overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-end justify-center">
                <div className="relative w-full h-[60%] opacity-50">
                    <Image
                        src="/images/bg_zlatan.webp"
                        alt="Background"
                        fill
                        className="object-contain object-bottom"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A4A2A]/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
            </div>
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-8 mt-6">
                <div className="mb-6 animate-in zoom-in duration-700">
                    <Image
                        src="/images/ovr.png"
                        alt="OVR Logo"
                        width={220}
                        height={220}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>


            <div className="relative z-10 w-full p-6 pb-12 lg:pb-20 flex flex-col gap-3 max-w-sm mx-auto animate-in slide-in-from-bottom duration-500 fade-in">
                <SocialButton provider="kakao" onClick={() => console.log("Kakao Login")}>
                    카카오 로그인
                </SocialButton>
                <SocialButton provider="naver" onClick={() => console.log("Naver Login")}>
                    네이버 로그인
                </SocialButton>
                <SocialButton provider="email" onClick={onEmailLoginClick}>
                    이메일로 로그인
                </SocialButton>

                <div className="flex items-center justify-center gap-4 mt-4 text-[13px] text-white/50">
                    <button className="hover:text-white transition-colors">아이디찾기</button>
                    <span className="w-[1px] h-3 bg-white/20"></span>
                    <button className="hover:text-white transition-colors">비밀번호찾기</button>
                    <span className="w-[1px] h-3 bg-white/20"></span>
                    <button className="hover:text-white transition-colors">회원가입</button>
                </div>
            </div>
        </div>
    );
}
