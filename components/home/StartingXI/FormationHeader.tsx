"use client";

import React from "react";
import Image from "next/image";

interface FormationHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const FormationHeader = ({ activeTab, setActiveTab }: FormationHeaderProps) => (
    <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-1">
            <span className="text-white text-2xl font-black italic tracking-tighter">BEST</span>
            <span className="text-[#CCFF00] text-2xl font-black italic tracking-tighter">XI</span>
        </div>

        <div className="relative">
            <button className="flex items-center gap-2 bg-[#252525] hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors border border-gray-700/50">
                <div className="w-5 h-5 relative rounded-full overflow-hidden bg-[#004d98]">
                    <Image src="/images/ovr.png" alt="Logo" fill className="object-cover" />
                </div>
                <span className="text-white font-bold text-sm">바르셀로나 FC</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    </div>
);

export default FormationHeader;
