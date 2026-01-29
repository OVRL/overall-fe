"use client";

import React from "react";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop, MatchInfoMobile } from "./MatchInfo";

/**
 * 다가오는 경기 카드 컴포넌트
 */
const UpcomingMatch = () => {
    return (
        <div className="bg-surface-secondary rounded-[1.25rem] p-4 lg:p-6 mb-4 lg:mb-5 border border-primary/30 lg:border-transparent">
            {/* Header + Mobile Info */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="text-center lg:text-left lg:flex-1">
                    <MatchHeader />
                    <MatchInfoMobile />
                </div>

                <MatchInfoDesktop />

                {/* Action Button */}
                <div className="w-full lg:w-auto lg:flex-1 lg:flex lg:justify-end">
                    <button className="bg-primary hover:bg-primary-hover text-black font-bold py-2.5 lg:py-3 px-6 lg:px-8 rounded-lg transition-colors w-full lg:w-auto text-sm lg:text-base whitespace-nowrap">
                        포메이션 확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingMatch;
