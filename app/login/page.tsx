"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SocialButton from "@/components/ui/SocialButton";
import Icon from "@/components/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";

// ============================================================
// 서브 컴포넌트: LoginLogo
// ============================================================
function LoginLogo() {
    return (
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
    );
}

// ============================================================
// 서브 컴포넌트: SocialLoginButtons
// ============================================================
interface SocialLoginButtonsProps {
    onEmailLoginClick: () => void;
}

function SocialLoginButtons({ onEmailLoginClick }: SocialLoginButtonsProps) {
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

// ============================================================
// 서브 컴포넌트: AuthLinks
// ============================================================
function AuthLinks() {
    return (
        <div className="flex items-center justify-center gap-4 mt-4 text-[13px] text-white/50">
            <button className="hover:text-white transition-colors">아이디찾기</button>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <button className="hover:text-white transition-colors">비밀번호찾기</button>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <button className="hover:text-white transition-colors">회원가입</button>
        </div>
    );
}

// ============================================================
// 서브 컴포넌트: LoginLanding
// ============================================================
interface LoginLandingProps {
    onEmailLoginClick: () => void;
}

function LoginLanding({ onEmailLoginClick }: LoginLandingProps) {
    return (
        <div className="flex flex-col h-full w-full justify-between items-center bg-gradient-to-br from-primary-light via-dark-olive to-black relative overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-br from-dark-olive/40 via-transparent to-transparent" />
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

// ============================================================
// 서브 컴포넌트: LoginHeader
// ============================================================
interface LoginHeaderProps {
    onBack?: () => void;
}

function LoginHeader({ onBack }: LoginHeaderProps) {
    return (
        <div className="flex items-center justify-center relative pb-10 lg:pb-8">
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute left-0 p-2  hover:text-primary transition-colors"
                >
                    <Icon src={arrowBack} color="black" />
                </button>
            )}
            <h1 className="text-[20px] lg:text-[24px] font-bold">오버롤 로그인</h1>
        </div>
    );
}

// ============================================================
// 서브 컴포넌트: EmailLoginForm
// ============================================================
interface EmailLoginFormProps {
    onSubmit?: (email: string, password: string) => void;
}

function EmailLoginForm({ onSubmit }: EmailLoginFormProps) {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormFilled && !emailError) {
            onSubmit?.(email, password);
        }
    };

    return (
        <form
            className="flex-1 flex flex-col gap-10 lg:gap-8 lg:max-w-lg lg:mx-auto w-full"
            onSubmit={handleSubmit}
        >
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
                            ? 'bg-primary text-black hover:bg-primary-hover'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }
                    `}
                    disabled={!isFormFilled || !!emailError}
                >
                    로그인
                </Button>
            </div>
        </form>
    );
}

// ============================================================
// 서브 컴포넌트: EmailLoginContainer
// 이메일 로그인 화면의 레이아웃과 구조를 담당
// ============================================================
interface EmailLoginContainerProps {
    onBack?: () => void;
}

function EmailLoginContainer({ onBack }: EmailLoginContainerProps) {
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

// ============================================================
// 메인 로그인 컨텐츠 컴포넌트
// ============================================================
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
                <div className="w-full h-full bg-bg-dark">
                    <LoginLanding onEmailLoginClick={handleEmailLoginClick} />
                </div>
            )}


            {showForm && (
                <div className="w-full h-full bg-black animate-in fade-in slide-in-from-right-10 duration-300">
                    <EmailLoginContainer onBack={handleBack} />
                </div>
            )}
        </main>
    );
}

// ============================================================
// Page 컴포넌트 (default export)
// ============================================================
export default function Page() {
    return (
        <Suspense fallback={<div className="w-full h-full bg-black min-w-[280px]" />}>
            <LoginContent />
        </Suspense>
    );
}
