"use client";

import React from "react";
import LoginHeader from "@/components/login/LoginHeader";
import EmailLoginForm from "@/components/login/EmailLoginForm";

interface EmailLoginPageProps {
    onBack?: () => void;
}

export default function EmailLoginPage({ onBack }: EmailLoginPageProps) {
    const handleLoginSubmit = (email: string, password: string) => {
        console.log("Login Attempt", { email, password });
        // TODO: 실제 로그인 API 호출
    };

    return (
        <div className="flex flex-col h-full w-full bg-black text-white p-6 lg:p-12 lg:pt-20 relative">
            <LoginHeader onBack={onBack} />
            <EmailLoginForm onSubmit={handleLoginSubmit} />
        </div>
    );
}
