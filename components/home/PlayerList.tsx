"use client";

import React, { useState, useMemo } from "react";
import PlayerInfoList, { PlayerListHeader } from "./PlayerInfoList";
import type { Player } from "./PlayerInfoList";

/**
 * 탭 메뉴 컴포넌트
 */
const DISPLAY_GROUPS = [
    { id: "attack", label: "공격", positions: ["ST", "FW", "LW", "RW"] },
    { id: "mid", label: "미드", positions: ["CAM", "CDM", "LM", "RM", "MF"] },
    { id: "defense", label: "수비", positions: ["CB", "LB", "RB", "DF", "WB", "GK"] },
];

/**
 * 탭 메뉴 컴포넌트
 */
const PlayerListTabs = ({
    activeTab,
    onTabChange
}: {
    activeTab: string;
    onTabChange: (id: string) => void;
}) => (
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

/**
 * 선수 목록 리스트 컴포넌트
 */
const PlayerList = ({ players, onPlayerSelect }: { players: Player[]; onPlayerSelect?: (player: Player) => void }) => {
    const [activeTab, setActiveTab] = useState("attack");
    const listRef = React.useRef<HTMLDivElement>(null);

    const groupedPlayers = useMemo(() => {
        const groups: Record<string, Player[]> = {
            attack: [],
            mid: [],
            defense: []
        };

        players.forEach(p => {
            const pos = p.position;
            if (DISPLAY_GROUPS[0].positions.includes(pos)) groups.attack.push(p);
            else if (DISPLAY_GROUPS[1].positions.includes(pos)) groups.mid.push(p);
            else groups.defense.push(p);
        });

        // Sort Defense group: Generic defenders first, GK last
        // If needed, you can add more specific sorting logic here
        groups.defense.sort((a, b) => {
            const isAGK = a.position === 'GK';
            const isBGK = b.position === 'GK';
            if (isAGK && !isBGK) return 1;
            if (!isAGK && isBGK) return -1;
            return 0;
        });

        return groups;
    }, [players]);

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(`section-${id}`);
        if (element && listRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 md:p-5 mt-4 md:mt-5 h-[600px] flex flex-col">
            <PlayerListTabs activeTab={activeTab} onTabChange={scrollToSection} />

            {/* Main Header (Rendered Once) */}
            <div className="mb-2">
                <PlayerListHeader />
            </div>

            <div
                ref={listRef}
                className="flex-1 overflow-y-auto scroll-smooth pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {DISPLAY_GROUPS.map(group => {
                    const groupPlayers = groupedPlayers[group.id];
                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <div key={group.id} id={`section-${group.id}`} className="scroll-mt-4">
                            {/* No intermediate headers here */}
                            <PlayerInfoList
                                players={groupPlayers}
                                onPlayerSelect={onPlayerSelect}
                                showHeader={false}
                            />
                        </div>
                    );
                })}

                {/* Empty State */}
                {players.length === 0 && (
                    <div className="text-gray-500 text-center py-10">선수가 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default PlayerList;
