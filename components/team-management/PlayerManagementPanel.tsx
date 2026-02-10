"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";

// Mock 선수 데이터
interface PlayerRecord {
    id: string;
    name: string;
    profileImage: string;
    mainPosition: Position;
    attendance: number;
    goals: number;
    assists: number;
    keyPasses: number;
    cleanSheets: number;
    wins: number;
    draws: number;
    losses: number;
    goalsPerGame: number;
    assistsPerGame: number;
    winRate: number;
    points: number;
    ovr: number;
    momTop3Count: number;
}

const mockPlayers: PlayerRecord[] = [
    { id: "1", name: "박무트", profileImage: "/images/player/img_player-1.png", mainPosition: "GK", attendance: 30, goals: 0, assists: 2, keyPasses: 5, cleanSheets: 15, wins: 20, draws: 5, losses: 5, goalsPerGame: 0, assistsPerGame: 0.07, winRate: 66.7, points: 65, ovr: 90, momTop3Count: 3 },
    { id: "2", name: "호남두", profileImage: "/images/player/img_player-2.png", mainPosition: "LB", attendance: 28, goals: 3, assists: 8, keyPasses: 25, cleanSheets: 12, wins: 18, draws: 5, losses: 5, goalsPerGame: 0.11, assistsPerGame: 0.29, winRate: 64.3, points: 59, ovr: 88, momTop3Count: 2 },
    { id: "3", name: "가깝밤베스", profileImage: "/images/player/img_player-3.png", mainPosition: "CB", attendance: 30, goals: 2, assists: 1, keyPasses: 10, cleanSheets: 14, wins: 20, draws: 5, losses: 5, goalsPerGame: 0.07, assistsPerGame: 0.03, winRate: 66.7, points: 65, ovr: 89, momTop3Count: 4 },
    { id: "4", name: "알베스", profileImage: "/images/player/img_player-8.png", mainPosition: "CAM", attendance: 30, goals: 15, assists: 20, keyPasses: 80, cleanSheets: 0, wins: 20, draws: 5, losses: 5, goalsPerGame: 0.5, assistsPerGame: 0.67, winRate: 66.7, points: 65, ovr: 99, momTop3Count: 8 },
    { id: "5", name: "수원알베스", profileImage: "/images/player/img_player-9.png", mainPosition: "ST", attendance: 28, goals: 25, assists: 10, keyPasses: 40, cleanSheets: 0, wins: 18, draws: 5, losses: 5, goalsPerGame: 0.89, assistsPerGame: 0.36, winRate: 64.3, points: 59, ovr: 95, momTop3Count: 6 },
    { id: "6", name: "메시", profileImage: "/images/ovr.png", mainPosition: "RW", attendance: 10, goals: 10, assists: 10, keyPasses: 30, cleanSheets: 0, wins: 5, draws: 2, losses: 3, goalsPerGame: 1.0, assistsPerGame: 1.0, winRate: 50.0, points: 17, ovr: 92, momTop3Count: 5 },
    { id: "7", name: "반다이크", profileImage: "/images/ovr.png", mainPosition: "CB", attendance: 20, goals: 1, assists: 1, keyPasses: 5, cleanSheets: 10, wins: 12, draws: 4, losses: 4, goalsPerGame: 0.05, assistsPerGame: 0.05, winRate: 60.0, points: 40, ovr: 87, momTop3Count: 1 },
    { id: "8", name: "빅루트", profileImage: "/images/ovr.png", mainPosition: "CM", attendance: 25, goals: 5, assists: 12, keyPasses: 45, cleanSheets: 0, wins: 15, draws: 5, losses: 5, goalsPerGame: 0.2, assistsPerGame: 0.48, winRate: 60.0, points: 50, ovr: 91, momTop3Count: 4 },
];

function calculateAutoFields(player: PlayerRecord): PlayerRecord {
    const games = player.attendance || 1;
    return {
        ...player,
        goalsPerGame: Math.round((player.goals / games) * 100) / 100,
        assistsPerGame: Math.round((player.assists / games) * 100) / 100,
        winRate: Math.round((player.wins / games) * 1000) / 10,
        points: player.wins * 3 + player.draws,
        ovr: calculateOVR(player),
    };
}

function calculateOVR(player: PlayerRecord): number {
    const gameWeight = player.attendance * 0.5;
    const goalWeight = player.goals * 3;
    const assistWeight = player.assists * 2;
    const momWeight = player.momTop3Count * 5;
    const csWeight = player.cleanSheets * 2;
    const winRate = (player.wins / Math.max(player.attendance, 1)) * 20;
    const base = 50 + gameWeight + goalWeight + assistWeight + momWeight + csWeight + winRate;
    return Math.min(99, Math.max(40, Math.round(base)));
}

// 포메이션 위치 (4-2-3-1 기반) - /home StartingXI와 동일
const FORMATION_POSITIONS: Record<string, { top: string; left: string }> = {
    GK: { top: "88%", left: "50%" },
    LB: { top: "72%", left: "12%" },
    CB: { top: "72%", left: "38%" },
    CB2: { top: "72%", left: "62%" },
    RB: { top: "72%", left: "88%" },
    CDM: { top: "52%", left: "30%" },
    CM: { top: "52%", left: "70%" },
    CAM: { top: "38%", left: "50%" },
    LW: { top: "22%", left: "15%" },
    RW: { top: "22%", left: "85%" },
    ST: { top: "12%", left: "50%" },
};

// 포지션별 대표 좌표 매핑
const getFormationPosition = (position: Position, index: number) => {
    if (position === "CB" && index > 0) return FORMATION_POSITIONS["CB2"];
    return FORMATION_POSITIONS[position] || { top: "50%", left: "50%" };
};

// 쿼터별 기록 인터페이스
interface QuarterRecord {
    attended: boolean;
    goals: number;
    assists: number;
    keyPasses: number;
    cleanSheet: boolean;
    team: "A" | "B"; // 내전 시 팀 구분
}

interface BatchEntry {
    playerId: string;
    // 현재 선택된 쿼터의 기록 (UI 표시용)
    attended: boolean;
    goals: number;
    assists: number;
    keyPasses: number;
    cleanSheet: boolean;
    team: "A" | "B";

    // 전체 쿼터 데이터 저장소
    quarters: { [key: number]: QuarterRecord };

    prevOvr?: number;
    popups?: { text: string; type: "goal" | "assist" | "ovr" | "cs"; id: number }[];
}

// 골-어시 이벤트 기록
interface GoalEvent {
    id: number;
    quarter: number; // 쿼터 정보 추가
    scorerId: string;
    assisterId?: string;
    team: "A" | "B"; // 내전 시 팀 정보
}

export default function PlayerManagementPanel() {
    const [players, setPlayers] = useState<PlayerRecord[]>(mockPlayers);
    const [editingId, setEditingId] = useState<string | null>(null);

    // 모달 상태
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [gameType, setGameType] = useState<"match" | "scrimmage">("match"); // 매칭 or 내전

    // 쿼터 관리 상태
    const [currentQuarter, setCurrentQuarter] = useState<1 | 2 | 3 | 4>(1);
    // 매칭 모드: 쿼터별 우리팀/상대팀 스코어
    const [ourScore, setOurScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [theirScore, setTheirScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    // 내전 모드: 쿼터별 팀A/팀B 스코어 (자동 계산됨)
    const [teamAScore, setTeamAScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [teamBScore, setTeamBScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });

    const [batchEntries, setBatchEntries] = useState<BatchEntry[]>([]);

    // 종료 컨펌 모달 상태
    const [showFinishModal, setShowFinishModal] = useState(false);
    // 쿼터별 완료 상태 (분석 및 적용하기 버튼을 눌러야 완료됨)
    const [quarterCompleted, setQuarterCompleted] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false });
    // 무득점 경기 알럿 상태
    const [showNilNilAlert, setShowNilNilAlert] = useState(false);
    // 저장 전 미리보기 모달 상태
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // 스마트 파서 상태
    const [smartInputText, setSmartInputText] = useState("");
    const [parseResultMsg, setParseResultMsg] = useState("");
    const [goalEvents, setGoalEvents] = useState<GoalEvent[]>([]);
    const [activeEventId, setActiveEventId] = useState<number | null>(null);

    // 팝업 ID 생성용
    const popupIdRef = useRef(0);
    const goalEventIdRef = useRef(0);

    const handleFieldChange = (playerId: string, field: keyof PlayerRecord, value: number) => {
        setPlayers(prev => prev.map(p => p.id === playerId ? calculateAutoFields({ ...p, [field]: value }) : p));
    };

    const openBatchModal = () => {
        // 초기화
        setBatchEntries(players.map(p => ({
            playerId: p.id,
            attended: true,
            goals: 0,
            assists: 0,
            keyPasses: 0,
            cleanSheet: false,
            team: "A", // 기본값 A팀
            quarters: {
                1: { attended: true, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                2: { attended: true, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                3: { attended: true, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                4: { attended: true, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" },
            },
            prevOvr: p.ovr,
            popups: [],
        })));
        setSmartInputText("");
        setParseResultMsg("");
        setCurrentQuarter(1);
        setOurScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setTheirScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setTeamAScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setTeamBScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setGoalEvents([]);
        setActiveEventId(null);
        setQuarterCompleted({ 1: false, 2: false, 3: false, 4: false });
        setShowNilNilAlert(false);
        setShowPreviewModal(false);
        setShowBatchModal(true);
    };

    // 애니메이션 팝업 추가
    const addPopup = (entry: BatchEntry, text: string, type: "goal" | "assist" | "ovr" | "cs") => {
        const id = popupIdRef.current++;
        return { ...entry, popups: [...(entry.popups || []), { text, type, id }] };
    };

    // 쿼터 데이터 업데이트 헬퍼
    const updateQuarterData = (entry: BatchEntry, quarter: number, update: Partial<QuarterRecord>) => {
        const currentData = entry.quarters[quarter];
        return {
            ...entry,
            quarters: {
                ...entry.quarters,
                [quarter]: { ...currentData, ...update }
            },
            // 현재 쿼터 UI 동기화
            ...(quarter === currentQuarter ? update : {})
        };
    };

    // 스마트 파서 로직
    const parseSmartInput = () => {
        // 입력이 비어있으면 무득점 경기 알럿 표시
        if (!smartInputText.trim()) {
            setShowNilNilAlert(true);
            return;
        }

        let updatedEntries = [...batchEntries];
        const events: GoalEvent[] = [...goalEvents];
        let logCount = 0;

        const lines = smartInputText.replace(/\r\n/g, "\n").split("\n");

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // 1. 단축 명령어 파싱 (공백으로 구분된 토큰)
            const tokens = trimmedLine.split(/[\s,]+/).filter(Boolean);
            let goalScorerId: string | null = null;
            let assisterId: string | null = null;
            let explicitGoal = false;
            let explicitAssist = false;

            // 명시적 키워드 확인 (기존 로직 호환)
            const hasGoalKeyword = /골|득점/.test(line);
            const hasAssistKeyword = /어시|도움/.test(line);

            // 토큰 순회하며 선수 찾기
            const foundPlayers: string[] = [];
            tokens.forEach(token => {
                // 정확히 일치하는 이름 찾기
                const player = players.find(p => p.name === token || p.name === token.replace(/(골|득점|어시|도움)/g, ""));
                if (player) {
                    foundPlayers.push(player.id);
                }
            });

            if (foundPlayers.length > 0) {
                // 첫 번째 선수는 무조건 골 (또는 명시적 어시만 있는 경우 제외)
                if (!hasAssistKeyword || hasGoalKeyword) {
                    goalScorerId = foundPlayers[0];
                    explicitGoal = true;
                }

                // 두 번째 선수는 어시스트 (단, 명시적 골만 있는 경우 제외하거나 선수가 2명 이상일 때)
                if (foundPlayers.length > 1) {
                    assisterId = foundPlayers[1];
                    explicitAssist = true;
                } else if (foundPlayers.length === 1 && hasAssistKeyword && !hasGoalKeyword) {
                    // "빅루트 어시" 같은 경우
                    assisterId = foundPlayers[0];
                    goalScorerId = null;
                    explicitAssist = true;
                }
            }

            // 골/어시 카운트
            const goalMatch = line.match(/(\d+)\s*(골|득점)/);
            const goalCount = goalMatch ? parseInt(goalMatch[1]) : (explicitGoal ? 1 : 0);

            // 데이터 적용
            if (goalScorerId && goalCount > 0) {
                const idx = updatedEntries.findIndex(e => e.playerId === goalScorerId);
                if (idx !== -1) {
                    const entry = updatedEntries[idx];
                    const currentQData = entry.quarters[currentQuarter];

                    updatedEntries[idx] = addPopup(
                        updateQuarterData(entry, currentQuarter, { goals: currentQData.goals + goalCount }),
                        `+${goalCount} 골 ⚽`, "goal"
                    );
                    updatedEntries[idx] = addPopup(updatedEntries[idx], "OVR ▲", "ovr");
                    logCount++;

                    // 골 이벤트 생성
                    const eventId = goalEventIdRef.current++;
                    events.push({
                        id: eventId,
                        quarter: currentQuarter,
                        scorerId: goalScorerId,
                        assisterId: undefined, // 어시스트는 아래에서 업데이트하거나 단독 골
                        team: entry.team
                    });
                }
            }

            if (assisterId && (explicitAssist || hasAssistKeyword)) {
                const idx = updatedEntries.findIndex(e => e.playerId === assisterId);
                if (idx !== -1) {
                    const entry = updatedEntries[idx];
                    const currentQData = entry.quarters[currentQuarter];

                    updatedEntries[idx] = addPopup(
                        updateQuarterData(entry, currentQuarter, { assists: currentQData.assists + 1 }),
                        `+1 어시 🅰️`, "assist"
                    );
                    updatedEntries[idx] = addPopup(updatedEntries[idx], "OVR ▲", "ovr");
                    logCount++;

                    // 방금 추가된 골 이벤트에 어시스터 연결 (같은 라인 처리)
                    if (goalScorerId) {
                        const lastEvent = events[events.length - 1];
                        if (lastEvent && lastEvent.scorerId === goalScorerId) {
                            lastEvent.assisterId = assisterId;
                        }
                    }
                }
            }
        });

        // 자동 CS 처리 로직 (쿼터별 Team A/B 고려)
        if (gameType === "scrimmage") {
            // A팀 총 득점 계산
            const teamAGoals = updatedEntries
                .filter(e => e.team === "A")
                .reduce((sum, e) => sum + e.quarters[currentQuarter].goals, 0);

            // B팀 총 득점 계산
            const teamBGoals = updatedEntries
                .filter(e => e.team === "B")
                .reduce((sum, e) => sum + e.quarters[currentQuarter].goals, 0);

            // A팀이 무득점 -> B팀 수비진 CS
            if (teamAGoals === 0) {
                updatedEntries = updatedEntries.map(entry => {
                    if (entry.team === "B") {
                        const player = players.find(p => p.id === entry.playerId);
                        if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                            if (!entry.quarters[currentQuarter].cleanSheet) {
                                return addPopup(
                                    updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                                    "Clean Sheet! 🛡️", "cs"
                                );
                            }
                        }
                    }
                    return entry;
                });
            } else {
                // A팀 득점 발생 시 -> B팀 CS 해제
                updatedEntries = updatedEntries.map(entry => {
                    if (entry.team === "B" && entry.quarters[currentQuarter].cleanSheet) {
                        return updateQuarterData(entry, currentQuarter, { cleanSheet: false });
                    }
                    return entry;
                });
            }

            // B팀이 무득점 -> A팀 수비진 CS
            if (teamBGoals === 0) {
                updatedEntries = updatedEntries.map(entry => {
                    if (entry.team === "A") {
                        const player = players.find(p => p.id === entry.playerId);
                        if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                            if (!entry.quarters[currentQuarter].cleanSheet) {
                                return addPopup(
                                    updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                                    "Clean Sheet! 🛡️", "cs"
                                );
                            }
                        }
                    }
                    return entry;
                });
            } else {
                // B팀 득점 발생 시 -> A팀 CS 해제
                updatedEntries = updatedEntries.map(entry => {
                    if (entry.team === "A" && entry.quarters[currentQuarter].cleanSheet) {
                        return updateQuarterData(entry, currentQuarter, { cleanSheet: false });
                    }
                    return entry;
                });
            }
        }
        // 매칭 모드 (기존 로직)
        else {
            if (theirScore[currentQuarter] === 0) {
                updatedEntries = updatedEntries.map(entry => {
                    const player = players.find(p => p.id === entry.playerId);
                    // 매칭 모드에서 팀 구분 없이 전체 수비진 CS (A팀 기본)
                    if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                        if (!entry.quarters[currentQuarter].cleanSheet) {
                            return addPopup(
                                updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                                "Clean Sheet! 🛡️", "cs"
                            );
                        }
                    }
                    return entry;
                });
            }
        }

        setBatchEntries(updatedEntries);
        setGoalEvents(events);

        // 내전 모드: 팀별 스코어 자동 계산 & 업데이트
        if (gameType === "scrimmage") {
            const teamAGoals = updatedEntries
                .filter(e => e.quarters[currentQuarter]?.team === "A")
                .reduce((sum, e) => sum + (e.quarters[currentQuarter]?.goals || 0), 0);
            const teamBGoals = updatedEntries
                .filter(e => e.quarters[currentQuarter]?.team === "B")
                .reduce((sum, e) => sum + (e.quarters[currentQuarter]?.goals || 0), 0);

            setTeamAScore(prev => ({ ...prev, [currentQuarter]: teamAGoals }));
            setTeamBScore(prev => ({ ...prev, [currentQuarter]: teamBGoals }));
        }

        // 쿼터 완료 처리 및 다음 쿼터로 자동 이동
        setQuarterCompleted(prev => ({ ...prev, [currentQuarter]: true }));

        if (logCount > 0) {
            setParseResultMsg(`✅ ${logCount}건의 기록이 반영되었습니다! (${currentQuarter}Q 완료)`);
        } else {
            setParseResultMsg(`✅ ${currentQuarter}Q 기록이 완료되었습니다.`);
        }
        setSmartInputText(""); // 입력창 클리어

        // 다음 쿼터로 자동 이동 (4Q 아닌 경우)
        if (currentQuarter < 4) {
            setTimeout(() => {
                setCurrentQuarter((currentQuarter + 1) as 1 | 2 | 3 | 4);
                setParseResultMsg("");
            }, 1000);
        }
    };

    // 무득점 경기 확인 후 처리
    const handleNilNilConfirm = () => {
        setShowNilNilAlert(false);

        // 수비진/골키퍼 CS 부여
        let updatedEntries = [...batchEntries];

        if (gameType === "scrimmage") {
            // 내전: 양팀 모두 무득점이므로 모든 수비진에 CS
            updatedEntries = updatedEntries.map(entry => {
                const player = players.find(p => p.id === entry.playerId);
                if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                    return addPopup(
                        updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                        "Clean Sheet! 🛡️", "cs"
                    );
                }
                return entry;
            });
            setTeamAScore(prev => ({ ...prev, [currentQuarter]: 0 }));
            setTeamBScore(prev => ({ ...prev, [currentQuarter]: 0 }));
        } else {
            // 매칭: 상대 무득점이므로 수비진 CS
            setTheirScore(prev => ({ ...prev, [currentQuarter]: 0 }));
            updatedEntries = updatedEntries.map(entry => {
                const player = players.find(p => p.id === entry.playerId);
                if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                    return addPopup(
                        updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                        "Clean Sheet! 🛡️", "cs"
                    );
                }
                return entry;
            });
        }

        setBatchEntries(updatedEntries);

        // 쿼터 완료 처리
        setQuarterCompleted(prev => ({ ...prev, [currentQuarter]: true }));
        setParseResultMsg(`✅ ${currentQuarter}Q 무득점 경기로 등록되었습니다. (수비진 CS 부여)`);

        // 다음 쿼터로 자동 이동
        if (currentQuarter < 4) {
            setTimeout(() => {
                setCurrentQuarter((currentQuarter + 1) as 1 | 2 | 3 | 4);
                setParseResultMsg("");
            }, 1000);
        }
    };

    const handleBatchSubmit = () => {
        // setShowFinishModal(true) 로 변경해야 하지만, 여기서는 최종 저장 로직을 구현
        setPlayers(prev =>
            prev.map(p => {
                const entry = batchEntries.find(e => e.playerId === p.id);
                if (!entry) return p;

                // 1~4쿼터 데이터 합산
                let totalAttended = 0;
                let totalGoals = 0;
                let totalAssists = 0;
                let totalKeyPasses = 0;
                let totalCleanSheets = 0;
                let totalWins = 0;
                let totalDraws = 0;
                let totalLosses = 0;

                Object.entries(entry.quarters).forEach(([qStr, qData]) => {
                    const q = parseInt(qStr);
                    if (qData.attended) {
                        totalAttended++;
                        totalGoals += qData.goals;
                        totalAssists += qData.assists;
                        totalKeyPasses += qData.keyPasses;
                        if (qData.cleanSheet) totalCleanSheets++;

                        // 승패 계산: 스코어 비교
                        // 내전 모드에서는 플레이어가 속한 팀의 승패를 계산
                        if (gameType === "scrimmage") {
                            const playerTeam = qData.team; // A or B
                            const teamScore = playerTeam === "A" ? teamAScore[q] : teamBScore[q];
                            const opponentScore = playerTeam === "A" ? teamBScore[q] : teamAScore[q];
                            if (teamScore > opponentScore) totalWins++;
                            else if (teamScore === opponentScore) totalDraws++;
                            else totalLosses++;
                        } else {
                            // 매칭 모드: 우리팀 vs 상대팀 스코어 비교
                            if (ourScore[q] > theirScore[q]) totalWins++;
                            else if (ourScore[q] === theirScore[q]) totalDraws++;
                            else totalLosses++;
                        }
                    }
                });

                const updated = {
                    ...p,
                    attendance: p.attendance + totalAttended,
                    goals: p.goals + totalGoals,
                    assists: p.assists + totalAssists,
                    keyPasses: p.keyPasses + totalKeyPasses,
                    cleanSheets: p.cleanSheets + totalCleanSheets,
                    wins: p.wins + totalWins,
                    draws: p.draws + totalDraws,
                    losses: p.losses + totalLosses,
                };
                return calculateAutoFields(updated);
            })
        );
        setShowFinishModal(false);
        setShowBatchModal(false);
    };

    const updateBatchEntry = (playerId: string, field: keyof QuarterRecord, value: unknown) => {
        setBatchEntries(prev => prev.map(e => {
            if (e.playerId !== playerId) return e;
            // 쿼터 데이터 업데이트
            return updateQuarterData(e, currentQuarter, { [field]: value });
        }));
    };

    // CB 인덱스 추적용
    let cbIndex = 0;

    const manualFields = ["attendance", "goals", "assists", "keyPasses", "cleanSheets", "wins", "draws", "losses"] as const;
    const autoFields = ["goalsPerGame", "assistsPerGame", "winRate", "points", "ovr", "momTop3Count"] as const;
    const fieldLabels: Record<string, string> = {
        attendance: "출석", goals: "득점", assists: "도움", keyPasses: "기점", cleanSheets: "CS",
        wins: "승", draws: "무", losses: "패", goalsPerGame: "G/M", assistsPerGame: "A/M",
        winRate: "승률%", points: "승점", ovr: "OVR", momTop3Count: "MOM",
    };

    return (
        <div className="p-4">
            {/* CSS Animation Styles */}
            <style jsx global>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    50% { transform: translateY(-25px) scale(1.2); opacity: 1; }
                    100% { transform: translateY(-50px) scale(1); opacity: 0; }
                }
                .animate-float-up { animation: floatUp 2.5s ease-out forwards; }
                @keyframes drawLine {
                    0% { stroke-dashoffset: 300; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-draw-line { animation: drawLine 0.8s ease-out forwards; }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    50% { box-shadow: 0 0 20px 5px rgba(34, 197, 94, 0.6); }
                }
                .animate-pulse-glow { animation: pulse-glow 1.5s ease-in-out infinite; }
            `}</style>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">선수 관리</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">행 클릭=편집 | 파란색=자동</span>
                    <Button variant="primary" onClick={openBatchModal} className="text-xs px-3 py-1.5">
                        ⚽ 쿼터 기록 입력
                    </Button>
                </div>
            </div>

            {/* 메인 테이블 */}
            <div className="bg-surface-tertiary rounded-lg overflow-x-auto">
                <table className="w-full min-w-[800px] text-xs">
                    <thead className="bg-surface-secondary">
                        <tr className="text-gray-400">
                            <th className="px-2 py-2 text-left sticky left-0 bg-surface-secondary">선수</th>
                            <th className="px-2 py-2">포지션</th>
                            {manualFields.map(f => <th key={f} className="px-2 py-2 text-center">{fieldLabels[f]}</th>)}
                            <th className="px-1 py-2 text-center border-l border-gray-700">│</th>
                            {autoFields.map(f => <th key={f} className="px-2 py-2 text-center text-blue-400">{fieldLabels[f]}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {players.map((player) => (
                            <tr key={player.id} className="hover:bg-white/5 cursor-pointer" onClick={() => setEditingId(player.id)}>
                                <td className="px-2 py-2 sticky left-0 bg-surface-tertiary">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700 shrink-0"><Image src={player.profileImage} alt={player.name} fill className="object-cover" /></div>
                                        <span className="text-white font-medium text-xs">{player.name}</span>
                                    </div>
                                </td>
                                <td className="px-2 py-2 text-center"><PositionChip position={player.mainPosition} variant="filled" className="text-[10px] px-1.5 py-0.5" /></td>
                                {manualFields.map(field => (
                                    <td key={field} className="px-2 py-2 text-center">
                                        {editingId === player.id ? (
                                            <input type="number" value={player[field]} onChange={(e) => handleFieldChange(player.id, field, parseInt(e.target.value) || 0)} className="w-10 bg-surface-secondary border border-gray-600 rounded px-1 py-0.5 text-center text-white text-xs" onClick={(e) => e.stopPropagation()} />
                                        ) : <span className="text-gray-300">{player[field]}</span>}
                                    </td>
                                ))}
                                <td className="px-1 py-2 text-center border-l border-gray-700 text-gray-600">│</td>
                                {autoFields.map(field => (
                                    <td key={field} className="px-2 py-2 text-center"><span className={field === "ovr" ? "text-primary font-bold" : "text-blue-400"}>{field === "winRate" ? `${player[field]}%` : player[field]}</span></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 일괄 입력 모달 */}
            {showBatchModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in p-2 sm:p-4">
                    <div className="bg-[#121212] rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-gray-800">
                        {/* 헤더 */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚽</span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">쿼터 기록 입력</h3>
                                    <p className="text-xs text-gray-500">포메이션 위 선수를 클릭해 기록을 확인하세요</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* 매칭/내전 토글 */}
                                <div className="flex bg-[#252526] rounded-lg p-0.5">
                                    <button onClick={() => setGameType("match")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${gameType === "match" ? "bg-primary text-black" : "text-gray-400 hover:text-white"}`}>
                                        매칭
                                    </button>
                                    <button onClick={() => setGameType("scrimmage")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${gameType === "scrimmage" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}>
                                        내전
                                    </button>
                                </div>
                                <Button variant="line" onClick={() => setShowBatchModal(false)} className="text-xs">닫기</Button>
                            </div>
                        </div>

                        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                            {/* 좌측: 스마트 인풋 */}
                            <div className="w-full lg:w-[320px] bg-[#1a1a1a] border-r border-gray-800 flex flex-col p-5 space-y-4 z-20 shrink-0 shadow-xl overflow-y-auto">
                                {/* 쿼터 결과 입력 */}
                                <div>
                                    <label className="text-sm font-bold text-gray-400 mb-2 flex items-center justify-between">
                                        <span>📊 쿼터 결과 ({currentQuarter}Q)</span>
                                        <div className="flex bg-[#252526] rounded-xl p-1 gap-1">
                                            {[1, 2, 3, 4].map((q) => (
                                                <button
                                                    key={q}
                                                    onClick={() => setCurrentQuarter(q as 1 | 2 | 3 | 4)}
                                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all relative ${currentQuarter === q
                                                        ? "bg-primary text-black shadow-lg"
                                                        : quarterCompleted[q]
                                                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                                            : "text-gray-500 hover:text-white hover:bg-[#333]"
                                                        }`}
                                                >
                                                    {q}Q
                                                    {quarterCompleted[q] && <span className="absolute -top-1 -right-1 text-[8px] bg-green-500 text-white rounded-full w-3 h-3 flex items-center justify-center">✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    {/* 매칭 모드: 스코어 직접 입력 */}
                                    {gameType === "match" && (
                                        <div className="bg-[#252526] p-4 rounded-xl border border-gray-700 mt-3">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] text-gray-500 mb-1">우리팀</span>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setOurScore({ ...ourScore, [currentQuarter]: Math.max(0, ourScore[currentQuarter] - 1) })} className="w-7 h-7 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm">-</button>
                                                        <span className="text-2xl font-bold text-primary w-8 text-center">{ourScore[currentQuarter]}</span>
                                                        <button onClick={() => setOurScore({ ...ourScore, [currentQuarter]: ourScore[currentQuarter] + 1 })} className="w-7 h-7 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm">+</button>
                                                    </div>
                                                </div>
                                                <span className="text-2xl font-bold text-gray-600">:</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] text-gray-500 mb-1">상대팀</span>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setTheirScore({ ...theirScore, [currentQuarter]: Math.max(0, theirScore[currentQuarter] - 1) })} className="w-7 h-7 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm">-</button>
                                                        <span className={`text-2xl font-bold w-8 text-center ${theirScore[currentQuarter] === 0 ? "text-green-500" : "text-red-400"}`}>{theirScore[currentQuarter]}</span>
                                                        <button onClick={() => setTheirScore({ ...theirScore, [currentQuarter]: theirScore[currentQuarter] + 1 })} className="w-7 h-7 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {theirScore[currentQuarter] === 0 && <p className="text-xs text-green-500 mt-3 text-center font-medium animate-pulse">✨ 무실점! 수비진 CS 자동부여</p>}
                                        </div>
                                    )}

                                    {/* 내전 모드: 자동 스코어 표시 */}
                                    {gameType === "scrimmage" && (
                                        <div className="bg-[#252526] p-4 rounded-xl border border-gray-700 mt-3">
                                            <div className="flex items-center justify-center gap-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-red-600 px-3 py-0.5 rounded-full text-[10px] font-bold text-white mb-1">Team A</div>
                                                    <span className="text-3xl font-bold text-red-400">{teamAScore[currentQuarter]}</span>
                                                </div>
                                                <span className="text-2xl font-bold text-gray-600">:</span>
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-blue-600 px-3 py-0.5 rounded-full text-[10px] font-bold text-white mb-1">Team B</div>
                                                    <span className="text-3xl font-bold text-blue-400">{teamBScore[currentQuarter]}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-3 text-center">골 기록 시 해당 팀 스코어가 자동 반영됩니다</p>
                                            {teamAScore[currentQuarter] === 0 && <p className="text-xs text-blue-400 mt-1 text-center font-medium">🛡️ Team B 수비진 CS</p>}
                                            {teamBScore[currentQuarter] === 0 && <p className="text-xs text-red-400 mt-1 text-center font-medium">🛡️ Team A 수비진 CS</p>}
                                        </div>
                                    )}
                                </div>

                                {/* 스마트 파서 */}
                                <div className="flex-1 flex flex-col min-h-0 border-t border-gray-800 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                                            📝 스마트 파서
                                        </label>
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">Auto-Parsing</span>
                                    </div>

                                    <div className="bg-[#252526] rounded-xl p-3 mb-3 border border-gray-700/50">
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            <span className="text-white font-bold block mb-1">💡 입력 가이드</span>
                                            <span className="text-yellow-500">{`{골넣은사람} {어시한사람}`}</span> → 자동 골/어시<br />
                                            <span className="text-yellow-500">{`{이름}`}</span> → 자동 골<br />
                                            <span className="text-gray-500 text-[10px] mt-1 block">⚠️ 무득점 경기는 빈 칸으로 적용하기 클릭</span>
                                        </p>
                                    </div>

                                    <textarea
                                        className="flex-1 min-h-[100px] bg-[#0f0f0f] border border-gray-700 rounded-xl p-3 text-sm text-white resize-none focus:border-primary focus:ring-1 focus:ring-primary mb-3 placeholder-gray-600 leading-relaxed font-mono"
                                        placeholder={`예시:\n알베스 빅루트\n수원알베스`}
                                        value={smartInputText}
                                        onChange={(e) => setSmartInputText(e.target.value)}
                                    />
                                    <Button onClick={parseSmartInput} variant="primary" className="py-2.5 font-bold text-sm shadow-lg shadow-primary/20 rounded-xl hover:scale-[1.02] transition-transform">
                                        ⚡ 분석 및 적용하기
                                    </Button>
                                    {parseResultMsg && <div className="mt-3 text-xs text-green-400 text-center font-medium animate-fade-in bg-green-500/10 py-2 rounded-lg border border-green-500/20">{parseResultMsg}</div>}
                                </div>
                            </div>


                            {/* 우측: 포메이션 필드 & 하단 로그 뷰 */}
                            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#121212]">
                                {/* 상단: 포메이션 필드 */}
                                <div className={`${gameType === "scrimmage" ? "h-[55%]" : "h-[55%]"} relative w-full border-b border-gray-800`}>
                                    {gameType === "scrimmage" ? (
                                        /* 내전 모드: 듀얼 필드 */
                                        <div className="flex h-full w-full">
                                            {/* Team A 필드 */}
                                            <div className="flex-1 relative border-r border-gray-700">
                                                <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                                                    <div className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                                                        Team A
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 bg-black/50 px-2 py-0.5 rounded">4-2-3-1</span>
                                                </div>
                                                <Image
                                                    src="/images/object_field.png"
                                                    alt="Soccer Field A"
                                                    fill
                                                    className="object-cover opacity-70"
                                                    priority
                                                />
                                                <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />

                                                {/* Team A 선수 배치 */}
                                                {players.filter(p => {
                                                    const entry = batchEntries.find(e => e.playerId === p.id);
                                                    const qData = entry?.quarters[currentQuarter];
                                                    return qData?.team === "A";
                                                }).map((player) => {
                                                    const entry = batchEntries.find(e => e.playerId === player.id);
                                                    const quarterData = entry?.quarters[currentQuarter] || { attended: false, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" };
                                                    const pos = player.mainPosition;
                                                    const coords = FORMATION_POSITIONS[pos] || { top: "50%", left: "50%" };
                                                    const hasGoal = quarterData.goals > 0;
                                                    const hasAssist = quarterData.assists > 0;

                                                    return (
                                                        <div
                                                            key={player.id}
                                                            className="absolute transition-all duration-300"
                                                            style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
                                                            onClick={() => entry && updateBatchEntry(player.id, "team", "B")}
                                                        >
                                                            <div className={`flex flex-col items-center cursor-pointer ${quarterData.attended ? "opacity-100" : "opacity-40"}`}>
                                                                <div className={`relative w-11 h-11 rounded-full overflow-hidden border-2 shadow-lg ${hasGoal ? "border-yellow-400 ring-2 ring-yellow-400/40" : hasAssist ? "border-blue-400 ring-2 ring-blue-400/40" : "border-white/30"}`}>
                                                                    <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                </div>
                                                                <div className="mt-1 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white font-bold shadow-sm">
                                                                    {player.name}
                                                                </div>
                                                                {(hasGoal || hasAssist) && (
                                                                    <div className="flex gap-0.5 mt-0.5">
                                                                        {hasGoal && <span className="text-[8px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold shadow-sm">⚽{quarterData.goals}</span>}
                                                                        {hasAssist && <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold shadow-sm">🅰️{quarterData.assists}</span>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Team B 필드 */}
                                            <div className="flex-1 relative">
                                                <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                                                    <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                                                        Team B
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 bg-black/50 px-2 py-0.5 rounded">4-4-2</span>
                                                </div>
                                                <Image
                                                    src="/images/object_field.png"
                                                    alt="Soccer Field B"
                                                    fill
                                                    className="object-cover opacity-70"
                                                    priority
                                                />
                                                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />

                                                {/* Team B 선수 배치 */}
                                                {players.filter(p => {
                                                    const entry = batchEntries.find(e => e.playerId === p.id);
                                                    const qData = entry?.quarters[currentQuarter];
                                                    return qData?.team === "B";
                                                }).map((player) => {
                                                    const entry = batchEntries.find(e => e.playerId === player.id);
                                                    const quarterData = entry?.quarters[currentQuarter] || { attended: false, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "B" };
                                                    const pos = player.mainPosition;
                                                    const coords = FORMATION_POSITIONS[pos] || { top: "50%", left: "50%" };
                                                    const hasGoal = quarterData.goals > 0;
                                                    const hasAssist = quarterData.assists > 0;

                                                    return (
                                                        <div
                                                            key={player.id}
                                                            className="absolute transition-all duration-300"
                                                            style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
                                                            onClick={() => entry && updateBatchEntry(player.id, "team", "A")}
                                                        >
                                                            <div className={`flex flex-col items-center cursor-pointer ${quarterData.attended ? "opacity-100" : "opacity-40"}`}>
                                                                <div className={`relative w-11 h-11 rounded-full overflow-hidden border-2 shadow-lg ${hasGoal ? "border-yellow-400 ring-2 ring-yellow-400/40" : hasAssist ? "border-blue-400 ring-2 ring-blue-400/40" : "border-white/30"}`}>
                                                                    <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                </div>
                                                                <div className="mt-1 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white font-bold shadow-sm">
                                                                    {player.name}
                                                                </div>
                                                                {(hasGoal || hasAssist) && (
                                                                    <div className="flex gap-0.5 mt-0.5">
                                                                        {hasGoal && <span className="text-[8px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold shadow-sm">⚽{quarterData.goals}</span>}
                                                                        {hasAssist && <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold shadow-sm">🅰️{quarterData.assists}</span>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* 매칭 모드: 단일 필드 */
                                        <div className="relative w-full h-full">
                                            <Image
                                                src="/images/object_field.png"
                                                alt="Soccer Field"
                                                fill
                                                className="object-cover opacity-80"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                                            {/* 선수 배치 */}
                                            {players.map((player) => {
                                                const entry = batchEntries.find(e => e.playerId === player.id);
                                                // 쿼터 데이터 가져오기 (없으면 기본값)
                                                const quarterData = entry?.quarters[currentQuarter] || { attended: false, goals: 0, assists: 0, keyPasses: 0, cleanSheet: false, team: "A" };

                                                const pos = player.mainPosition;
                                                const isCB = pos === "CB";
                                                const currentCbIndex = isCB ? cbIndex++ % 2 : 0;
                                                const coords = isCB && currentCbIndex === 1 ? FORMATION_POSITIONS["CB2"] : (FORMATION_POSITIONS[pos] || { top: "50%", left: "50%" });

                                                const isAttended = quarterData.attended;
                                                const popups = entry?.popups || []; // 팝업은 쿼터 구분 없이 전역 큐 사용 (혹은 쿼터별 분리? 여기선 전역)
                                                // 팝업 아이디가 쿼터와 관계없이 고유하므로 그대로 사용

                                                const hasGoal = quarterData.goals > 0;
                                                const hasAssist = quarterData.assists > 0;
                                                const hasCS = quarterData.cleanSheet;

                                                // 활성화된 골 이벤트에 해당하는 선수인지 확인
                                                const activeEvent = activeEventId !== null ? goalEvents.find(e => e.id === activeEventId) : null;
                                                const isScorer = activeEvent?.scorerId === player.id;
                                                const isAssister = activeEvent?.assisterId === player.id;

                                                return (
                                                    <div
                                                        key={player.id}
                                                        className="absolute transition-all duration-500"
                                                        style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
                                                    >
                                                        {/* 팝업 애니메이션들 */}
                                                        {popups.map((popup) => (
                                                            <div key={popup.id} className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 animate-float-up pointer-events-none">
                                                                <span className={`text-[10px] font-bold drop-shadow-md px-2 py-0.5 rounded-full border shadow-sm ${popup.type === "goal" ? "bg-yellow-400 text-black border-yellow-300" :
                                                                    popup.type === "assist" ? "bg-blue-500 text-white border-blue-400" :
                                                                        popup.type === "ovr" ? "bg-primary text-black border-primary" :
                                                                            "bg-green-500 text-white border-green-400"
                                                                    }`}>
                                                                    {popup.text}
                                                                </span>
                                                            </div>
                                                        ))}

                                                        {/* 선수 카드 */}
                                                        <div
                                                            className={`flex flex-col items-center group cursor-pointer transition-all duration-300 ${isAttended ? "opacity-100" : "opacity-40 grayscale blur-[1px]"} ${isScorer ? "scale-110 z-30 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" : isAssister ? "scale-105 z-20 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                entry && updateQuarterData(entry, currentQuarter, { attended: !isAttended });
                                                            }}
                                                        >
                                                            {/* 프로필 이미지 */}
                                                            <div className={`relative w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md ${hasGoal ? "border-yellow-400 ring-2 ring-yellow-400/30" : hasAssist ? "border-blue-400 ring-2 ring-blue-400/30" : hasCS ? "border-green-400 ring-2 ring-green-400/30" : "border-white/20 group-hover:border-white"
                                                                }`}>
                                                                <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                            </div>

                                                            {/* 이름 & 스탯 뱃지 */}
                                                            <div className="mt-1 flex flex-col items-center gap-0.5">
                                                                <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] md:text-[9px] text-white font-medium border border-white/5 flex items-center gap-1">
                                                                    {player.name}
                                                                </div>
                                                                {((entry?.goals || 0) > 0 || (entry?.assists || 0) > 0 || entry?.cleanSheet) && (
                                                                    <div className="flex gap-0.5 scale-90">
                                                                        {hasGoal && <span className="text-[8px] bg-yellow-500 text-black px-1 rounded-sm font-bold shadow-sm">⚽ {quarterData.goals}</span>}
                                                                        {hasAssist && <span className="text-[8px] bg-blue-500 text-white px-1 rounded-sm font-bold shadow-sm">🅰️ {quarterData.assists}</span>}
                                                                        {hasCS && <span className="text-[8px] bg-green-500 text-white px-1 rounded-sm font-bold shadow-sm">🛡️</span>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* 골-어시 화살표 애니메이션 (SVG 오버레이) */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
                                                <defs>
                                                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                                        <polygon points="0 0, 8 3, 0 6" fill="#fbbf24" />
                                                    </marker>
                                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                                                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
                                                    </linearGradient>
                                                </defs>
                                                {activeEventId !== null && (() => {
                                                    const event = goalEvents.find(e => e.id === activeEventId);
                                                    if (!event || !event.assisterId) return null;

                                                    const scorer = players.find(p => p.id === event.scorerId);
                                                    const assister = players.find(p => p.id === event.assisterId);
                                                    if (!scorer || !assister) return null;

                                                    // 선수 위치 계산 (CB 인덱스 고려)
                                                    let scorerCbIdx = 0, assisterCbIdx = 0, tempCbIdx = 0;
                                                    players.forEach(p => {
                                                        if (p.mainPosition === "CB") {
                                                            if (p.id === scorer.id) scorerCbIdx = tempCbIdx;
                                                            if (p.id === assister.id) assisterCbIdx = tempCbIdx;
                                                            tempCbIdx++;
                                                        }
                                                    });

                                                    const scorerCoords = scorer.mainPosition === "CB" && scorerCbIdx === 1 ? FORMATION_POSITIONS["CB2"] : (FORMATION_POSITIONS[scorer.mainPosition] || { top: "50%", left: "50%" });
                                                    const assisterCoords = assister.mainPosition === "CB" && assisterCbIdx === 1 ? FORMATION_POSITIONS["CB2"] : (FORMATION_POSITIONS[assister.mainPosition] || { top: "50%", left: "50%" });

                                                    return (
                                                        <line
                                                            x1={assisterCoords.left}
                                                            y1={assisterCoords.top}
                                                            x2={scorerCoords.left}
                                                            y2={scorerCoords.top}
                                                            stroke="url(#lineGradient)"
                                                            strokeWidth="3"
                                                            strokeDasharray="10,5"
                                                            strokeLinecap="round"
                                                            markerEnd="url(#arrowhead)"
                                                            className="animate-draw-line"
                                                            style={{ filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))" }}
                                                        />
                                                    );
                                                })()}
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* 탭 상태 관리 */}
                                {/* activeTab state는 컴포넌트 상단에 선언 필요. 여기서는 inline으로 처리 불가하므로 상단에 추가해야 함. 
                                        하지만 replace_file_content 범위 제한으로 쉽지 않음. 
                                        따라서 useState를 사용하는 대신, 렌더링 로직 안에서 탭 스테이트를 갖도록 전체 컴포넌트를 수정하는 게 좋겠지만,
                                        범위가 너무 넓어지므로, 일단 하단 뷰 전체를 교체하는 방식으로 진행.
                                    */}
                                <SummaryView
                                    batchEntries={batchEntries}
                                    goalEvents={goalEvents}
                                    players={players}
                                    activeEventId={activeEventId}
                                    setActiveEventId={setActiveEventId}
                                    setShowFinishModal={setShowFinishModal}
                                    handleBatchSubmit={handleBatchSubmit}
                                    showFinishModal={showFinishModal}
                                    quarterCompleted={quarterCompleted}
                                    setShowPreviewModal={setShowPreviewModal}
                                    showPreviewModal={showPreviewModal}
                                    showNilNilAlert={showNilNilAlert}
                                    setShowNilNilAlert={setShowNilNilAlert}
                                    handleNilNilConfirm={handleNilNilConfirm}
                                    currentQuarter={currentQuarter}
                                    gameType={gameType}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 하단 뷰 분리 컴포넌트
function SummaryView({
    batchEntries,
    goalEvents,
    players,
    activeEventId,
    setActiveEventId,
    setShowFinishModal,
    handleBatchSubmit,
    showFinishModal,
    quarterCompleted,
    setShowPreviewModal,
    showPreviewModal,
    showNilNilAlert,
    setShowNilNilAlert,
    handleNilNilConfirm,
    currentQuarter,
    gameType
}: {
    batchEntries: BatchEntry[],
    goalEvents: GoalEvent[],
    players: PlayerRecord[],
    activeEventId: number | null,
    setActiveEventId: (id: number | null) => void,
    setShowFinishModal: (show: boolean) => void,
    handleBatchSubmit: () => void,
    showFinishModal: boolean,
    quarterCompleted: { [key: number]: boolean },
    setShowPreviewModal: (show: boolean) => void,
    showPreviewModal: boolean,
    showNilNilAlert: boolean,
    setShowNilNilAlert: (show: boolean) => void,
    handleNilNilConfirm: () => void,
    currentQuarter: 1 | 2 | 3 | 4,
    gameType: "match" | "scrimmage"
}) {
    const [activeTab, setActiveTab] = useState<"log" | "summary">("log");

    // 합산 데이터 계산
    const summaryData = batchEntries.map(entry => {
        let totalGoals = 0;
        let totalAssists = 0;
        let totalCS = 0;

        Object.values(entry.quarters).forEach(q => {
            if (q.attended) {
                totalGoals += q.goals;
                totalAssists += q.assists;
                if (q.cleanSheet) totalCS++;
            }
        });

        return {
            ...entry,
            totalGoals,
            totalAssists,
            totalCS,
            name: players.find(p => p.id === entry.playerId)?.name || ""
        };
    }).filter(d => d.totalGoals > 0 || d.totalAssists > 0 || d.totalCS > 0)
        .sort((a, b) => (b.totalGoals * 2 + b.totalAssists) - (a.totalGoals * 2 + a.totalAssists));

    return (
        <div className="h-[45%] bg-[#1a1a1a] flex flex-col">
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab("log")}
                    className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${activeTab === "log" ? "border-b-2 border-primary text-primary bg-primary/5" : "text-gray-500 hover:text-white"}`}
                >
                    📋 실시간 매치 로그
                </button>
                <button
                    onClick={() => setActiveTab("summary")}
                    className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${activeTab === "summary" ? "border-b-2 border-primary text-primary bg-primary/5" : "text-gray-500 hover:text-white"}`}
                >
                    📊 기록 집계 (합산)
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 relative scrollbar-hide">
                {activeTab === "log" ? (
                    goalEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                            <span className="text-2xl">📝</span>
                            <p className="text-xs">기록된 이벤트가 없습니다.<br />좌측 패널에 기록을 입력해주세요.</p>
                        </div>
                    ) : (
                        goalEvents.slice().reverse().map(event => {
                            const scorer = players.find(p => p.id === event.scorerId);
                            const assister = event.assisterId ? players.find(p => p.id === event.assisterId) : null;
                            const isActive = activeEventId === event.id;

                            return (
                                <div
                                    key={event.id}
                                    onClick={() => setActiveEventId(isActive ? null : event.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isActive
                                        ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                        : "bg-[#252526] border-gray-700 hover:border-gray-500"
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center border border-gray-700 text-xs font-bold text-gray-400 shrink-0">
                                        {event.quarter}Q
                                    </div>
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-yellow-500 text-lg">⚽</span>
                                        <span className="text-white font-bold text-sm">{scorer?.name}</span>
                                        {assister ? (
                                            <>
                                                <span className="text-gray-500 text-xs mx-1">from</span>
                                                <span className="text-blue-400 text-lg">🅰️</span>
                                                <span className="text-white font-medium text-sm">{assister.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-xs ml-2">(단독 득점)</span>
                                        )}
                                    </div>
                                    {event.team && <span className={`text-[10px] px-1.5 py-0.5 rounded ${event.team === "A" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>Team {event.team}</span>}
                                </div>
                            );
                        })
                    )
                ) : (
                    <div className="space-y-1">
                        {summaryData.length === 0 ? (
                            <div className="text-center text-gray-500 py-10 text-xs">집계된 기록이 없습니다.</div>
                        ) : (
                            summaryData.map(data => (
                                <div key={data.playerId} className="flex items-center justify-between p-3 bg-[#252526] rounded-xl border border-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white w-16 truncate">{data.name}</span>
                                        <div className="flex gap-1">
                                            {data.totalGoals > 0 && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">⚽ {data.totalGoals}</span>}
                                            {data.totalAssists > 0 && <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">🅰️ {data.totalAssists}</span>}
                                            {data.totalCS > 0 && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">🛡️ {data.totalCS}</span>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">Total</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 하단 저장 버튼 */}
            <div className="p-4 border-t border-gray-800 bg-[#121212]">
                {/* 쿼터 완료 상태 표시 */}
                <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4].map((q) => (
                        <div
                            key={q}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${quarterCompleted[q]
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-gray-400"
                                }`}
                        >
                            {quarterCompleted[q] ? "✓" : `${q}Q`}
                        </div>
                    ))}
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowPreviewModal(true)}
                    disabled={!quarterCompleted[1] || !quarterCompleted[2] || !quarterCompleted[3] || !quarterCompleted[4]}
                    className={`w-full py-3 font-bold text-base rounded-xl transition-all ${quarterCompleted[1] && quarterCompleted[2] && quarterCompleted[3] && quarterCompleted[4]
                        ? "bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 border-none shadow-lg shadow-green-900/30"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600"
                        }`}
                >
                    {quarterCompleted[1] && quarterCompleted[2] && quarterCompleted[3] && quarterCompleted[4]
                        ? "✅ 쿼터 입력 종료 및 저장"
                        : `⏳ ${Object.values(quarterCompleted).filter(Boolean).length}/4 쿼터 완료`
                    }
                </Button>
            </div>

            {/* 무득점 경기 알럿 모달 */}
            {showNilNilAlert && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-6">
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm text-center border border-gray-700 shadow-2xl animate-scale-up">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ring-1 ring-yellow-500/40">⚠️</div>
                        <h3 className="text-xl font-bold text-white mb-2">무득점 경기로 등록하시겠습니까?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            골 기록 없이 {currentQuarter}쿼터를 마감합니다.<br />
                            {gameType === "scrimmage"
                                ? "양팀 모두 0:0으로 기록되며, 모든 수비진에 CS가 부여됩니다."
                                : "상대팀 실점이 0으로 기록되며, 수비진에 CS가 부여됩니다."
                            }
                        </p>
                        <div className="flex gap-3">
                            <Button variant="line" onClick={() => setShowNilNilAlert(false)} className="flex-1 py-3 rounded-xl border-gray-600 text-gray-400 hover:text-white hover:bg-white/5">
                                취소
                            </Button>
                            <Button variant="primary" onClick={handleNilNilConfirm} className="flex-1 py-3 rounded-xl font-bold bg-yellow-600 text-white hover:bg-yellow-500 shadow-lg shadow-yellow-900/20">
                                네, 무득점으로 등록
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 미리보기 모달 */}
            {showPreviewModal && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-gray-700 shadow-2xl animate-scale-up overflow-hidden">
                        <div className="p-4 border-b border-gray-800 text-center">
                            <h3 className="text-lg font-bold text-white">📊 스탯 변화 미리보기</h3>
                            <p className="text-xs text-gray-500 mt-1">저장 후 각 선수의 스탯 변화입니다</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {batchEntries.filter(entry => {
                                const totalGoals = Object.values(entry.quarters).reduce((sum, q) => sum + q.goals, 0);
                                const totalAssists = Object.values(entry.quarters).reduce((sum, q) => sum + q.assists, 0);
                                const totalCS = Object.values(entry.quarters).filter(q => q.cleanSheet).length;
                                return totalGoals > 0 || totalAssists > 0 || totalCS > 0;
                            }).map(entry => {
                                const player = players.find(p => p.id === entry.playerId);
                                if (!player) return null;

                                const totalGoals = Object.values(entry.quarters).reduce((sum, q) => sum + q.goals, 0);
                                const totalAssists = Object.values(entry.quarters).reduce((sum, q) => sum + q.assists, 0);
                                const totalCS = Object.values(entry.quarters).filter(q => q.cleanSheet).length;

                                return (
                                    <div key={entry.playerId} className="bg-[#252526] rounded-xl p-3 flex items-center gap-3 border border-gray-700">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                            <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-white text-sm">{player.name}</span>
                                            <div className="flex gap-2 mt-1">
                                                {totalGoals > 0 && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <span className="text-gray-500">골</span>
                                                        <span className="text-gray-400">{player.goals}</span>
                                                        <span className="text-green-400">→ {player.goals + totalGoals}</span>
                                                        <span className="text-green-500 font-bold">(↑{totalGoals})</span>
                                                    </div>
                                                )}
                                                {totalAssists > 0 && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <span className="text-gray-500">어시</span>
                                                        <span className="text-gray-400">{player.assists}</span>
                                                        <span className="text-blue-400">→ {player.assists + totalAssists}</span>
                                                        <span className="text-blue-500 font-bold">(↑{totalAssists})</span>
                                                    </div>
                                                )}
                                                {totalCS > 0 && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <span className="text-gray-500">CS</span>
                                                        <span className="text-gray-400">{player.cleanSheets}</span>
                                                        <span className="text-purple-400">→ {player.cleanSheets + totalCS}</span>
                                                        <span className="text-purple-500 font-bold">(↑{totalCS})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-gray-800 flex gap-3">
                            <Button variant="line" onClick={() => setShowPreviewModal(false)} className="flex-1 py-3 rounded-xl border-gray-600 text-gray-400 hover:text-white hover:bg-white/5">
                                취소
                            </Button>
                            <Button variant="primary" onClick={() => { setShowPreviewModal(false); handleBatchSubmit(); }} className="flex-1 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20">
                                ✅ 저장하기
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 종료 컨펌 모달 */}
            {showFinishModal && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-6">
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm text-center border border-gray-700 shadow-2xl animate-scale-up">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ring-1 ring-green-500/40">💾</div>
                        <h3 className="text-xl font-bold text-white mb-2">쿼터 입력을 마치겠습니까?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            1~4쿼터의 모든 기록이 합산되어<br />
                            선수 스탯에 영구적으로 반영됩니다.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="line" onClick={() => setShowFinishModal(false)} className="flex-1 py-3 rounded-xl border-gray-600 text-gray-400 hover:text-white hover:bg-white/5">
                                계속 입력
                            </Button>
                            <Button variant="primary" onClick={handleBatchSubmit} className="flex-1 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20">
                                네, 저장합니다
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
