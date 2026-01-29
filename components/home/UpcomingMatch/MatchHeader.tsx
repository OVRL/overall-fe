"use client";

import React from "react";

/**
 * 다가오는 경기 컴포넌트 헤더 (타이틀)
 */
const MatchHeader = () => (
    <div className="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 text-sm lg:text-lg mb-2 lg:mb-0 text-primary">
        {/* SVG 아이콘 */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="w-5 h-5"
        >
            <path
                d="M6.66663 1.66666V4.99999"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.3334 1.66666V4.99999"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 8.33334H17.5"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        <span className="font-bold whitespace-nowrap">다가오는 경기</span>
    </div>
);

export default MatchHeader;
