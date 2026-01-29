"use client";

import React from "react";

export const DISPLAY_GROUPS = [
    { id: "attack", label: "공격", positions: ["ST", "FW", "LW", "RW"] },
    { id: "mid", label: "미드", positions: ["CAM", "CDM", "LM", "RM", "MF"] },
    { id: "defense", label: "수비", positions: ["CB", "LB", "RB", "DF", "WB", "GK"] },
];

interface PlayerListTabsProps {
    activeTab: string;
    onTabChange: (id: string) => void;
}

const PlayerListTabs = ({ activeTab, onTabChange }: PlayerListTabsProps) => {
    return (
        <div className="flex gap-2 mb-4 bg-surface-primary p-1 rounded-xl sticky top-0 z-10">
            {DISPLAY_GROUPS.map((group) => (
                <button
                    key={group.id}
                    onClick={() => onTabChange(group.id)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${activeTab === group.id
                        ? "bg-surface-tertiary text-white"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    {group.label}
                </button>
            ))}
        </div>
    );
};

export default PlayerListTabs;
