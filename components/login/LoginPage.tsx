"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginLanding from "@/components/login/LoginLanding";
import LoginForm from "@/components/login/LoginForm";

function LoginContent() {
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
        <main className="w-full h-[100dvh] bg-black min-w-[280px] overflow-x-hidden">

            {!showForm && (
                <div className="w-full h-full bg-[#1E2414]">
                    <LoginLanding onEmailLoginClick={handleEmailLoginClick} />
                </div>
            )}


            {showForm && (
                <div className="w-full h-full bg-black animate-in fade-in slide-in-from-right-10 duration-300">
                    <LoginForm onBack={handleBack} />
                </div>
            )}
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="w-full h-full bg-black min-w-[280px]" />}>
            <LoginContent />
        </Suspense>
    );
}
