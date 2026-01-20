"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginLanding from "../components/login/LoginLanding";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const showForm = searchParams.get('form') === 'true';

    const handleEmailLoginClick = () => {
        router.push('/login?form=true');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        // Responsive Layout:
        // - Mobile: Full screen (no borders/rounding)
        // - PC: Full screen as well (removed phone frame styling)
        // - Unified dark theme for both
        <main className="w-full h-[100dvh] bg-black">

            {/* LANDING VIEW */}
            {!showForm && (
                <div className="w-full h-full bg-[#1E2414]">
                    <LoginLanding onEmailLoginClick={handleEmailLoginClick} />
                </div>
            )}

            {/* FORM VIEW */}
            {showForm && (
                <div className="w-full h-full bg-black animate-in fade-in slide-in-from-right-10 duration-300">
                    <LoginForm onBack={handleBack} />
                </div>
            )}
        </main>
    );
}
