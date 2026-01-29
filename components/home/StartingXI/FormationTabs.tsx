"use client";

import React from "react";

/**
 * 포메이션 탭 버튼 그룹
 */
interface FormationTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const FormationTabs = ({ activeTab, onTabChange }: FormationTabsProps) => (
    <div className="flex gap-1 md:gap-4 flex-nowrap">
        {["대표", "A", "B", "C"].map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-2 xs:px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] xs:text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab
                    ? "bg-primary text-black"
                    : "bg-transparent border border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

export default FormationTabs;
