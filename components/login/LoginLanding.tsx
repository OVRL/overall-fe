"use client";

import React from "react";
import Image from "next/image";
import LoginLogo from "@/components/login/LoginLogo";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";
import AuthLinks from "@/components/login/AuthLinks";

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
            <LoginLogo />


            <div className="relative z-10 w-full p-6 pb-12 lg:pb-20 flex flex-col gap-3 max-w-sm mx-auto animate-in slide-in-from-bottom duration-500 fade-in">
                <SocialLoginButtons onEmailLoginClick={onEmailLoginClick} />
                <AuthLinks />
            </div>
        </div>
    );
}
