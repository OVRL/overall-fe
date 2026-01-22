"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import UpcomingMatch from "@/components/home/UpcomingMatch";
import StartingXI from "@/components/home/StartingXI";
import PlayerCard from "@/components/home/PlayerCard";
import PlayerList from "@/components/home/PlayerList";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
}

export default function HomePage() {
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: "박무트", position: "GK", number: 26, overall: 90, shooting: 25, passing: 40, dribbling: 16, defending: 90, physical: 60, pace: 50 },
        { id: 2, name: "호남두호남두", position: "LB", number: 26, overall: 90, shooting: 40, passing: 85, dribbling: 80, defending: 75, physical: 70, pace: 85 },
        { id: 3, name: "가깝밤베스", position: "CB", number: 26, overall: 90, shooting: 30, passing: 65, dribbling: 55, defending: 90, physical: 85, pace: 65 },
        { id: 4, name: "다라에밤베스", position: "CB", number: 26, overall: 90, shooting: 35, passing: 70, dribbling: 60, defending: 92, physical: 88, pace: 68 },
        { id: 5, name: "박무트", position: "RB", number: 26, overall: 90, shooting: 45, passing: 80, dribbling: 75, defending: 78, physical: 72, pace: 82 },
        { id: 6, name: "렌디", position: "CDM", number: 26, overall: 90, shooting: 65, passing: 88, dribbling: 82, defending: 72, physical: 75, pace: 78 },
        { id: 7, name: "제스퍼", position: "CDM", number: 26, overall: 90, shooting: 75, passing: 90, dribbling: 88, defending: 65, physical: 68, pace: 80 },
        { id: 8, name: "알베스", position: "CAM", number: 26, overall: 99, shooting: 70, passing: 92, dribbling: 85, defending: 68, physical: 70, pace: 82 },
        { id: 9, name: "수원알베스", position: "ST", number: 26, overall: 90, shooting: 92, passing: 82, dribbling: 88, defending: 40, physical: 78, pace: 90 },
        { id: 10, name: "박무트", position: "ST", number: 26, overall: 90, shooting: 99, passing: 90, dribbling: 95, defending: 35, physical: 80, pace: 95 },
        { id: 11, name: "박무트", position: "ST", number: 26, overall: 90, shooting: 94, passing: 85, dribbling: 90, defending: 38, physical: 82, pace: 92 },
    ]);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header showTeamSelector selectedTeam="바르셀로나 FC" />

            <main className="max-w-[1400px] mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* 왼쪽: 다가오는 경기 + Starting XI */}
                    <div>
                        <UpcomingMatch />
                        <StartingXI players={players} onPlayersChange={setPlayers} />
                    </div>

                    {/* 오른쪽: 선수 카드 + 선수 목록 */}
                    <div>
                        <PlayerCard player={players[7]} />
                        <PlayerList players={players} />
                    </div>
                </div>
            </main>
        </div>
    );
}
