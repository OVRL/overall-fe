"use client";

import React from "react";

interface LoginHeaderProps {
    onBack?: () => void;
}

export default function LoginHeader({ onBack }: LoginHeaderProps) {
    return (
        <div className="flex items-center justify-center relative pb-10 lg:pb-8">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute left-0 p-2 text-white hover:text-primary transition-colors"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="M19 12H5M12 19L5 12L12 5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
            <h1 className="text-[20px] lg:text-[24px] font-bold">오버롤 로그인</h1>
        </div>
    );
}
