import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import AuthTextField from "@/components/login/AuthTextField";
import { Button } from "@/components/ui/Button";

interface StepVerificationProps {
    initialName: string;
    initialPhone: string;
    onNext: (name: string, phone: string) => void;
}

const StepVerification = ({ initialName, initialPhone, onNext }: StepVerificationProps) => {
    const [method, setMethod] = useState<"kakao" | "phone">("kakao");
    const [isVerifying, setIsVerifying] = useState(false);

    // Phone verification state
    const [phone, setPhone] = useState(initialPhone);
    const [name, setName] = useState(initialName);

    const handleKakaoVerify = () => {
        setIsVerifying(true);
        // Simulate API call
        setTimeout(() => {
            setIsVerifying(false);
            // Auto-fill mock data
            onNext("홍길동", "010-1234-5678");
        }, 1500);
    };

    const handlePhoneSubmit = () => {
        if (name && phone.length >= 10) {
            onNext(name, phone);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {method === "kakao" ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-bold text-white">간편하게 본인인증 하세요</h3>
                        <p className="text-Label-Tertiary text-sm">카카오톡으로 빠르고 안전하게 인증할 수 있습니다.</p>
                    </div>

                    <button
                        onClick={handleKakaoVerify}
                        disabled={isVerifying}
                        className="w-full max-w-sm bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-medium rounded-xl p-4 flex items-center justify-center gap-3 transition-colors relative overflow-hidden"
                    >
                        {isVerifying ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-[#191919] border-t-transparent rounded-full animate-spin"></span>
                                인증 진행중...
                            </span>
                        ) : (
                            <>
                                <Icon name="kakao" className="w-6 h-6" />
                                <span>카카오톡으로 본인인증</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-4 w-full max-w-sm">
                        <div className="h-px bg-gray-800 flex-1"></div>
                        <span className="text-xs text-Label-Tertiary">또는</span>
                        <div className="h-px bg-gray-800 flex-1"></div>
                    </div>

                    <button
                        onClick={() => setMethod("phone")}
                        className="text-Label-Tertiary text-sm hover:text-white underline underline-offset-4 decoration-current transition-colors"
                    >
                        휴대폰 문자로 인증하기
                    </button>
                </div>
            ) : (
                <div className="flex-1 space-y-6 animate-slide-in">
                    <div className="space-y-4">
                        <AuthTextField
                            label="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="실명 입력"
                            onClear={() => setName("")}
                        />
                        <AuthTextField
                            label="휴대폰 번호"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`))}
                            placeholder="010-1234-5678"
                            onClear={() => setPhone("")}
                        />
                    </div>

                    <button
                        onClick={() => setMethod("kakao")}
                        className="text-Label-Tertiary text-sm hover:text-white block text-center transition-colors mt-4"
                    >
                        ← 카카오 인증으로 돌아가기
                    </button>
                </div>
            )}

            {method === "phone" && (
                <div className="mt-auto pt-6">
                    <Button
                        size="xl"
                        onClick={handlePhoneSubmit}
                        disabled={!name || phone.length < 12}
                        className={
                            name && phone.length >= 12
                                ? "bg-Fill_AccentPrimary text-Label-Fixed_black hover:bg-Fill_AccentPrimary-hover"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }
                    >
                        확인
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StepVerification;
