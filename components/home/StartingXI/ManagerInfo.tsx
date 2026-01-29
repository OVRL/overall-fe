"use client";

import React from "react";
import Image from "next/image";

/**
 * 감독 스탯 정보
 */
const ManagerStatItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-gray-500 text-xs md:text-sm">{label}</p>
        <p className="text-white font-bold text-sm md:text-base">{value}</p>
    </div>
);

/**
 * 감독 스탯 정보
 */
const ManagerStats = () => (
    <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value="30" />
        <ManagerStatItem label="승/무/패" value="20/5/5" />
        <ManagerStatItem label="팀 승률" value="60%" />
    </div>
);

/**
 * 감독 정보 섹션
 */
const ManagerInfo = () => (
    <div className="flex items-center justify-center gap-2 md:gap-6 mt-4 md:mt-5 flex-nowrap overflow-x-visible">
        {/* 감독 사진 */}
        <div className="relative shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden relative">
                <Image
                    src="/images/player/img_player-1.png"
                    alt="Manager"
                    fill
                    className="object-cover"
                />
            </div>
        </div>

        {/* 감독 정보 */}
        <div className="text-left">
            <p className="text-gray-500 text-xs md:text-sm">감독</p>
            <p className="text-white font-bold text-base md:text-lg">정태우</p>
        </div>

        {/* 스탯 */}
        <ManagerStats />
    </div>
);

export default ManagerInfo;
