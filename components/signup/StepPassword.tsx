import React, { useState } from "react";
import AuthTextField from "@/components/login/AuthTextField";
import { Button } from "@/components/ui/Button";


interface StepPasswordProps {
    onNext: (password: string) => void;
}

const StepPassword = ({ onNext }: StepPasswordProps) => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);

    // Strength calculation
    const getStrength = (pw: string) => {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[a-zA-Z]/.test(pw)) score++;
        // if (/[!@#$%^&*]/.test(pw)) score++; // Screenshot mentions "Eng, Num 8~20 chars"
        return Math.min(score, 3);
    };

    const strength = getStrength(password);
    const isConfirmValid = !confirm || password === confirm;

    // Requirement check based on screenshot: "영문, 숫자포함 8~20자 이내"
    const isLengthValid = password.length >= 8 && password.length <= 20;
    const isTypeValid = /[0-9]/.test(password) && /[a-zA-Z]/.test(password);

    const isValid = isLengthValid && isTypeValid && password === confirm;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-8">
                <div>
                    <div className="relative">
                        <AuthTextField
                            label="비밀번호"
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해주세요."
                            onClear={() => setPassword("")}
                        />
                        {/* Override clear button area if needed for show/hide, but AuthTextField has clear. 
                 We can stick to simple Clear. Screenshot doesn't show Show/Hide button, just standard input.
                 But user UX is better with it. Keeping it hidden or minimal if needed. 
                 Ref image shows just clear icon. */}
                    </div>

                    <div className="mt-2 px-3">
                        <p className="text-Label-Tertiary text-xs">
                            영문, 숫자포함 8~20자 이내
                        </p>
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <AuthTextField
                            label="비밀번호 확인"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="비밀번호를 다시 입력해주세요."
                            onClear={() => setConfirm("")}
                        />
                        {/* Custom mismatch message styling if needed, otherwise AuthTextField handles it via props.
                Ref image shows "비밀번호 일치" message below. 
            */}
                    </div>
                    <div className="mt-2 px-3">
                        {confirm && password === confirm ? (
                            <p className="text-[#D2F700] text-xs">비밀번호 일치</p> // Volt green for match
                        ) : confirm && !isConfirmValid ? (
                            <p className="text-Fill_Error text-xs">비밀번호가 일치하지 않습니다.</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 pb-8">
                <Button
                    size="xl"
                    onClick={() => isValid && onNext(password)}
                    disabled={!isValid}
                    className={
                        isValid
                            ? "bg-[#333333] text-white hover:bg-[#444444] border-none"
                            : "bg-[#333333] text-white/30 cursor-not-allowed"
                    }
                >
                    다음
                </Button>
            </div>
        </div>
    );
};

export default StepPassword;
