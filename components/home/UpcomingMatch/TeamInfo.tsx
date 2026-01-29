"use client";

import React from "react";
import Image from "next/image";

interface TeamInfoProps {
    name: string;
    logo: string;
    logoColor: string;
    reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름]
    mobileLayout?: boolean; // 모바일 뷰 전용 스타일 적용 여부
}

const TeamInfo = ({
    name,
    logo,
    logoColor,
    reverse = false,
    mobileLayout = false,
}: TeamInfoProps) => {
    return (
        <div
            className={`flex items-center gap-1.5 lg:gap-4 ${reverse ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* 로고 */}
            <div
                className={`${mobileLayout ? "w-6 h-6" : "w-10 h-10"} ${logoColor} rounded-full relative overflow-hidden shrink-0`}
            >
                <Image src={logo} alt={name} fill className="object-cover" />
            </div>
            {/* 이름 */}
            <span
                className={`text-white font-medium ${mobileLayout ? "text-[0.6875rem] xs:text-sm" : "text-base"} whitespace-nowrap`}
            >
                {name}
            </span>
        </div>
    );
};

export default TeamInfo;
