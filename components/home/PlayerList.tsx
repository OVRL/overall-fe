"use client";

import React, { useState, useMemo } from "react";
import PlayerInfoList from "./PlayerInfoList";
import { POSITION_CATEGORY_MAP, Position, MainPosition } from "@/components/PositionChip";
import type { Player } from "./PlayerInfoList";

/**
 * 탭 메뉴 컴포넌트
 */
const PLAYER_LIST_TABS = ["전체", "선발", "교체", "OVR"] as const;

/**
 * 탭 메뉴 컴포넌트
 */
const PlayerListTabs = ({
    activeTab,
    onTabChange
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) => (
    <div className="flex gap-2 mb-4 bg-surface-primary p-1 rounded-xl">
        {PLAYER_LIST_TABS.map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-1.5 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm font-semibold transition-colors ${activeTab === tab
                    ? "bg-surface-tertiary text-white"
                    : "text-gray-500 hover:text-gray-300"
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

/**
 * 선수 목록 리스트 컴포넌트
 */
const PlayerList = ({ players, onPlayerSelect }: { players: Player[]; onPlayerSelect?: (player: Player) => void }) => {
    const [activeTab, setActiveTab] = useState("전체");

    const filteredAndGroupedPlayers = useMemo(() => {
        // 1. Filter
        let filtered = [...players];
        if (activeTab === "선발") {
            // Assuming "Starting" implies index 0-10 or strictly "id" check etc. 
            // Currently no 'isStarting' prop, usually derived from position in array (0-10).
            // Let's assume first 11 are starters for simple logic, or rely on prop if exists.
            // Using array index 0-10 as per StartingXI logic.
            filtered = filtered.slice(0, 11);
        } else if (activeTab === "교체") {
            filtered = filtered.slice(11);
        } else if (activeTab === "OVR") {
            filtered = filtered.sort((a, b) => b.overall - a.overall);
        }

        // 2. Group by Position (Only if not OVR sorted? Or always group? User said "Separate based on position")
        // If sorting by OVR, grouping might confuse the order. 
        // User said "Main Page... separate based on position". 
        // I will apply grouping for "전체", "선발", "교체".
        // For "OVR", I might keep flat list OR group by position then sort by OVR inside.
        // Let's group for all tabs for consistency with the request.

        const groups: Record<MainPosition, Player[]> = {
            FW: [],
            MF: [],
            DF: [],
            GK: []
        };

        filtered.forEach(p => {
            const mainPos = POSITION_CATEGORY_MAP[p.position as Position] || 'MF'; // Fallback
            if (groups[mainPos]) {
                groups[mainPos].push(p);
            }
        });

        return groups;
    }, [players, activeTab]);

    const positionOrder: MainPosition[] = ['FW', 'MF', 'DF', 'GK'];

    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 md:p-5 mt-4 md:mt-5">
            <PlayerListTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Header only once or per section? 
                If we group, header per section is redundant if identical.
                Or just Main Header then sections. 
                Let's do sections.
            */}

            <div className="flex flex-col gap-6">
                {positionOrder.map(pos => {
                    const groupPlayers = filteredAndGroupedPlayers[pos];
                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <div key={pos}>
                            <h3 className="text-white font-bold mb-2 pl-2 border-l-4 border-primary">
                                {pos} <span className="text-gray-500 text-sm font-normal">({groupPlayers.length})</span>
                            </h3>
                            <PlayerInfoList
                                players={groupPlayers}
                                showHeader={false}
                                onPlayerSelect={onPlayerSelect}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerList;
