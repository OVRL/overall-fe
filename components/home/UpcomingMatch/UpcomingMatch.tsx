"use client";

import React from "react";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop, MatchInfoMobile } from "./MatchInfo";

/**
 * 다가오는 경기 카드 컴포넌트
 */
const UpcomingMatch = () => {
    return (
        <div className="bg-[#1A1A1A] rounded-[1.25rem] p-4 lg:p-6 mb-4 lg:mb-5">
            {/* Header + Mobile Info */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="text-center lg:text-left lg:flex-1">
                    <MatchHeader />
                    <MatchInfoMobile />
                </div>

                <MatchInfoDesktop />

                {/* Action Button */}
                <div className="w-full lg:w-auto lg:flex-1 lg:flex lg:justify-end">
                    <button className="flex justify-center items-center gap-[10px] p-[12px] bg-[#CCFF00] hover:bg-[#B3E600] text-black font-bold rounded-[10px] transition-colors w-full lg:w-auto text-sm lg:text-base whitespace-nowrap box-border">
                        포메이션 확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingMatch;
