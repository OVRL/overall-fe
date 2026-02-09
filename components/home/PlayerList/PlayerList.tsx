"use client";

import React, { useState, useMemo, useRef } from "react";
import PlayerInfoList, { PlayerListHeader } from "./PlayerInfoList";
import PlayerListTabs, { DISPLAY_GROUPS } from "./PlayerListTabs";
import type { Player } from "@/types/player";

/**
 * 선수 목록 리스트 컴포넌트
 */
const PlayerList = ({
  players,
  onPlayerSelect,
}: {
  players: Player[];
  onPlayerSelect?: (player: Player) => void;
}) => {
  const [activeTab, setActiveTab] = useState("attack");
  const listRef = useRef<HTMLDivElement>(null);

  const groupedPlayers = useMemo(() => {
    const groups: Record<string, Player[]> = {
      attack: [],
      mid: [],
      defense: [],
    };

    players.forEach((p) => {
      const pos = p.position;
      if (DISPLAY_GROUPS[0].positions.includes(pos)) groups.attack.push(p);
      else if (DISPLAY_GROUPS[1].positions.includes(pos)) groups.mid.push(p);
      else groups.defense.push(p);
    });

    // Sort Defense group: Generic defenders first, GK last
    groups.defense.sort((a, b) => {
      const isAGK = a.position === "GK";
      const isBGK = b.position === "GK";
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-surface-secondary rounded-[1.25rem] p-4 md:p-5 mt-4 md:mt-5 h-150 flex flex-col">
      <PlayerListTabs activeTab={activeTab} onTabChange={scrollToSection} />

      {/* Main Header (Rendered Once) */}
      <div className="mb-2">
        <PlayerListHeader />
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto scroll-smooth pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {DISPLAY_GROUPS.map((group) => {
          const groupPlayers = groupedPlayers[group.id];
          if (!groupPlayers || groupPlayers.length === 0) return null;

          return (
            <div
              key={group.id}
              id={`section-${group.id}`}
              className="scroll-mt-4"
            >
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
          <div className="text-gray-500 text-center py-10">
            선수가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
