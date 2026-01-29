import React, { useState } from "react";
import AuthTextField from "@/components/login/AuthTextField";
import { Button } from "@/components/ui/Button";

interface StepEmailProps {
    initialValue: string;
    onNext: (email: string) => void;
}

const StepEmail = ({ initialValue, onNext }: StepEmailProps) => {
    const [email, setEmail] = useState(initialValue);
    const [error, setError] = useState("");

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "이메일을 입력해주세요.";
        if (!emailRegex.test(value)) return "올바른 이메일 형식이 아닙니다.";
        return "";
    };

    const handleNext = () => {
        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }
        onNext(email);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleNext();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <AuthTextField
                    label="이메일"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="아이디를 입력해주세요."
                    errorMessage={error}
                    onClear={() => setEmail("")}
                />
            </div>

            <div className="mt-auto pt-6 pb-8">
                <Button
                    size="xl"
                    onClick={handleNext}
                    disabled={!email}
                    className={
                        email
                            ? "bg-[#333333] text-white hover:bg-[#444444] border-none" // Dark button as per visual ref
                            : "bg-[#333333] text-white/30 cursor-not-allowed"
                    }
                >
                    다음
                </Button>
            </div>
        </div>
    );
};

export default StepEmail;
