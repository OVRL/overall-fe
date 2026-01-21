"use client";

import React, { useState } from "react";

// ============================================================
// InputErrorMessage 컴포넌트
// 에러 메시지 표시 전담
// ============================================================
interface InputErrorMessageProps {
    message?: string;
}

function InputErrorMessage({ message }: InputErrorMessageProps) {
    if (!message) return null;

    return (
        <p className="text-Fill_Error pl-1 mt-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {message}
        </p>
    );
}

// ============================================================
// InputField 컴포넌트
// 순수한 input 필드 + clear 버튼
// ============================================================
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    hasError?: boolean;
}

function InputField({ onClear, hasError, ...props }: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            <input
                {...props}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                className={`
                    w-full bg-transparent text-[16px] lg:text-[18px] py-3 pr-10 outline-none border-b transition-colors duration-200
                    text-white placeholder:text-gray-500 border-white/20
                    ${isFocused ? 'border-primary' : ''}
                    ${hasError ? 'border-Fill_Error' : ''}
                `}
            />

            {/* Clear Button */}
            {props.value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-colors text-white/40 hover:text-white"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ============================================================
// Input 컴포넌트 (조합 컴포넌트)
// InputField + InputErrorMessage를 조합
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    onClear?: () => void;
    errorMessage?: string;
}

export default function Input({ label, className = "", onClear, errorMessage, ...props }: InputProps) {
    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && <label className="text-xs pl-1 font-bold text-white/60 transition-colors">{label}</label>}

            <InputField
                {...props}
                onClear={onClear}
                hasError={!!errorMessage}
            />

            <InputErrorMessage message={errorMessage} />
        </div>
    );
}

