"use client";

import React, { useState } from "react";
import { Player } from "@/types/formation";
import PlayerListFilter from "./PlayerListFilter";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import plus from "@/public/icons/plus.svg";
import FormationPlayerGroupList from "./FormationPlayerGroupList";

interface FormationPlayerListProps {
  players: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null; // For Mobile Tap-to-Place
  onSelectPlayer: (player: Player) => void;
  isLineupFull: boolean;
  onAddPlayer?: (name: string) => void;
  onRemovePlayer?: (id: number) => void;
  targetPosition?: string | null; // e.g., "ST", "CDM"
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
}

export default function FormationPlayerList({
  players,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  isLineupFull,
  onAddPlayer,
  onRemovePlayer,
  targetPosition,
  activePosition,
}: FormationPlayerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePosTab, setActivePosTab] = useState<string>("전체");

  // 타겟 포지션이나 활성 포지션이 변경될 때 자동으로 포지션 탭 전환
  React.useEffect(() => {
    // 활성 포지션(activePosition)이 있으면 우선순위
    const target = activePosition?.role || targetPosition;

    if (!target) return;

    const pos = target.toUpperCase();
    if (["ST", "CF", "RW", "LW", "RF", "LF", "RS", "LS"].includes(pos))
      setActivePosTab("FW");
    else if (
      [
        "CAM",
        "CM",
        "CDM",
        "RM",
        "LM",
        "LCM",
        "RCM",
        "LDM",
        "RDM",
        "RAM",
        "LAM",
        "RCAM",
        "LCAM",
      ].includes(pos)
    )
      setActivePosTab("MF");
    else if (["CB", "LB", "RB", "LWB", "RWB", "SW", "LCB", "RCB"].includes(pos))
      setActivePosTab("DF");
    else if (["GK"].includes(pos)) setActivePosTab("GK");
    else setActivePosTab("전체");
  }, [targetPosition, activePosition]);

  // 선수가 현재 쿼터의 라인업에 포함되어 있는지 확인 (어느 팀인지 포함)
  // FormationPlayerGroupList로 이동했으나, 필터링 로직에 필요하다면 유지?
  // 현재 필터 로직은 팀 정보를 사용하지 않음. 따라서 filteredPlayers가 의존하지 않는다면 제거 가능.
  // filteredPlayers는 포지션 기반(`activePosTab`)임.

  // 필터 로직
  const filteredPlayers = players.filter((p) => {
    // 1. 검색
    if (searchTerm && !p.name.includes(searchTerm)) return false;

    // 2. 포지션 탭
    if (activePosTab !== "전체") {
      const pos = p.position; // 선수의 주 포지션
      let mapped = "전체";
      if (["ST", "CF", "RW", "LW", "RF", "LF"].includes(pos)) mapped = "FW";
      else if (["CAM", "CM", "CDM", "RM", "LM"].includes(pos)) mapped = "MF";
      else if (["CB", "LB", "RB", "LWB", "RWB", "SW"].includes(pos))
        mapped = "DF";
      else if (["GK"].includes(pos)) mapped = "GK";

      if (activePosTab === "FW" && mapped !== "FW") return false;
      if (activePosTab === "MF" && mapped !== "MF") return false;
      if (activePosTab === "DF" && mapped !== "DF") return false;
      if (activePosTab === "GK" && mapped !== "GK") return false;
    }

    return true;
  });

  return (
    <section
      aria-label="선수 목록"
      className="w-full lg:w-90 2xl:w-90 flex flex-col shrink-0 transition-all duration-300"
    >
      <div className="w-full h-full flex-1 flex justify-center bg-surface-card border border-border-card rounded-xl shadow-card">
        <aside className="h-full p-4 flex flex-col gap-3 w-full md:w-92 lg:w-full">
          <PlayerListFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activePosTab={activePosTab}
            onPosTabChange={setActivePosTab}
          />
          <Button
            variant="line"
            size="m"
            onClick={() => {
              const name = prompt("새로운 선수의 이름을 입력하세요:");
              if (name && name.trim()) onAddPlayer?.(name.trim());
            }}
            className="flex gap-1 text-Label-Primary font-semibold"
          >
            <Icon src={plus} alt="plus icon" aria-hidden={true} />
            선수 추가
          </Button>

          <FormationPlayerGroupList
            filteredPlayers={filteredPlayers}
            currentQuarterLineups={currentQuarterLineups}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={onSelectPlayer}
            onRemovePlayer={onRemovePlayer}
          />
        </aside>
      </div>
    </section>
  );
}
