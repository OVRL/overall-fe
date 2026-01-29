"use client";

import React from "react";

const PlayerListHeader = () => (
    <div className="grid grid-cols-[2.8125rem_1.875rem_1fr_2.8125rem] md:grid-cols-[3.75rem_3.125rem_1fr_3.125rem] items-center gap-1 md:gap-4 px-2 md:px-3 py-2 text-gray-500 text-xs md:text-xs border-b border-gray-800 whitespace-nowrap">
        <span>포지션</span>
        <span className="text-center">등번호</span>
        <span>선수명</span>
        <span className="text-right">OVR</span>
    </div>
);

export default PlayerListHeader;
