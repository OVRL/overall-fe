"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import FormationBoard, { FormationType } from "@/components/formation/FormationBoard";
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import PlayerSearchModal from "@/components/formation/PlayerSearchModal";
import AutoSquadModal from "@/components/formation/AutoSquadModal";
import TeamManagerModal from "@/components/formation/TeamManagerModal";

// ============================================================
// Types
// ============================================================
export interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    image?: string;
    season?: string;
    seasonType?: "general" | "worldBest";
    // Formation specific props
    quarterCount?: number;
    // New Props for Algorithm
    age?: number;
    attendance?: number;
}

export type TeamType = "A" | "B" | "C" | "D";

export interface QuarterData {
    id: number;
    type: "MATCHING" | "IN_HOUSE";
    formation: FormationType;
    lineup?: Record<number, Player | null>;
    teamA?: Record<number, Player | null>;
    teamB?: Record<number, Player | null>;
    teamC?: Record<number, Player | null>;
    teamD?: Record<number, Player | null>;
    matchup: { home: TeamType; away: TeamType };
}

// Initial Mock Players
const INITIAL_PLAYERS: Player[] = [
    { id: 1, name: "박무트", position: "GK", number: 26, overall: 90, image: "/images/player/img_player-1.png", season: "26" },
    { id: 2, name: "호남두호남두", position: "LB", number: 26, overall: 90, image: "/images/player/img_player-2.png", season: "26" },
    { id: 3, name: "가깝밤베스", position: "CB", number: 26, overall: 90, image: "/images/player/img_player-3.png", season: "26" },
    { id: 4, name: "다라에밤베스", position: "CB", number: 26, overall: 90, image: "/images/player/img_player-4.png", season: "3M", seasonType: "worldBest" },
    { id: 5, name: "박무트", position: "RB", number: 26, overall: 90, image: "/images/player/img_player-5.png", season: "26" },
    { id: 6, name: "렌디", position: "CDM", number: 26, overall: 90, image: "/images/player/img_player-6.png", season: "26" },
    { id: 7, name: "제스퍼", position: "CDM", number: 26, overall: 90, image: "/images/player/img_player-7.png", season: "26" },
    { id: 8, name: "알베스", position: "CAM", number: 26, overall: 99, image: "/images/player/img_player-8.png", season: "26" },
    { id: 9, name: "수원알베스", position: "ST", number: 26, overall: 90, image: "/images/player/img_player-9.png", season: "3M", seasonType: "worldBest" },
    { id: 10, name: "박무트", position: "ST", number: 26, overall: 90, image: "/images/player/img_player-10.png", season: "26" },
    { id: 11, name: "김민수", position: "ST", number: 26, overall: 90, image: "/images/player/img_player-11.png", season: "26" },
    { id: 12, name: "이준호", position: "CM", number: 10, overall: 85, season: "26" },
    { id: 13, name: "최광훈", position: "RM", number: 7, overall: 88, season: "26" },
    { id: 14, name: "정다함", position: "LM", number: 11, overall: 87, season: "26" },
    { id: 15, name: "강현우", position: "CB", number: 4, overall: 89, season: "26" }
];

export default function FormationPage() {
    // Global State
    const [mode, setMode] = useState<"MATCHING" | "IN_HOUSE">("MATCHING");
    const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
    const [playersWithCounts, setPlayersWithCounts] = useState<Player[]>(INITIAL_PLAYERS);

    // In-house Features
    const [activeTeamsCount, setActiveTeamsCount] = useState(2); // Start with A, B

    // Quarter State
    const [quarters, setQuarters] = useState<QuarterData[]>([
        { id: 1, type: "MATCHING", formation: "4-2-3-1", lineup: {}, matchup: { home: "A", away: "B" } }
    ]);
    const [currentQuarterId, setCurrentQuarterId] = useState(1);

    // Interaction State
    const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(null); // For Mobile Tap-to-Place
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchTarget, setSearchTarget] = useState<{ quarterId: number, team: "lineup" | any, posId: number } | null>(null);
    const [autoSquadModalOpen, setAutoSquadModalOpen] = useState(false);

    // ------------------------------------------------------------------
    // Effects
    // ------------------------------------------------------------------
    useEffect(() => {
        // Calculate counts based on MODE
        const getPlayerCounts = (playerId: number) => {
            let matchingCount = 0;
            let inHouseCount = 0;

            quarters.forEach(q => {
                // Matching Count
                if (q.lineup && Object.values(q.lineup).some(p => p?.id === playerId)) {
                    matchingCount++;
                }

                // In-House Count (Check all 4 teams)
                if (q.teamA && Object.values(q.teamA).some(p => p?.id === playerId)) inHouseCount++;
                if (q.teamB && Object.values(q.teamB).some(p => p?.id === playerId)) inHouseCount++;
                if (q.teamC && Object.values(q.teamC).some(p => p?.id === playerId)) inHouseCount++;
                if (q.teamD && Object.values(q.teamD).some(p => p?.id === playerId)) inHouseCount++;
            });

            return { matchingCount, inHouseCount };
        };

        setPlayersWithCounts(players.map(p => {
            const counts = getPlayerCounts(p.id);
            return {
                ...p,
                quarterCount: mode === "MATCHING" ? counts.matchingCount : counts.inHouseCount
            };
        }));
    }, [quarters, players, mode]);

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------
    const addQuarter = () => {
        if (quarters.length >= 10) return;
        const newId = quarters.length + 1;
        const prevQ = quarters[quarters.length - 1];

        setQuarters([...quarters, {
            id: newId,
            type: mode,
            formation: prevQ.formation,
            lineup: {},
            teamA: {}, teamB: {}, teamC: {}, teamD: {},
            matchup: prevQ.matchup // Keep previous matchup by default
        }]);
        setCurrentQuarterId(newId);
    };

    const updateQuarterLineup = (quarterId: number, team: string, positionId: number, player: Player | null) => {
        setQuarters(prev => prev.map(q => {
            if (q.id === quarterId) {
                // @ts-ignore
                const targetLineup = { ...(q[team] || {}) };
                if (player) {
                    const existingPos = Object.keys(targetLineup).find(key => targetLineup[parseInt(key)]?.id === player.id);
                    if (existingPos) delete targetLineup[parseInt(existingPos)];
                } else {
                    delete targetLineup[positionId];
                }
                if (player) targetLineup[positionId] = player;

                return { ...q, [team]: targetLineup };
            }
            return q;
        }));
        // Reset selection if used
        if (player) setSelectedListPlayer(null);
    };

    const handleSwap = (quarterId: number, team: string, pos1: number, pos2: number) => {
        setQuarters(prev => prev.map(q => {
            if (q.id === quarterId) {
                // @ts-ignore
                const targetLineup = { ...(q[team] || {}) };
                const p1 = targetLineup[pos1];
                const p2 = targetLineup[pos2];
                if (p1) targetLineup[pos2] = p1; else delete targetLineup[pos2];
                if (p2) targetLineup[pos1] = p2; else delete targetLineup[pos1];
                return { ...q, [team]: targetLineup };
            }
            return q;
        }));
    };

    const handleMatchupChange = (side: "home" | "away", team: TeamType) => {
        setQuarters(prev => prev.map(q => {
            if (q.id === currentQuarterId) {
                return { ...q, matchup: { ...q.matchup, [side]: team } };
            }
            return q;
        }));
    };

    const handleReset = () => {
        if (confirm("현재 쿼터를 초기화하시겠습니까?")) {
            setQuarters(prev => prev.map(q => {
                if (q.id === currentQuarterId) {
                    return { ...q, lineup: {}, teamA: {}, teamB: {}, teamC: {}, teamD: {} };
                }
                return q;
            }));
        }
    };

    const handleSave = () => {
        // In real app, API call. Here, localstorage/alert.
        const data = { mode, quarters };
        console.log("Saving...", data);
        alert("포메이션이 저장되었습니다! (콘솔 확인)");
    };

    const handleLoadMatch = () => {
        if (confirm("지난 경기 기록(예시)을 불러오시겠습니까? 현재 작업 내용은 사라집니다.")) {
            // Mock Loaded Data
            setMode("IN_HOUSE");
            setActiveTeamsCount(3); // Example: A, B, C loaded
            const mockQuarters: QuarterData[] = [
                { id: 1, type: "IN_HOUSE", formation: "4-4-2", matchup: { home: "A", away: "B" }, teamA: { 9: INITIAL_PLAYERS[8], 10: INITIAL_PLAYERS[9] }, teamB: { 1: INITIAL_PLAYERS[0] } },
                { id: 2, type: "IN_HOUSE", formation: "4-4-2", matchup: { home: "A", away: "C" }, teamA: {}, teamC: { 11: INITIAL_PLAYERS[1] } }
            ];
            setQuarters(mockQuarters);
            setCurrentQuarterId(1);
        }
    };

    // Add new team (C, D)
    const handleAddTeam = () => {
        if (activeTeamsCount >= 4) return;
        setActiveTeamsCount(prev => prev + 1);
    };

    // Remove team (C, D)
    const handleRemoveTeam = () => {
        if (activeTeamsCount <= 2) return; // Cannot remove A or B
        if (confirm(`${String.fromCharCode(65 + activeTeamsCount - 1)}팀을 삭제하시겠습니까?`)) {
            setActiveTeamsCount(prev => prev - 1);
            // Optionally clear data for that team? 
            // For now, keeping data in state is safer in case of re-add, or clear it if strict.
            // Let's keep it simple.
        }
    };

    // ------------------------------------------------------------------
    // New Handlers
    // ------------------------------------------------------------------

    const handleAddPlayer = (name: string) => {
        // Ensure strictly new unique ID
        const maxId = players.reduce((max, p) => p.id > max ? p.id : max, 0);
        const newPlayer: Player = {
            id: maxId + 1,
            name,
            position: "MF", // Default
            number: 0,
            overall: 70, // Default
            age: 20 + Math.floor(Math.random() * 10), // Random Age
            attendance: Math.floor(Math.random() * 10) // Random Attendance
        };
        // Use functional state update to guarantee latest state
        setPlayers(prev => [...prev, newPlayer]);
        setTimeout(() => alert(`${name} 선수가 추가되었습니다!`), 100);
    };

    const handleRemovePlayer = (playerId: number) => {
        // 1. Remove from Players list
        setPlayers(prev => prev.filter(p => p.id !== playerId));

        // 2. Remove from ALL Quarters Lineups
        setQuarters(prev => prev.map(q => {
            const newQ = { ...q };

            // Remove from main lineup (Matching)
            if (newQ.lineup) {
                const newLineup = { ...newQ.lineup };
                let changed = false;
                Object.entries(newLineup).forEach(([pos, p]) => {
                    if (p?.id === playerId) {
                        delete newLineup[parseInt(pos)];
                        changed = true;
                    }
                });
                if (changed) newQ.lineup = newLineup;
            }

            // Remove from Team A/B/C/D (In-House)
            ["teamA", "teamB", "teamC", "teamD"].forEach(teamKey => {
                // @ts-ignore
                if (newQ[teamKey]) {
                    // @ts-ignore
                    const teamLineup = { ...newQ[teamKey] };
                    let changed = false;
                    Object.entries(teamLineup).forEach(([pos, p]) => {
                        // @ts-ignore
                        if (p?.id === playerId) {
                            delete teamLineup[parseInt(pos)];
                            changed = true;
                        }
                    });
                    // @ts-ignore
                    if (changed) newQ[teamKey] = teamLineup;
                }
            });

            return newQ;
        }));

        // 3. Clear selection if needed
        if (selectedListPlayer?.id === playerId) setSelectedListPlayer(null);
    };

    const handleAutoSquad = (quartersCount: number, selectedFormation: FormationType, teamPools?: Record<string, Player[]>) => {
        setAutoSquadModalOpen(false);
        const newQuarters: QuarterData[] = [];

        // --- 1. Define Helper Algorithm for a Single Pool & Team Code ---
        const generateScheduleForPool = (poolPlayers: Player[], quarters: number): Record<number, Record<number, Player>> => {
            const resultSchedule: Record<number, Record<number, Player>> = {};
            for (let i = 1; i <= quarters; i++) resultSchedule[i] = {};

            const playerCount = poolPlayers.length;
            if (playerCount === 0) return resultSchedule;

            const slotsPerGame = 11;
            const totalSlots = quarters * slotsPerGame;

            // 1. Specialized Roles
            const gkSpecialists = poolPlayers.filter(p => p.position === "GK");
            const hasGK = gkSpecialists.length > 0;

            // 2. Target Quota Calculation (Fairness)
            const baseQuota = Math.floor(totalSlots / playerCount);
            const remainder = totalSlots % playerCount;

            // Sort by Priority (Attendance > Age > OVR)
            const getPriority = (p: Player) => ((p.attendance || 0) * 1000) + ((p.age || 0) * 10) + ((p.overall || 0) * 0.1);
            const sortedPool = [...poolPlayers].sort((a, b) => getPriority(b) - getPriority(a));

            const targetCounts: Record<number, number> = {};
            const currentCounts: Record<number, number> = {};
            // Track rest history: last played quarter index (0 if never)
            const lastPlayedQ: Record<number, number> = {};

            sortedPool.forEach((p, idx) => {
                targetCounts[p.id] = baseQuota + (idx < remainder ? 1 : 0);
                currentCounts[p.id] = 0;
                lastPlayedQ[p.id] = 0;
            });

            // 3. Role Helpers
            const formationsRoles: Record<string, Record<number, string>> = {
                "4-2-3-1": { 1: "GK", 2: "LB", 3: "CB", 4: "CB", 5: "RB", 6: "CDM", 7: "CDM", 8: "CAM", 9: "LW", 10: "RW", 11: "ST" },
                "4-4-2": { 1: "GK", 2: "LB", 3: "CB", 4: "CB", 5: "RB", 6: "LM", 7: "CM", 8: "CM", 9: "RM", 10: "ST", 11: "ST" },
                "4-3-3": { 1: "GK", 2: "LB", 3: "CB", 4: "CB", 5: "RB", 6: "CDM", 7: "CM", 8: "CM", 9: "LW", 10: "RW", 11: "ST" },
                "3-5-2": { 1: "GK", 2: "CB", 3: "CB", 4: "CB", 5: "LM", 6: "CDM", 7: "CDM", 8: "RM", 9: "CAM", 10: "ST", 11: "ST" }
            };
            const targetRoles = formationsRoles[selectedFormation] || formationsRoles["4-2-3-1"];

            const isRoleMatch = (playerPos: string, role: string) => {
                if (role === "GK") return playerPos === "GK";
                if (["LB", "CB", "RB", "LWB", "RWB"].includes(role)) return ["LB", "CB", "RB", "LWB", "RWB", "DF"].includes(playerPos);
                if (["CDM", "CM", "CAM", "LM", "RM"].includes(role)) return ["CDM", "CM", "CAM", "LM", "RM", "MF"].includes(playerPos);
                if (["ST", "CF", "LW", "RW"].includes(role)) return ["ST", "CF", "LW", "RW", "FW"].includes(playerPos);
                return true;
            };

            // 4. Generation Loop
            for (let q = 1; q <= quarters; q++) {
                const lineup: Record<number, Player> = {};
                const assignedIds = new Set<number>();
                const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

                // GK Handling (Slot 1)
                // If hasGK, try to assign a GK specialist.
                // If no GK, treat as rotation (assign later or prioritize checking GK roster if needed? No, user says rotate if None).
                // Actually, let's treat Slot 1 specially if hasGK.

                // We'll iterate slots. 
                // To ensure critical slots (like GK) get their constraints met first, we can process Slot 1 first.

                // Helper to get Score for a Player in a Slot
                const calculateScore = (p: Player, role: string) => {
                    // C1. Quota Check
                    const played = currentCounts[p.id];
                    const target = targetCounts[p.id];
                    const leftToPlay = target - played;
                    const quartersRemaining = quarters - q + 1;

                    if (leftToPlay <= 0) return -10000; // Quota filled (Avoid if possible)

                    let score = 0;

                    // C2. Urgency (Must Play)
                    // If slots remaining to play == quarters remaining -> Infinity Priority
                    if (leftToPlay >= quartersRemaining) {
                        score += 100000;
                    }

                    // C3. Rest Bonus (Avoid Consecutive Rests)
                    const lastQ = lastPlayedQ[p.id];
                    const restedLast = (lastQ !== q - 1); // True if rested previous (last played < q-1)
                    const restedTwo = (lastQ < q - 2 && q > 2); // True if rested 2 games? (e.g. Q3, last=0)

                    if (q > 1 && lastQ === q - 1) {
                        // Played last quarter. Slight penalty to encourage rotation? 
                        // Or neutral. Fairness (Quota) handles total count.
                        // But we want to avoid 2-rest pattern.
                        // If I just played, I'm okay to rest.
                        score -= 50;
                    } else {
                        // Rested last quarter. Boost to play now (Pong-Dang).
                        score += 500;
                        if (q > 2 && lastQ < q - 2) {
                            // Rested 2 quarters efficiently! HUGE BOOST.
                            score += 2000;
                        }
                    }

                    // C4. Position Match
                    // Strict GK constraint
                    if (role === "GK") {
                        if (hasGK) {
                            if (p.position === "GK") score += 5000; // Specialist MUST take GK
                            else score -= 10000; // Field player shouldn't be GK if GK exists
                        } else {
                            // No GK specialist: Rotate.
                            // Maybe prioritize someone who hasn't been GK?
                            // For now, treat as generic.
                        }
                    } else {
                        // Field Roles
                        if (isRoleMatch(p.position, role)) score += 200;
                        else score -= 100; // Penalty for off-position
                    }

                    // C5. Base Priority
                    score += getPriority(p) * 0.001; // Tie-breaker

                    return score;
                };

                const filledSlots = new Set<number>();

                // 4-1. Fill Fixed/Critical Slots first (GK)
                if (slots.includes(1)) {
                    // Find best candidate for GK
                    const role = "GK";
                    let candidates = sortedPool.filter(p => !assignedIds.has(p.id));

                    // Score all candidates
                    candidates = candidates.map(p => ({ p, score: calculateScore(p, role) }))
                        .sort((a, b) => b.score - a.score)
                        .map(item => item.p);

                    // Pick Top
                    if (candidates.length > 0) {
                        const best = candidates[0];
                        lineup[1] = best;
                        assignedIds.add(best.id);
                        currentCounts[best.id]++;
                        lastPlayedQ[best.id] = q;
                        filledSlots.add(1);
                    }
                }

                // 4-2. Fill Remaining Slots
                const remainingSlots = slots.filter(s => !filledSlots.has(s));

                // Greedy approach per slot? Or global optimization?
                // Greedy per slot works if we sort slots by "Difficulty"? 
                // Or just iterate.
                // Better: For each slot, find best player. BUT one player might be best for multiple.
                // Simple Matcher: Iterate Slots, pick best available player.

                remainingSlots.forEach(pos => {
                    const role = targetRoles[pos];
                    let candidates = sortedPool.filter(p => !assignedIds.has(p.id));

                    // Score
                    const scored = candidates.map(p => ({ p, score: calculateScore(p, role) }))
                        .sort((a, b) => b.score - a.score);

                    if (scored.length > 0) {
                        const best = scored[0].p;
                        lineup[pos] = best;
                        assignedIds.add(best.id);
                        currentCounts[best.id]++;
                        lastPlayedQ[best.id] = q;
                    }
                });

                resultSchedule[q] = lineup;
            }

            return resultSchedule;
        };

        // --- 2. Execute Logic Based on Mode ---
        if (mode === "IN_HOUSE" && teamPools) {
            // Generate for Team A, Team B, etc.
            const schedules: Record<string, Record<number, Record<number, Player>>> = {};

            availableTeams.forEach(team => {
                const pool = teamPools[team] || [];
                schedules[team] = generateScheduleForPool(pool, quartersCount);
            });

            // Merge into Quarters
            for (let i = 1; i <= quartersCount; i++) {
                newQuarters.push({
                    id: i,
                    type: "IN_HOUSE",
                    formation: selectedFormation,
                    // Assume default matchup A vs B for now, or keep existing logic
                    matchup: { home: "A", away: "B" },
                    teamA: schedules["A"]?.[i] || {},
                    teamB: schedules["B"]?.[i] || {},
                    teamC: schedules["C"]?.[i] || {},
                    teamD: schedules["D"]?.[i] || {}
                });
            }

        } else {
            // MATCHING Mode
            const schedule = generateScheduleForPool(players, quartersCount);
            for (let i = 1; i <= quartersCount; i++) {
                newQuarters.push({
                    id: i,
                    type: "MATCHING",
                    formation: selectedFormation,
                    lineup: schedule[i],
                    matchup: { home: "A", away: "B" } // Dummy
                });
            }
        }

        if (confirm(`${quartersCount}개 쿼터 (${selectedFormation}) 생성 완료! 적용하시겠습니까?`)) {
            // Update State
            setQuarters(newQuarters);
            setCurrentQuarterId(1);
        }
    };

    // Mobile Tap-to-Place
    const handlePlaceListPlayer = (team: string, posId: number) => {
        if (selectedListPlayer) {
            updateQuarterLineup(currentQuarterId, team, posId, selectedListPlayer);
        }
    };

    const currentQuarter = quarters.find(q => q.id === currentQuarterId) || quarters[0];

    // Available teams based on count
    const availableTeams = ["A", "B", "C", "D"].slice(0, activeTeamsCount);
    const availableTeamKeys = availableTeams.map(t => `team${t}`);

    // Helper: Check if ANY visible lineup is full
    const isLineupFull = (() => {
        if (mode === "MATCHING") {
            const count = Object.keys(currentQuarter.lineup || {}).length;
            return count >= 11;
        } else {
            let anyFull = false;
            availableTeamKeys.forEach(k => {
                // @ts-ignore
                if (Object.keys(currentQuarter[k] || {}).length >= 11) anyFull = true;
            });
            return anyFull;
        }
    })();

    // ------------------------------------------------------------------
    // Team Manager Logic
    // ------------------------------------------------------------------
    const [managingTeam, setManagingTeam] = useState<string | null>(null); // "teamA", "teamB"...

    const handleForceAssign = (quarterId: number, targetTeamKey: string, targetPos: number, player: Player) => {
        setQuarters(prev => prev.map(q => {
            if (q.id === quarterId) {
                // 1. Remove player from ANY team in this quarter
                const newQ = { ...q };

                // Helper to remove specific player ID from a lineup
                const removePlayerFromLineup = (lineup: Record<number, Player | null>) => {
                    const newLineup = { ...lineup };
                    let changed = false;
                    Object.entries(newLineup).forEach(([pos, p]) => {
                        if (p?.id === player.id) {
                            delete newLineup[parseInt(pos)];
                            changed = true;
                        }
                    });
                    return { modified: newLineup, changed };
                };

                // Check and remove from A, B, C, D
                ["teamA", "teamB", "teamC", "teamD"].forEach(tKey => {
                    // @ts-ignore
                    if (newQ[tKey]) {
                        // @ts-ignore
                        const { modified, changed } = removePlayerFromLineup(newQ[tKey]);
                        // @ts-ignore
                        if (changed) newQ[tKey] = modified;
                    }
                });

                // 2. Add to Target Team at Target Pos
                // @ts-ignore
                const targetLineup = { ...(newQ[targetTeamKey] || {}) };

                // Search for `player`'s old position first to handle Swap
                let oldTeamKey: string | null = null;
                let oldPosId: number | null = null;

                ["teamA", "teamB", "teamC", "teamD"].forEach(tKey => {
                    // @ts-ignore
                    const l = q[tKey];
                    if (l) {
                        Object.entries(l).forEach(([pos, p]) => {
                            // @ts-ignore
                            if (p?.id === player.id) {
                                oldTeamKey = tKey;
                                oldPosId = parseInt(pos);
                            }
                        });
                    }
                });

                // Now, if targetPos has an Occupant:
                const occupant = targetLineup[targetPos];

                // Execute Pull
                targetLineup[targetPos] = player;
                // @ts-ignore
                newQ[targetTeamKey] = targetLineup;

                // Move occupant to old position if it existed (Swap)
                // Note: The player was already removed from old position by removePlayerFromLineup.
                // We just need to put the occupant there.
                if (oldTeamKey && oldPosId !== null && occupant) {
                    // @ts-ignore
                    // We must fetch the lineup AGAIN from newQ because it was modified (cleaned)
                    // @ts-ignore
                    const targetOldLineup = { ...(newQ[oldTeamKey] || {}) };
                    targetOldLineup[oldPosId] = occupant;
                    // @ts-ignore
                    newQ[oldTeamKey] = targetOldLineup;
                }

                return newQ;
            }
            return q;
        }));
    };

    return (
        <div className="min-h-screen bg-surface-primary pb-32">
            <Header showTeamSelector selectedTeam="Formation Manager" />

            <div className="max-w-[75rem] mx-auto px-4">
                {/* ... Controls ... */}
                {/* ... (Keep existing Controls code) ... */}
                <div className="flex flex-col gap-4 my-6">
                    {/* ... Same Controls Row 1 ... */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 items-center">
                            <div className="bg-surface-secondary p-1 rounded-lg flex">
                                <button onClick={() => setMode("MATCHING")} className={`px-4 md:px-6 py-2 rounded-md font-bold transition-colors whitespace-nowrap text-sm md:text-base ${mode === "MATCHING" ? "bg-primary text-black" : "text-gray-400"}`}>매칭</button>
                                <button onClick={() => setMode("IN_HOUSE")} className={`px-4 md:px-6 py-2 rounded-md font-bold transition-colors whitespace-nowrap text-sm md:text-base ${mode === "IN_HOUSE" ? "bg-primary text-black" : "text-gray-400"}`}>내전</button>
                            </div>
                            <button onClick={() => setAutoSquadModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 whitespace-nowrap"><span className="text-yellow-300">★</span> 스쿼드 추천</button>
                            {mode === "IN_HOUSE" && activeTeamsCount < 4 && (
                                <button onClick={handleAddTeam} className="bg-surface-tertiary hover:bg-surface-secondary text-primary border border-primary/30 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1"><span>+ 팀</span><span className="bg-primary text-black text-[10px] px-1 rounded">{String.fromCharCode(65 + activeTeamsCount)}</span></button>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            {mode === "IN_HOUSE" && (
                                <div className="bg-surface-secondary px-3 py-2 rounded-lg border border-gray-700 flex items-center gap-2 text-sm text-gray-300 mr-2">
                                    <span className="font-bold text-white">매치업:</span>
                                    <select value={currentQuarter?.matchup.home} onChange={(e) => handleMatchupChange("home", e.target.value as TeamType)} className="bg-surface-tertiary text-white px-2 py-0.5 rounded border border-gray-600 outline-none">{availableTeams.map(t => <option key={t} value={t}>{t}팀</option>)}</select>
                                    <span>vs</span>
                                    <select value={currentQuarter?.matchup.away} onChange={(e) => handleMatchupChange("away", e.target.value as TeamType)} className="bg-surface-tertiary text-white px-2 py-0.5 rounded border border-gray-600 outline-none">{availableTeams.map(t => <option key={t} value={t}>{t}팀</option>)}</select>
                                </div>
                            )}
                            <select className="bg-surface-secondary text-white px-3 py-2 rounded-lg border border-gray-700" value={currentQuarter?.formation} onChange={e => { setQuarters(prev => prev.map(q => q.id === currentQuarterId ? { ...q, formation: e.target.value as FormationType } : q)); }}>
                                <option value="4-2-3-1">4-2-3-1</option>
                                <option value="4-4-2">4-4-2</option>
                                <option value="4-3-3">4-3-3</option>
                            </select>
                            <button onClick={handleReset} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/30 font-bold hover:bg-red-500/20 whitespace-nowrap">초기화</button>
                            {mode === "IN_HOUSE" && <button onClick={handleLoadMatch} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 font-bold hover:bg-blue-500/20 whitespace-nowrap">불러오기</button>}
                        </div>
                    </div>
                    {/* ... Same Controls Row 2 ... */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                        {quarters.map(q => (
                            <button key={q.id} onClick={() => setCurrentQuarterId(q.id)} className={`flex-shrink-0 w-12 h-12 rounded-full border-2 font-bold transition-all ${currentQuarterId === q.id ? "bg-primary border-primary text-black scale-110" : "bg-surface-secondary border-gray-700 text-gray-400"}`}>{q.id}Q</button>
                        ))}
                        {quarters.length < 10 && <button onClick={addQuarter} className="w-10 h-10 rounded-full bg-surface-tertiary border border-dashed border-gray-600 text-gray-400 hover:text-white">+</button>}
                    </div>
                </div>

                {/* 2. Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_18.75rem] gap-6">
                    {/* Formation Boards */}
                    <div className="space-y-6">
                        {mode === "MATCHING" ? (
                            <FormationBoard
                                quarterId={currentQuarterId}
                                label="매칭 라인업"
                                lineup={currentQuarter?.lineup || {}}
                                formation={currentQuarter?.formation}
                                onUpdate={(pos, p) => updateQuarterLineup(currentQuarterId, "lineup", pos, p)}
                                onSwap={(p1, p2) => handleSwap(currentQuarterId, "lineup", p1, p2)}
                                selectedListPlayer={selectedListPlayer}
                                onPlaceListPlayer={(pos) => handlePlaceListPlayer("lineup", pos)}
                                onPositionClick={(pos) => { setSearchTarget({ quarterId: currentQuarterId, team: "lineup", posId: pos }); setSearchModalOpen(true); }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableTeams.map((teamStr, index) => {
                                    const teamKey = `team${teamStr}`;
                                    // @ts-ignore
                                    const teamLineup = currentQuarter?.[teamKey] || {};
                                    const colors = { "A": "blue", "B": "red", "C": "green", "D": "purple" };
                                    const isRemovable = (index === availableTeams.length - 1) && (index >= 2);

                                    return (
                                        <FormationBoard
                                            key={teamStr}
                                            quarterId={currentQuarterId}
                                            label={`${teamStr}팀 라인업`}
                                            // @ts-ignore
                                            teamColor={colors[teamStr] || "blue"}
                                            lineup={teamLineup}
                                            formation={currentQuarter?.formation}
                                            onUpdate={(pos, p) => updateQuarterLineup(currentQuarterId, teamKey, pos, p)}
                                            onSwap={(p1, p2) => handleSwap(currentQuarterId, teamKey, p1, p2)}
                                            selectedListPlayer={selectedListPlayer}
                                            onPlaceListPlayer={(pos) => handlePlaceListPlayer(teamKey, pos)}
                                            onPositionClick={(pos) => { setSearchTarget({ quarterId: currentQuarterId, team: teamKey, posId: pos }); setSearchModalOpen(true); }}
                                            onRemove={isRemovable ? handleRemoveTeam : undefined}
                                            onExpand={() => setManagingTeam(teamKey)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Player List */}
                    <div className="lg:h-[calc(100vh-12.5rem)] lg:sticky lg:top-24">
                        <FormationPlayerList
                            players={playersWithCounts}
                            currentQuarterLineups={mode === "MATCHING" ? [currentQuarter?.lineup || {}] : availableTeamKeys.map(k => currentQuarter?.[k as keyof QuarterData] as Record<number, Player | null> || {})}
                            selectedPlayer={selectedListPlayer}
                            onSelectPlayer={setSelectedListPlayer}
                            isLineupFull={isLineupFull}
                            onAddPlayer={handleAddPlayer}
                            onRemovePlayer={handleRemovePlayer}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AutoSquadModal
                isOpen={autoSquadModalOpen}
                onClose={() => setAutoSquadModalOpen(false)}
                onConfirm={handleAutoSquad}
                players={players}
                mode={mode}
                availableTeams={availableTeams}
            />

            <PlayerSearchModal
                isOpen={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                onSelect={(p) => {
                    if (searchTarget) {
                        updateQuarterLineup(searchTarget.quarterId, searchTarget.team, searchTarget.posId, p);
                        setSearchModalOpen(false);
                    }
                }}
                players={playersWithCounts}
                playingPlayerIds={
                    mode === "MATCHING"
                        ? Object.values(currentQuarter.lineup || {}).filter(p => p).map(p => p!.id)
                        : availableTeamKeys.flatMap(k =>
                            // @ts-ignore
                            Object.values(currentQuarter[k] || {}).filter(p => p).map(p => p!.id)
                        )
                }
            />

            {/* Team Manager Modal (New) */}
            {managingTeam && (
                <TeamManagerModal
                    isOpen={!!managingTeam}
                    onClose={() => setManagingTeam(null)}
                    quarterId={currentQuarterId}
                    teamKey={managingTeam}
                    teamName={managingTeam.replace("team", "")}
                    // @ts-ignore
                    currentLineup={currentQuarter?.[managingTeam] || {}}
                    quarters={quarters}
                    allPlayers={playersWithCounts}
                    currentQuarterLineups={availableTeamKeys.map(k => currentQuarter?.[k as keyof QuarterData] as Record<number, Player | null> || {})}
                    onUpdateLineup={(qid, team, pos, p) => {
                        // Use Force Assign for advanced logic (Steal/Swap)
                        if (p) handleForceAssign(qid, team, pos, p);
                        else updateQuarterLineup(qid, team, pos, null); // Just Remove
                    }}
                    onAddPlayer={handleAddPlayer}
                    onRemovePlayer={handleRemovePlayer}
                />
            )}

            {/* Bottom Save Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-surface-secondary border-t border-gray-700 p-4 z-40">
                <div className="max-w-[75rem] mx-auto flex justify-between items-center">
                    <span className="text-gray-400 text-sm hidden md:inline">모든 변경사항은 저장 버튼을 눌러야 반영됩니다.</span>
                    <button onClick={handleSave} className="w-full md:w-auto bg-primary text-black font-bold text-lg px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-transform active:scale-95">포메이션 저장하기</button>
                </div>
            </div>
        </div>
    );
}

