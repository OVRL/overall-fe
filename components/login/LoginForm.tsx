"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface LoginFormProps {
    onBack?: () => void;
}

export default function LoginForm({ onBack }: LoginFormProps) {
    const [loginType, setLoginType] = useState<"individual" | "team">("individual");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setEmailError("이메일 양식에 맞게 입력해주세요");
        } else {
            setEmailError("");
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const isFormFilled = email.length > 0 && password.length > 0;

    return (
        <div className="flex flex-col h-full w-full bg-black text-white p-6 lg:p-12 lg:pt-20 relative">
            <div className="flex items-center justify-center relative mb-10 mt-2 lg:mb-8 lg:mt-0">
                {/* Back Button */}
                {onBack && (
                    <button onClick={onBack} className="absolute left-0 p-2 text-white hover:text-[#D2FF00] transition-colors lg:-mt-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19L5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                <h1 className="text-[20px] lg:text-[24px] font-bold">오버롤 로그인</h1>
            </div>

            <div className="flex gap-6 mb-12 ml-2 lg:hidden">
                <button
                    onClick={() => setLoginType("individual")}
                    className="flex items-center gap-2 cursor-pointer group"
                >

                </button>


            </div>

            <form className="flex-1 flex flex-col gap-10 lg:gap-8 lg:max-w-lg lg:mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
                <Input
                    label="이메일"
                    value={email}
                    onChange={handleEmailChange}
                    onClear={() => {
                        setEmail("");
                        setEmailError("");
                    }}
                    placeholder="아이디(이메일)를 입력해주세요"
                    errorMessage={emailError}
                />

                <Input
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onClear={() => setPassword("")}
                    placeholder="비밀번호를 입력해주세요"
                />

                <div className="mt-8 lg:mt-6">
                    <Button
                        size="full"
                        className={`
                  transition-all duration-300
                  ${isFormFilled
                                ? 'bg-[#D2FF00] text-black hover:bg-[#c2eb00]'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                `}
                        onClick={() => {
                            if (isFormFilled && !emailError) {
                                console.log("Login Attempt");
                            }
                        }}
                        disabled={!isFormFilled || !!emailError}
                    >
                        로그인
                    </Button>
                </div>
            </form>
        </div>
    );
}
