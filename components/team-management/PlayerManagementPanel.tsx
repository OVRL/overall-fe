"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PositionChip from "@/components/PositionChip";
import FormationField from "@/components/home/StartingXI/FormationField";
import DateTimePicker from "@/components/ui/date/DateTimePicker";
import { Position } from "@/types/position";
import { Player } from "@/types/player";

// Mock 선수 데이터
interface PlayerRecord {
    id: string;
    backNumber: number; // 등번호 추가
    name: string;
    profileImage: string;
    mainPosition: Position;
    attendance: number;
    matchCount?: number; // 경기 수 (자동 계산)
    attendanceRate?: number; // 참여율 (자동 계산)
    goals: number;
    assists: number;
    ownGoals: number;
    keyPasses: number;
    cleanSheets: number;
    wins: number;
    draws: number;
    losses: number;
    goalsPerGame: number;
    assistsPerGame: number;
    totalAttackPoints?: number; // 공격 포인트 (자동 계산)
    winRate: number;
    points: number;
    rating?: number; // 평점 (자동 계산)
    ovr: number;
    momTop3Count: number;
}

const mockPlayers: PlayerRecord[] = [
    { id: "1", backNumber: 1, name: "박무트", profileImage: "/images/player/img_player-1.png", mainPosition: "GK", attendance: 30, goals: 0, assists: 2, ownGoals: 0, keyPasses: 5, cleanSheets: 15, wins: 20, draws: 5, losses: 5, goalsPerGame: 0, assistsPerGame: 0.07, winRate: 66.7, points: 65, ovr: 90, momTop3Count: 3 },
    { id: "2", backNumber: 7, name: "호남두", profileImage: "/images/player/img_player-2.png", mainPosition: "LB", attendance: 28, goals: 3, assists: 8, ownGoals: 0, keyPasses: 25, cleanSheets: 12, wins: 18, draws: 5, losses: 5, goalsPerGame: 0.11, assistsPerGame: 0.29, winRate: 64.3, points: 59, ovr: 88, momTop3Count: 2 },
    { id: "3", backNumber: 4, name: "가깝밤베스", profileImage: "/images/player/img_player-3.png", mainPosition: "CB", attendance: 30, goals: 2, assists: 1, ownGoals: 1, keyPasses: 10, cleanSheets: 14, wins: 20, draws: 5, losses: 5, goalsPerGame: 0.07, assistsPerGame: 0.03, winRate: 66.7, points: 65, ovr: 89, momTop3Count: 4 },
    { id: "4", backNumber: 10, name: "알베스", profileImage: "/images/player/img_player-8.png", mainPosition: "CAM", attendance: 30, goals: 15, assists: 20, ownGoals: 0, keyPasses: 80, cleanSheets: 0, wins: 20, draws: 5, losses: 5, goalsPerGame: 0.5, assistsPerGame: 0.67, winRate: 66.7, points: 65, ovr: 99, momTop3Count: 8 },
    { id: "5", backNumber: 9, name: "수원알베스", profileImage: "/images/player/img_player-9.png", mainPosition: "ST", attendance: 28, goals: 25, assists: 10, ownGoals: 0, keyPasses: 40, cleanSheets: 0, wins: 18, draws: 5, losses: 5, goalsPerGame: 0.89, assistsPerGame: 0.36, winRate: 64.3, points: 59, ovr: 95, momTop3Count: 6 },
    { id: "6", backNumber: 30, name: "메시", profileImage: "/images/ovr.png", mainPosition: "RW", attendance: 10, goals: 10, assists: 10, ownGoals: 0, keyPasses: 30, cleanSheets: 0, wins: 5, draws: 2, losses: 3, goalsPerGame: 1.0, assistsPerGame: 1.0, winRate: 50.0, points: 17, ovr: 92, momTop3Count: 5 },
    { id: "7", backNumber: 4, name: "반다이크", profileImage: "/images/ovr.png", mainPosition: "CB", attendance: 20, goals: 1, assists: 1, ownGoals: 0, keyPasses: 5, cleanSheets: 10, wins: 12, draws: 4, losses: 4, goalsPerGame: 0.05, assistsPerGame: 0.05, winRate: 60.0, points: 40, ovr: 87, momTop3Count: 1 },
    { id: "8", backNumber: 8, name: "빅루트", profileImage: "/images/ovr.png", mainPosition: "CM", attendance: 25, goals: 5, assists: 12, ownGoals: 0, keyPasses: 45, cleanSheets: 0, wins: 15, draws: 5, losses: 5, goalsPerGame: 0.2, assistsPerGame: 0.48, winRate: 60.0, points: 50, ovr: 91, momTop3Count: 4 },
];

function calculateAutoFields(player: PlayerRecord): PlayerRecord {
    const games = player.attendance || 1;
    const totalMatchCount = 50; // Mock Total Match Count for rate calculation
    return {
        ...player,
        matchCount: games,
        attendanceRate: Math.round((games / totalMatchCount) * 100),
        goalsPerGame: Math.round((player.goals / games) * 100) / 100,
        assistsPerGame: Math.round((player.assists / games) * 100) / 100,
        totalAttackPoints: player.goals + player.assists,
        winRate: Math.round((player.wins / games) * 1000) / 10,
        points: player.wins * 3 + player.draws,
        rating: Math.round((player.ovr / 10) * 10) / 10, // Mock Rating based on OVR
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
    const ownGoalPenalty = player.ownGoals * 5; // 자책골 페널티
    const base = 50 + gameWeight + goalWeight + assistWeight + momWeight + csWeight + winRate - ownGoalPenalty;
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
    ownGoals: number; // 자책골 추가
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
    ownGoals: number; // 자책골 추가
    keyPasses: number;
    cleanSheet: boolean;
    team: "A" | "B";

    // 전체 쿼터 데이터 저장소
    quarters: { [key: number]: QuarterRecord };

    prevOvr?: number;
    popups?: { text: string; type: "goal" | "assist" | "ovr" | "cs" | "og"; id: number }[];
}

// 골-어시 이벤트 기록
interface GoalEvent {
    id: number;
    quarter: number;
    scorerId: string | null;
    assisterId: string | null;
    team?: "A" | "B";
    isOpponentOwnGoal?: boolean;
}

export default function PlayerManagementPanel() {
    const [players, setPlayers] = useState<PlayerRecord[]>(mockPlayers.map(p => calculateAutoFields(p)));
    const [editingId, setEditingId] = useState<string | null>(null);

    // 모달 상태
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [pickerType, setPickerType] = useState<"date" | "time" | null>(null);

    const [gameType, setGameType] = useState<"match" | "scrimmage">("match"); // 매칭 or 내전

    const handleScheduleConfirm = (date: string) => {
        setSelectedDate(date);
        setPickerType(null);
    };

    const confirmScheduleAndOpenBatch = () => {
        if (!selectedDate) {
            alert("경기 일정을 선택해주세요.");
            return;
        }
        setShowScheduleModal(false);
        openBatchModal();
    };

    // 쿼터 관리 상태
    const [currentQuarter, setCurrentQuarter] = useState<1 | 2 | 3 | 4>(1);
    // 매칭 모드: 쿼터별 우리팀/상대팀 스코어
    // 매칭 모드: 쿼터별 우리팀/상대팀 스코어
    const [ourScore, setOurScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    // 매칭 모드: 상대팀 스코어 (쿼터별 저장)
    const [theirScore, setTheirScore] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    // 매칭 모드: 우리팀 득점 이벤트 (카드 리스트) - 쿼터별 관리
    const [matchGoalEvents, setMatchGoalEvents] = useState<Record<number, GoalEvent[]>>({ 1: [], 2: [], 3: [], 4: [] });

    // 골 입력 마법사 상태 (UX 개선)
    const [wizardStep, setWizardStep] = useState<"idle" | "scorer" | "assister">("idle");
    const [currentGoal, setCurrentGoal] = useState<{ scorerId: string | null; assisterId: string | null; isOpponentOwnGoal: boolean } | null>(null);
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
    // 쿼터 종료 확인 모달 상태
    const [showQuarterFinishModal, setShowQuarterFinishModal] = useState(false);

    // 스마트 파서 상태
    const [smartInputText, setSmartInputText] = useState("");
    const [parseResultMsg, setParseResultMsg] = useState("");
    const [goalEvents, setGoalEvents] = useState<GoalEvent[]>([]);
    const [activeEventId, setActiveEventId] = useState<number | null>(null);

    // Feature 1: Stat Editing & Timestamp
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const [originalPlayers, setOriginalPlayers] = useState<PlayerRecord[]>(mockPlayers); // To track diffs
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Feature: Search
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false); // Mobile toggle or general toggle

    // Feature: Save Confirmation Modal
    const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
    const [showToast, setShowToast] = useState(false); // Success Toast State

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

    const confirmDeletePlayer = () => {
        if (deletingPlayerId) {
            setPlayers(prev => prev.filter(p => p.id !== deletingPlayerId));
            setDeletingPlayerId(null);
        }
    };

    const sortedPlayers = [...players]
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;

            // Handle specific field types if needed, but for now generic sort
            const valA = a[key as keyof PlayerRecord];
            const valB = b[key as keyof PlayerRecord];

            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const handleFieldChange = (playerId: string, field: keyof PlayerRecord, value: number) => {
        setPlayers(prev => {
            const updated = prev.map(p => p.id === playerId ? calculateAutoFields({ ...p, [field]: value }) : p);
            setHasUnsavedChanges(true); // Mark as modified
            return updated;
        });
    };

    const saveStatChanges = () => {
        const now = new Date();
        const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setLastEdited(timeString);
        setOriginalPlayers(players); // Commit changes
        setHasUnsavedChanges(false);
        setEditingId(null);
    };

    const getStatDiff = (playerId: string, field: keyof PlayerRecord, currentValue: number) => {
        const original = originalPlayers.find(p => p.id === playerId);
        if (!original) return null;
        const diff = currentValue - (original[field] as number);
        if (diff > 0) return <span className="text-[10px] text-green-400 font-bold ml-1">(+{diff})</span>;
        if (diff < 0) return <span className="text-[10px] text-red-400 font-bold ml-1">({diff})</span>;
        return null;
    };
    useEffect(() => {
        if (gameType === "scrimmage") {
            const currentQuarterEvents = matchGoalEvents[currentQuarter] || [];
            let aScore = 0;
            let bScore = 0;

            currentQuarterEvents.forEach(event => {
                if (event.isOpponentOwnGoal) {
                    // 상대 자책골 로직: 
                    // Scrimmage에서는 "상대 자책골" 개념이 좀 모호함. 
                    // 보통 "자책골"은 넣은 사람의 반대 팀 스코어가 올라감.
                    // 여기서는 Wizard에서 "Team A 자책골" -> Team B 득점 처리 등을 해야 함.
                    // 단순화를 위해, Wizard에서 입력된 `team` (득점 팀) 정보를 신뢰.
                    if (event.team === "A") aScore++;
                    else if (event.team === "B") bScore++;
                } else {
                    // 득점자의 팀 확인
                    const scorer = batchEntries.find(e => e.playerId === event.scorerId);
                    const scorerTeam = scorer?.quarters[currentQuarter]?.team || "A";
                    if (scorerTeam === "A") aScore++;
                    else bScore++;
                }
            });

            setTeamAScore(prev => ({ ...prev, [currentQuarter]: aScore }));
            setTeamBScore(prev => ({ ...prev, [currentQuarter]: bScore }));
        }
    }, [matchGoalEvents, currentQuarter, gameType, batchEntries]);

    // [New] Sync matchGoalEvents -> batchEntries (Auto-Calculate Goals/Assists from Log)
    // This ensures consistency between the Match Log and the Stats Summary, handling Wizard adds and deletions automatically.
    useEffect(() => {
        setBatchEntries(prevEntries => {
            let hasChanges = false;
            const updatedEntries = prevEntries.map(entry => {
                const playerId = entry.playerId;
                const currentQData = entry.quarters[currentQuarter];
                if (!currentQData) return entry; // Should not happen

                // Calculate stats from events
                const events = matchGoalEvents[currentQuarter] || [];
                const calculatedGoals = events.filter(e => e.scorerId === playerId && !e.isOpponentOwnGoal).length;
                const calculatedAssists = events.filter(e => e.assisterId === playerId).length;

                // Sync if different
                // Note: This enforces "Log is Truth". Manual edits to Goals/Assists in the current quarter will be overwritten by the Log.
                if (currentQData.goals !== calculatedGoals || currentQData.assists !== calculatedAssists) {
                    hasChanges = true;
                    return {
                        ...entry,
                        quarters: {
                            ...entry.quarters,
                            [currentQuarter]: {
                                ...currentQData,
                                goals: calculatedGoals,
                                assists: calculatedAssists
                            }
                        }
                    };
                }
                return entry;
            });

            return hasChanges ? updatedEntries : prevEntries;
        });
    }, [matchGoalEvents, currentQuarter]);

    // 팝업 ID 생성용
    const popupIdRef = useRef(0);
    const goalEventIdRef = useRef(0);



    const openBatchModal = () => {
        // 초기화
        setBatchEntries(players.map(p => ({
            playerId: p.id,
            attended: true,
            goals: 0,
            assists: 0,
            ownGoals: 0,
            keyPasses: 0,
            cleanSheet: false,
            team: "A", // 기본값 A팀
            quarters: {
                1: { attended: true, goals: 0, assists: 0, ownGoals: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                2: { attended: true, goals: 0, assists: 0, ownGoals: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                3: { attended: true, goals: 0, assists: 0, ownGoals: 0, keyPasses: 0, cleanSheet: false, team: "A" },
                4: { attended: true, goals: 0, assists: 0, ownGoals: 0, keyPasses: 0, cleanSheet: false, team: "A" },
            },
            prevOvr: p.ovr,
            popups: [],
        })));
        setSmartInputText("");
        setMatchGoalEvents({ 1: [], 2: [], 3: [], 4: [] });
        setTheirScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setOurScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setTeamAScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setTeamBScore({ 1: 0, 2: 0, 3: 0, 4: 0 });
        setGoalEvents([]);
        setActiveEventId(null);
        setQuarterCompleted({ 1: false, 2: false, 3: false, 4: false });
        setShowNilNilAlert(false);
        setShowPreviewModal(false);
        setShowBatchModal(true);
        setCurrentQuarter(1);
    };
    // 애니메이션 팝업 추가
    const addPopup = (entry: BatchEntry, text: string, type: "goal" | "assist" | "ovr" | "cs" | "og") => {
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
                        assisterId: null, // 어시스트는 아래에서 업데이트하거나 단독 골
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

            updatedEntries = updatedEntries.map(entry => {
                // B팀 수비진 CS (A팀 무득점 시)
                if (entry.team === "B") {
                    const player = players.find(p => p.id === entry.playerId);
                    if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                        const isCleanSheet = teamAGoals === 0;
                        if (isCleanSheet && !entry.quarters[currentQuarter].cleanSheet) {
                            return addPopup(
                                updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                                "Clean Sheet! 🛡️", "cs"
                            );
                        } else if (!isCleanSheet && entry.quarters[currentQuarter].cleanSheet) {
                            return updateQuarterData(entry, currentQuarter, { cleanSheet: false });
                        }
                    }
                }
                // A팀 수비진 CS (B팀 무득점 시)
                if (entry.team === "A") {
                    const player = players.find(p => p.id === entry.playerId);
                    if (player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                        const isCleanSheet = teamBGoals === 0;
                        if (isCleanSheet && !entry.quarters[currentQuarter].cleanSheet) {
                            return addPopup(
                                updateQuarterData(entry, currentQuarter, { cleanSheet: true }),
                                "Clean Sheet! 🛡️", "cs"
                            );
                        } else if (!isCleanSheet && entry.quarters[currentQuarter].cleanSheet) {
                            return updateQuarterData(entry, currentQuarter, { cleanSheet: false });
                        }
                    }
                }
                return entry;
            });
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

        // [CRITICAL FIX] 매치 로그(matchGoalEvents) 업데이트
        // events 배열은 위에서 goalEvents(deprecated?) 복사본으로 시작햇으나,
        // 여기서는 새로 생성된 이벤트만 필터링하거나, 위 로직에서 events 변수에 추가된 내역을 사용해야 함.
        // 하지만 위 로직의 events는 goalEvents(전체?)를 복사한거라 꼬일 수 있음.
        // 간단히: 위 로직에서 events.push 할 때 newEventsForQuarter 별도 배열에도 담았어야 함.
        // 현재 코드 구조상 events 변수에 '새로 추가된' 것만 있는게 아니라 '기존 것 + 새 것' 일 수 있음 (line 373).
        // Line 373: const events: GoalEvent[] = [...goalEvents]; -> goalEvents가 state라면 기존꺼 포함.
        // 하지만 matchGoalEvents는 쿼터별 객체임.
        // safe way: 위 로직에서 events.push 된 것들 중 '새로 생성된 것'을 찾아내거나,
        // 위 로직을 수정하지 않고 events 배열의 '마지막 N개'가 새거라고 가정하기엔 위험.

        // 따라서, 아래 reduce 로직으로 새로 추가된 이벤트를 추출하는 것은 불가능하므로,
        // events 배열에서 현재 쿼터에 해당하는 것들을 추려내서 덮어쓰기 하는 방식이 안전함.
        // 단, 기존 matchGoalEvents[currentQuarter]와 병합되지 않고 'events' 변수가 누적된 상태라면?
        // 기존 parseSmartInput 로직 시작 부분 line 373에서 goalEvents를 가져옴.
        // 하지만 matchGoalEvents와 goalEvents가 분리되어 있다면 sync issue.

        // 해결책: events 변수에 담긴 내용 중 '현재 쿼터'에 해당하는 것들을 matchGoalEvents[currentQuarter]로 설정.
        // 단, 기존에 matchGoalEvents에 있던게 events에 없을 수도 있음 (삭제된 경우).
        // 위 로직은 '추가'만 하고 있음.

        // 가장 확실한 방법: events 변수에 있는 모든 이벤트 중 현재 쿼터인 것들을 setMatchGoalEvents로 저장.
        const newEventsOnly = events.slice(events.length - logCount); // 새로 추가된 것들

        if (newEventsOnly.length > 0) {
            setMatchGoalEvents(prev => ({
                ...prev,
                [currentQuarter]: [...(prev[currentQuarter] || []), ...newEventsOnly]
            }));

            // 점수 업데이트
            if (gameType === "match") {
                setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + newEventsOnly.length }));
            } else {
                newEventsOnly.forEach(e => {
                    const team = e.team; // 위 loop에서 team 할당 확인 필요 (line 447)
                    if (team === "A") setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                    else setTeamBScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                });
            }
        }

        // * 변경: 쿼터 자동/완료 처리를 하지 않고, 단순히 결과 메시지만 띄움
        if (logCount > 0) {
            setParseResultMsg(`✅ ${logCount}건의 기록이 매치 로그에 추가되었습니다.`);
        } else {
            setParseResultMsg(`✅ 분석된 기록이 없습니다.`);
        }
        setSmartInputText("");

        // 자동 이동 로직 제거
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
            setOurScore(prev => ({ ...prev, [currentQuarter]: 0 }));
            setMatchGoalEvents(prev => ({ ...prev, [currentQuarter]: [] }));

            updatedEntries = updatedEntries.map(entry => {
                const player = players.find(p => p.id === entry.playerId);
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

        setBatchEntries(updatedEntries);

        // 쿼터 완료 처리
        setQuarterCompleted(prev => ({ ...prev, [currentQuarter]: true }));
        setParseResultMsg(`✅ ${currentQuarter}Q 무득점 경기로 등록되었습니다. (수비진 CS 부여)`);

        // 다음 쿼터로 자동 이동
        if (currentQuarter < 4) {
            setTimeout(() => {
                setCurrentQuarter((prev) => (prev + 1) as 1 | 2 | 3 | 4);
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
                let totalOwnGoals = 0;
                let totalKeyPasses = 0;
                let totalCleanSheets = 0;
                let totalWins = 0;
                let totalDraws = 0;
                let totalLosses = 0;

                // First, ensure all quarter data for the current player is up-to-date based on UI states
                const updatedQuarters = { ...entry.quarters };

                if (gameType === "match") {
                    // For EACH quarter, update the quarter data from matchGoalEvents and theirScore
                    ([1, 2, 3, 4] as const).forEach(q => {
                        const qEvents = matchGoalEvents[q] || [];
                        const qOpponentScore = theirScore[q] || 0;

                        if (updatedQuarters[q].attended) {
                            const qGoals = qEvents.filter(e => e.scorerId === p.id && !e.isOpponentOwnGoal).length;
                            const qAssists = qEvents.filter(e => e.assisterId === p.id).length;
                            const qCleanSheet = qOpponentScore === 0;

                            updatedQuarters[q] = {
                                ...updatedQuarters[q],
                                goals: qGoals,
                                assists: qAssists,
                                cleanSheet: qCleanSheet,
                                ownGoals: 0,
                            };
                        }
                    });
                }

                Object.entries(updatedQuarters).forEach(([qStr, qData]) => {
                    const q = parseInt(qStr);

                    let finalQData = { ...qData };

                    if (finalQData.attended) {
                        totalAttended++;
                        totalGoals += finalQData.goals;
                        totalAssists += finalQData.assists;
                        totalOwnGoals += finalQData.ownGoals;
                        totalKeyPasses += finalQData.keyPasses;
                        if (finalQData.cleanSheet) totalCleanSheets++;

                        // 승패 계산
                        if (gameType === "scrimmage") {
                            const playerTeam = finalQData.team; // A or B
                            const teamScore = teamAScore[q];
                            const opponentScoreInternal = teamBScore[q];
                            if (playerTeam === "A") {
                                if (teamScore > opponentScoreInternal) totalWins++;
                                else if (teamScore === opponentScoreInternal) totalDraws++;
                                else totalLosses++;
                            } else { // Player is in Team B
                                if (opponentScoreInternal > teamScore) totalWins++;
                                else if (opponentScoreInternal === teamScore) totalDraws++;
                                else totalLosses++;
                            }
                        } else {
                            // 매칭 모드
                            const qOurScore = matchGoalEvents[q]?.length || 0;
                            const qTheirScore = theirScore[q] || 0;

                            if (qOurScore > qTheirScore) totalWins++;
                            else if (qOurScore === qTheirScore) totalDraws++;
                            else totalLosses++;
                        }
                    }
                });

                // Attendance: +1 if participated in ANY quarter
                const hasAttendedAnyQuarter = Object.values(updatedQuarters).some(q => q.attended);
                const matchAttendance = hasAttendedAnyQuarter ? 1 : 0;

                const updated = {
                    ...p,
                    attendance: p.attendance + matchAttendance, // Integrated Attendance Count
                    goals: p.goals + totalGoals,
                    assists: p.assists + totalAssists,
                    ownGoals: p.ownGoals + totalOwnGoals,
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
        setShowPreviewModal(false); // Also close the preview modal

        // Trigger Success Toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
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

    const manualFields = ["attendance", "goals", "assists", "ownGoals", "keyPasses", "cleanSheets", "wins", "draws", "losses"] as const;
    const autoFields = ["goalsPerGame", "assistsPerGame", "totalAttackPoints", "winRate", "points", "ovr", "momTop3Count"] as const;
    const fieldLabels: Record<string, string> = {
        attendance: "출석", goals: "득점", assists: "도움", ownGoals: "자책", keyPasses: "기점", cleanSheets: "CS",
        wins: "승", draws: "무", losses: "패",
        goalsPerGame: "G/M", assistsPerGame: "A/M", totalAttackPoints: "공P (G+A)",
        winRate: "승률%", points: "승점", rating: "평점", ovr: "OVR", momTop3Count: "MOM",
    };

    const getDisplayEvents = (): GoalEvent[] => {
        if (gameType === "match") {
            return Object.entries(matchGoalEvents).flatMap(([qStr, events]) =>
                events.map(e => ({
                    id: e.id,
                    quarter: parseInt(qStr),
                    scorerId: e.isOpponentOwnGoal ? "OG" : (e.scorerId || ""),
                    assisterId: e.assisterId || null,
                    team: "A" as const,
                    isOpponentOwnGoal: e.isOpponentOwnGoal
                }))
            );
        }
        return goalEvents;
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
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">선수 관리</h3>

                    {/* Search Button */}
                    <div className="relative flex items-center">
                        <div className={`flex items-center transition-all bg-[#252526] rounded-full overflow-hidden border border-gray-700 ${showSearch ? "w-32 md:w-48 pl-2" : "w-8 h-8 justify-center border-transparent"}`}>
                            {showSearch && (
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="선수 검색"
                                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                                    autoFocus
                                />
                            )}
                            <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm(""); }} className={`text-gray-400 hover:text-white ${showSearch ? "pr-2" : ""}`}>
                                🔍
                            </button>
                        </div>
                    </div>

                    <Button variant="primary" onClick={() => {
                        const today = new Date();
                        setSelectedDate(today.toISOString().split('T')[0]);
                        setShowScheduleModal(true);
                    }} className="text-xs px-3 py-1.5 hidden md:block ml-2">
                        ⚽ 경기 기록 입력
                    </Button>
                    <Button variant="primary" onClick={() => {
                        const today = new Date();
                        setSelectedDate(today.toISOString().split('T')[0]);
                        setShowScheduleModal(true);
                    }} className="text-xs px-3 py-1.5 md:hidden ml-2">
                        ⚽ 기록
                    </Button>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-400">행 클릭=편집 | 파란색=자동</span>
                    {lastEdited && <span className="text-[10px] text-gray-500">마지막 편집: {lastEdited}</span>}
                </div>
            </div>

            {/* 테이블 (PC) */}
            <div className="overflow-x-auto rounded-lg bg-surface-tertiary hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-surface-secondary">
                        <tr>
                            <th className="px-3 py-3 text-center">등번호</th>
                            <th className="px-3 py-3">이름</th>
                            <th className="px-2 py-3 text-center">포지션</th>
                            {manualFields.map(field => (
                                <th key={field} className="px-2 py-3 text-center cursor-pointer hover:text-white" onClick={() => handleSort(field)}>
                                    {fieldLabels[field]}
                                    {sortConfig?.key === field && (
                                        <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                            ))}
                            <th className="px-1 py-3 text-center border-l border-gray-700 text-gray-600">│</th>
                            {autoFields.map(field => (
                                <th key={field} className="px-2 py-3 text-center text-gray-500 cursor-pointer hover:text-white" onClick={() => handleSort(field)}>
                                    {fieldLabels[field]}
                                    {sortConfig?.key === field && (
                                        <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                            ))}
                            <th className="px-3 py-3 text-center">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player) => (
                            <tr
                                key={player.id}
                                onClick={() => setEditingId(player.id)}
                                className={`border-b border-gray-800 hover:bg-white/5 cursor-pointer transition-colors ${editingId === player.id ? "bg-white/10" : ""}`}
                            >
                                <td className="px-3 py-2 text-center font-bold text-gray-500">{player.backNumber}</td>
                                <td className="px-3 py-2 font-bold flex items-center gap-2">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700">
                                        <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                    </div>
                                    <span className="text-white text-left">{player.name}</span>
                                </td>
                                <td className="px-2 py-2 text-center"><PositionChip position={player.mainPosition} variant="filled" className="text-[10px] px-1.5 py-0.5" /></td>
                                {
                                    manualFields.map(field => (
                                        <td key={field} className="px-2 py-2 text-center">
                                            {editingId === player.id ? (
                                                <div className="flex items-center justify-center">
                                                    <input type="number" value={player[field]} onChange={(e) => handleFieldChange(player.id, field, parseInt(e.target.value) || 0)} className="w-10 bg-surface-secondary border border-gray-600 rounded px-1 py-0.5 text-center text-white text-xs" onClick={(e) => e.stopPropagation()} />
                                                    {getStatDiff(player.id, field, player[field] as number)}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <span className={`${(player[field] as number) > (originalPlayers.find(p => p.id === player.id)?.[field] as number) ? "text-green-400 font-bold" : "text-gray-300"}`}>{player[field]}</span>
                                                    {getStatDiff(player.id, field, player[field] as number)}
                                                </div>
                                            )}
                                        </td>
                                    ))
                                }
                                <td className="px-1 py-2 text-center border-l border-gray-700 text-gray-600" >│</td>
                                {autoFields.map(field => (
                                    <td key={field} className="px-2 py-2 text-center text-gray-400 font-medium">
                                        {field === "winRate" ? `${player[field]}%` : player[field]}
                                    </td>
                                ))}
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setDeletingPlayerId(player.id); }}
                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 모바일 카드 뷰 (Mobile) */}
            <div className="md:hidden space-y-3">
                {
                    sortedPlayers.map((player) => (
                        <div
                            key={player.id}
                            onClick={() => setEditingId(editingId === player.id ? null : player.id)}
                            className={`bg-surface-tertiary/50 backdrop-blur-md rounded-2xl p-5 border transition-all shadow-lg ${editingId === player.id ? "border-primary/50 bg-surface-secondary shadow-primary/10" : "border-white/5 hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 ring-2 ring-white/10 shadow-lg">
                                        <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-black text-lg">{player.name}</span>
                                            <span className="text-xs text-gray-500 font-mono bg-black/20 px-1.5 py-0.5 rounded">#{player.backNumber}</span>
                                        </div>
                                        <PositionChip position={player.mainPosition} variant="filled" className="text-[10px] px-2 py-0.5" />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeletingPlayerId(player.id); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 주요 스탯 그리드 */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {/* 공격 포인트 (강조) */}
                                <div className="col-span-2 bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">공격포인트</span>
                                    <span className="text-2xl font-black text-white">{player.goals + player.assists}</span>
                                    <div className="flex gap-2 mt-1 text-[10px] text-gray-400">
                                        <span>⚽ {player.goals}</span>
                                        <span>🅰️ {player.assists}</span>
                                    </div>
                                </div>
                                {/* OVR */}
                                <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">OVR</span>
                                    <span className="text-2xl font-black text-white">{player.ovr}</span>
                                </div>
                            </div>

                            {/* 상세 스탯 (Expandable or Grid) */}
                            {editingId === player.id && (
                                <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
                                    {manualFields.map(field => (
                                        <div key={field} className="bg-black/20 rounded-lg p-2 flex flex-col items-center">
                                            <span className="text-[10px] text-gray-500 mb-1">{fieldLabels[field]}</span>
                                            <input
                                                type="number"
                                                value={player[field]}
                                                onChange={(e) => handleFieldChange(player.id, field, parseInt(e.target.value) || 0)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-transparent text-center text-white text-sm font-bold focus:outline-none border-b border-gray-700 focus:border-primary pb-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer Stats */}
                            <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2 px-1 pt-2 border-t border-white/5">
                                <span>🏆 승률 <span className="text-white font-bold">{player.winRate}%</span></span>
                                <span>🌟 MOM <span className="text-white font-bold">{player.momTop3Count}회</span></span>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* 일정 선택 모달 */}
            {
                showScheduleModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 animate-fade-in backdrop-blur-sm">
                        <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-sm p-6 border border-gray-700 shadow-2xl animate-scale-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">📅 경기 일정 선택</h3>
                                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-white">✕</button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 mb-2 block">경기 날짜</label>
                                    <div
                                        onClick={() => setPickerType("date")}
                                        className="w-full bg-[#252526] rounded-xl hover:bg-[#2a2a2a] transition-colors h-14 flex items-center justify-center border border-gray-600 cursor-pointer active:scale-[0.98]"
                                    >
                                        <span className="text-white font-bold text-lg">
                                            {selectedDate || "날짜 선택"}
                                        </span>
                                    </div>
                                </div>

                                <Button onClick={confirmScheduleAndOpenBatch} variant="primary" className="w-full py-4 font-bold text-lg rounded-xl shadow-lg shadow-primary/20">
                                    확인
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                pickerType && (
                    <DateTimePicker
                        type="date"
                        initialValue={selectedDate}
                        markedDates={["2026-02-01", "2026-02-04", "2026-02-07"]} // Mock Data (추후 API 연동 필요)
                        onClose={() => setPickerType(null)}
                        onConfirm={handleScheduleConfirm}
                    />
                )
            }

            {/* 일괄 입력 모달 */}
            {
                showBatchModal && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in p-2 sm:p-4">
                        <div className="bg-[#121212] rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-gray-800">
                            {/* 헤더 */}
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚽</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">경기 기록 입력 <span className="text-primary ml-2">{currentQuarter}Q</span> {gameType === "match" ? (
                                            <span className="text-sm font-normal text-gray-400 ml-2">
                                                (Total: <span className="text-white font-bold">{Object.values(matchGoalEvents).flat().length}</span> - <span className="text-white font-bold">{Object.values(theirScore).reduce((a, b) => a + b, 0)}</span>)
                                            </span>
                                        ) : (
                                            <span className="text-sm font-normal text-gray-400 ml-2">
                                                (Total: <span className="text-red-400 font-bold">{Object.values(teamAScore).reduce((a, b) => a + b, 0)}</span> - <span className="text-blue-400 font-bold">{Object.values(teamBScore).reduce((a, b) => a + b, 0)}</span>)
                                            </span>
                                        )}</h3>
                                        <p className="text-xs text-gray-500">
                                            {selectedDate} · 기록 중인 선수를 클릭해 확인하세요
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* 경기 타입 선택 */}
                                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-2">
                                        <button
                                            onClick={() => setGameType("match")}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${gameType === "match" ? "bg-primary text-black shadow-md" : "text-gray-400 hover:text-white"}`}
                                        >
                                            🌍 매칭 (외부)
                                        </button>
                                        <button
                                            onClick={() => setGameType("scrimmage")}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${gameType === "scrimmage" ? "bg-primary text-black shadow-md" : "text-gray-400 hover:text-white"}`}
                                        >
                                            🆚 내전 (자체)
                                        </button>
                                    </div>

                                    {/* 매칭 모드 UI */}
                                    {/* 매칭 모드 UI (Goal Wizard) */}
                                    <button
                                        onClick={() => setShowBatchModal(false)}
                                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>


                            <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                                {/* 좌측: 컨트롤 패널 (스코어 & 기록 입력) - PC에서 스크롤 개선 */}
                                <div className="w-full lg:w-[320px] lg:flex-none md:flex-1 bg-[#1a1a1a] border-r border-gray-800 flex flex-col z-20 shrink-0 shadow-xl overflow-hidden flex-1">
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                                        {/* 쿼터 결과 입력 */}
                                        <div>
                                            <label className="text-sm font-bold text-gray-400 mb-2 flex items-center justify-between">
                                                <span>📊 {currentQuarter}쿼터 득점 결과</span>
                                            </label>

                                            {/* 통합된 골 입력 Wizard & 스코어 보드 */}
                                            <div className="space-y-4 mb-4">
                                                {/* 점수판 (매칭/내전 공통) */}
                                                {gameType === "match" ? (
                                                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 space-y-4">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-gray-400 text-[10px] items-center flex gap-1 font-bold uppercase tracking-wider">
                                                                <span className="text-red-500"> Gegner</span> 상대팀 실점 (득점)
                                                            </span>
                                                            <div className="flex items-center gap-6">
                                                                <button
                                                                    onClick={() => setTheirScore(prev => ({ ...prev, [currentQuarter]: Math.max(0, (prev[currentQuarter] || 0) - 1) }))}
                                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white text-xl active:scale-95 transition-transform border border-gray-700 hover:bg-gray-700"
                                                                >
                                                                    -
                                                                </button>
                                                                <div className="flex flex-col items-center">
                                                                    <span className="text-4xl font-bold text-white tabular-nums drop-shadow-lg">{theirScore[currentQuarter] || 0}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setTheirScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }))}
                                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-xl active:scale-95 transition-transform border border-gray-600 hover:bg-gray-600"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <div className={`text-[11px] font-bold px-3 py-1 rounded-full ${theirScore[currentQuarter] === 0 ? "text-green-400 bg-green-400/10 border border-green-500/20" : "text-red-400 bg-red-400/10 border border-red-500/20"}`}>
                                                                {theirScore[currentQuarter] === 0 ? "✨ CLEAN SHEET" : `😱 ${theirScore[currentQuarter]}실점`}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                setWizardStep("scorer");
                                                                setCurrentGoal({ scorerId: null, assisterId: null, isOpponentOwnGoal: false });
                                                            }}
                                                            className="w-full py-3.5 bg-primary text-black font-extrabold rounded-xl text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                        >
                                                            <span>⚽ 골 기록하기</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex flex-col items-center flex-1">
                                                                <span className="text-red-500 font-bold text-sm mb-1">Team A</span>
                                                                <span className="text-3xl font-bold text-white tabular-nums">{teamAScore[currentQuarter]}</span>
                                                            </div>
                                                            <span className="text-gray-600 font-bold text-xl px-4">:</span>
                                                            <div className="flex flex-col items-center flex-1">
                                                                <span className="text-blue-500 font-bold text-sm mb-1">Team B</span>
                                                                <span className="text-3xl font-bold text-white tabular-nums">{teamBScore[currentQuarter]}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setWizardStep("scorer");
                                                                setCurrentGoal({ scorerId: null, assisterId: null, isOpponentOwnGoal: false });
                                                            }}
                                                            className="w-full py-3 bg-primary text-black font-bold rounded-xl text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                        >
                                                            <span>⚽ 골 기록하기</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Wizard UI */}
                                                {wizardStep === "idle" && (
                                                    <div className="space-y-4 animate-fade-in flex flex-col flex-1 min-h-0">
                                                        {/* 득점 리스트 (간략 보기) */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-end px-1">
                                                                <span className="text-gray-400 text-xs">우리팀 득점 ({(matchGoalEvents[currentQuarter] || []).length}골)</span>
                                                            </div>
                                                            <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                                                {(matchGoalEvents[currentQuarter] || []).map((event, idx) => {
                                                                    const scorer = players.find(p => p.id === event.scorerId);
                                                                    const assister = players.find(p => p.id === event.assisterId);
                                                                    const scorerEntry = batchEntries.find(e => e.playerId === event.scorerId);
                                                                    return (
                                                                        <div key={event.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-yellow-500 font-bold text-sm">#{idx + 1}</span>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-white font-bold text-sm">
                                                                                        {event.isOpponentOwnGoal ? "상대 자책골" : scorer?.name}
                                                                                        {gameType === "scrimmage" && !event.isOpponentOwnGoal && (
                                                                                            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${scorerEntry?.quarters[currentQuarter]?.team === "A" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                                                                                                {scorerEntry?.quarters[currentQuarter]?.team}
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                    {!event.isOpponentOwnGoal && assister && (
                                                                                        <span className="text-xs text-gray-500">도움: {assister.name}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setMatchGoalEvents(prev => ({
                                                                                        ...prev,
                                                                                        [event.quarter]: prev[event.quarter].filter(e => e.id !== event.id)
                                                                                    }));
                                                                                    // 점수 차감 로직
                                                                                    if (gameType === "match") {
                                                                                        setOurScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                                                                    } else {
                                                                                        const team = event.team;
                                                                                        if (team === "A") setTeamAScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                                                                        else setTeamBScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                                                                    }
                                                                                }}
                                                                                className="text-gray-600 hover:text-red-500 p-2"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {(matchGoalEvents[currentQuarter] || []).length === 0 && (
                                                                    <div className="text-center py-4 text-gray-600 text-xs">
                                                                        아직 득점 기록이 없습니다.
                                                                    </div>
                                                                )}

                                                                {/* Clean Sheet List in Left Panel */}
                                                                {/* Clean Sheet List in Left Panel */}
                                                                {((gameType === "match" && theirScore[currentQuarter] === 0) || (gameType === "scrimmage")) && (
                                                                    <div className="mt-2 space-y-2">
                                                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                                                            🛡️ Clean Sheet (무실점)
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {batchEntries.filter(e => e.quarters[currentQuarter]?.cleanSheet).map(e => {
                                                                                const p = players.find(player => player.id === e.playerId);
                                                                                if (!p) return null;
                                                                                return (
                                                                                    <span key={p.id} className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                                                                                        <span>{p.name}</span>
                                                                                        {p.mainPosition.includes("GK") && <span>🧤</span>}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                            {batchEntries.filter(e => e.quarters[currentQuarter]?.cleanSheet).length === 0 && (
                                                                                <span className="text-[10px] text-gray-600">대상자 없음 (경기 종료 시 부여됨)</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Mobile Bottom Action Bar (Next Quarter / Finish) - Static Inline after Inputs */}
                                                        <div className="lg:hidden w-full mt-4 p-4 bg-[#1a1a1a] border-t border-gray-800 rounded-xl flex gap-2 shadow-lg">
                                                            {currentQuarter > 1 && (
                                                                <button
                                                                    onClick={() => setCurrentQuarter(prev => (prev - 1) as 1 | 2 | 3 | 4)}
                                                                    className="px-4 py-3 font-bold text-sm rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center justify-center"
                                                                >
                                                                    ⬅️
                                                                </button>
                                                            )}
                                                            {currentQuarter < 4 ? (
                                                                <button
                                                                    onClick={() => setShowQuarterFinishModal(true)}
                                                                    className="flex-1 py-3 font-bold text-sm rounded-xl bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <span>{currentQuarter}Q 종료 및 다음 쿼터 시작</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setShowQuarterFinishModal(true)}
                                                                    className="flex-1 py-3 font-bold text-sm rounded-xl bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/10 transition-all"
                                                                >
                                                                    💾 경기 종료 및 리포트 확인
                                                                </button>
                                                            )}
                                                        </div>



                                                        {/* 출석 체크 대신 스마트 파서 위치 (PC) */}
                                                        {/* 출석 체크 대신 스마트 파서 위치 (PC) - Terminal Style */}
                                                        <div className="hidden md:flex flex-col h-[320px] shrink-0 border-t border-gray-800 bg-[#0c0c0c] relative z-10 w-full mt-4 rounded-xl overflow-hidden font-mono shadow-inner border border-gray-800/50">
                                                            {/* Terminal Header */}
                                                            <div className="bg-[#1a1a1a] px-3 py-1.5 flex items-center justify-between border-b border-gray-800">
                                                                <div className="flex gap-1.5">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                                                </div>
                                                                <span className="text-[10px] text-gray-500 font-bold tracking-widest">SMART PARSER v1.0</span>
                                                            </div>

                                                            {/* Chat Area */}
                                                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 relative font-mono text-xs">
                                                                <div className="text-gray-500 text-[10px] mb-2 border-b border-gray-800 pb-2">
                                                                    Last Login: {new Date().toLocaleString()} on ttys001
                                                                </div>

                                                                {/* System Welcome Message */}
                                                                <div className="flex flex-col gap-1 fade-in">
                                                                    <span className="text-green-500 font-bold">$ system_init</span>
                                                                    <div className="text-gray-300 leading-relaxed pl-2 border-l-2 border-green-500/30">
                                                                        Smart Parser initialized.<br />
                                                                        Enter match details below.<br />
                                                                        Example: <span className="text-yellow-400">"박무트 골 호남두 어시"</span> (Press Enter)
                                                                    </div>
                                                                </div>

                                                                {/* User Input Log & Result */}
                                                                {parseResultMsg && (
                                                                    <div className="flex flex-col gap-1 animate-fade-in">
                                                                        <span className="text-blue-400 font-bold">$ parser_result</span>
                                                                        <div className="text-gray-300 leading-relaxed pl-2 border-l-2 border-blue-500/30">
                                                                            {parseResultMsg}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Input Area */}
                                                            <div className="bg-[#0c0c0c] p-3 border-t border-gray-800 flex gap-2 items-center">
                                                                <span className="text-green-500 font-bold animate-pulse">{">"}</span>
                                                                <input
                                                                    type="text"
                                                                    value={smartInputText}
                                                                    onChange={(e) => setSmartInputText(e.target.value)}
                                                                    placeholder="Type command..."
                                                                    className="flex-1 bg-transparent text-sm text-white focus:outline-none font-mono placeholder-gray-700"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            parseSmartInput();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Wizard Step: Scorer Selection */}
                                                {wizardStep === "scorer" && (
                                                    <div className="space-y-4 animate-fade-in flex flex-col flex-1 min-h-0">
                                                        <div className="flex items-center justify-between shrink-0">
                                                            <h3 className="text-white font-bold">⚽ 득점자를 선택해주세요</h3>
                                                            <Button variant="line" onClick={() => setWizardStep("idle")} className="text-xs px-2 py-1">취소</Button>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto p-1 min-h-0 custom-scrollbar">
                                                            {/* 자책골 옵션 */}
                                                            <button
                                                                onClick={() => {
                                                                    setCurrentGoal({ scorerId: "OG", assisterId: null, isOpponentOwnGoal: true });
                                                                    // 상대 자책골은 어시스트 없음 -> 바로 등록
                                                                    const newEvent: GoalEvent = {
                                                                        id: Date.now(),
                                                                        quarter: currentQuarter,
                                                                        scorerId: "OG",
                                                                        assisterId: null,
                                                                        isOpponentOwnGoal: true,
                                                                        team: "A" // 기본값
                                                                    };
                                                                    setMatchGoalEvents(prev => ({
                                                                        ...prev,
                                                                        [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                    }));
                                                                    // 점수 업데이트
                                                                    if (gameType === "match") {
                                                                        setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    } else {
                                                                        setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    }
                                                                    setWizardStep("idle");
                                                                }}
                                                                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#252526] border border-gray-700 hover:border-red-500 hover:bg-red-500/10 transition-all shrink-0"
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl mb-1">😱</div>
                                                                <span className="text-xs text-white font-bold text-center">상대 자책골</span>
                                                            </button>

                                                            {players.map(player => (
                                                                <button
                                                                    key={player.id}
                                                                    onClick={() => {
                                                                        setCurrentGoal(prev => ({ ...prev, scorerId: player.id, isOpponentOwnGoal: false, assisterId: null }));
                                                                        setWizardStep("assister");
                                                                    }}
                                                                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#252526] border border-gray-700 hover:border-primary hover:bg-primary/10 transition-all shrink-0"
                                                                >
                                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 mb-1">
                                                                        <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                    </div>
                                                                    <span className="text-xs text-white font-bold text-center truncate w-full">{player.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Wizard Step: Assister Selection */}
                                                {wizardStep === "assister" && currentGoal?.scorerId && (
                                                    <div className="space-y-4 animate-fade-in flex flex-col flex-1 min-h-0">
                                                        <div className="flex items-center justify-between shrink-0">
                                                            <h3 className="text-white font-bold">
                                                                🅰️ {players.find(p => p.id === currentGoal.scorerId)?.name} 골의 도움 선택
                                                            </h3>
                                                            <Button variant="line" onClick={() => setWizardStep("scorer")} className="text-xs px-2 py-1">뒤로</Button>
                                                        </div>
                                                        <div className="p-3 bg-surface-tertiary rounded-xl flex items-center gap-3 mb-2 border border-gray-700 shrink-0">
                                                            <span className="text-gray-400 text-xs">득점자:</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700">
                                                                    <Image
                                                                        src={players.find(p => p.id === currentGoal.scorerId)?.profileImage || ""}
                                                                        alt="scorer"
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <span className="text-white font-bold text-sm">
                                                                    {players.find(p => p.id === currentGoal.scorerId)?.name}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                // 어시스트 없음 -> 등록
                                                                const newEvent: GoalEvent = {
                                                                    id: Date.now(),
                                                                    quarter: currentQuarter,
                                                                    scorerId: currentGoal.scorerId!,
                                                                    assisterId: null,
                                                                    isOpponentOwnGoal: false,
                                                                    team: "A"
                                                                };
                                                                if (gameType === "scrimmage") {
                                                                    const scorerEntry = batchEntries.find(e => e.playerId === currentGoal.scorerId);
                                                                    newEvent.team = (scorerEntry?.quarters[currentQuarter]?.team || "A") as "A" | "B";
                                                                }
                                                                setMatchGoalEvents(prev => ({
                                                                    ...prev,
                                                                    [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                }));
                                                                // 점수 업데이트
                                                                if (gameType === "match") {
                                                                    setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                } else {
                                                                    const team = newEvent.team;
                                                                    if (team === "A") setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    else setTeamBScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                }
                                                                setWizardStep("idle");
                                                            }}
                                                            className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors mb-2"
                                                        >
                                                            없음 (단독 득점)
                                                        </button>

                                                        <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto p-1 min-h-0 custom-scrollbar">
                                                            {players.filter(p => p.id !== currentGoal.scorerId).map(player => (
                                                                <button
                                                                    key={player.id}
                                                                    onClick={() => {
                                                                        // 어시스트 등록
                                                                        const newEvent: GoalEvent = {
                                                                            id: Date.now(),
                                                                            quarter: currentQuarter,
                                                                            scorerId: currentGoal.scorerId!,
                                                                            assisterId: player.id,
                                                                            isOpponentOwnGoal: false,
                                                                            team: "A"
                                                                        };

                                                                        if (gameType === "scrimmage") {
                                                                            const scorerEntry = batchEntries.find(e => e.playerId === currentGoal.scorerId);
                                                                            newEvent.team = (scorerEntry?.quarters[currentQuarter]?.team || "A") as "A" | "B";
                                                                        }

                                                                        setMatchGoalEvents(prev => ({
                                                                            ...prev,
                                                                            [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                        }));
                                                                        // 점수 업데이트
                                                                        if (gameType === "match") {
                                                                            setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                        } else {
                                                                            const team = newEvent.team;
                                                                            if (team === "A") setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                            else setTeamBScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                        }
                                                                        setWizardStep("idle");
                                                                    }}
                                                                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#252526] border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all shink-0"
                                                                >
                                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 mb-1">
                                                                        <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                    </div>
                                                                    <span className="text-xs text-white font-bold text-center truncate w-full">{player.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Mobile Wizard (Full Screen Overlay) */}
                                            <div className={`
                                            md:hidden fixed inset-0 z-60 bg-[#121212] flex flex-col
                                            transition-all duration-300 transform
                                            ${wizardStep !== "idle" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
                                        `}>
                                                <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#1a1a1a] shrink-0">
                                                    <span className="text-lg font-bold text-white">
                                                        {wizardStep === "scorer"
                                                            ? "⚽ 득점자 선택"
                                                            : `👟 ${players.find(p => p.id === currentGoal?.scorerId)?.name} 골의 도움 선택`
                                                        }
                                                    </span>
                                                    <button onClick={() => setWizardStep("idle")} className="p-2 text-gray-400">✕</button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                                    {wizardStep === "scorer" && (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {players.map(player => (
                                                                <button
                                                                    key={player.id}
                                                                    onClick={() => {
                                                                        setCurrentGoal(prev => ({
                                                                            scorerId: player.id,
                                                                            assisterId: prev?.assisterId ?? null,
                                                                            isOpponentOwnGoal: prev?.isOpponentOwnGoal ?? false
                                                                        }));
                                                                        setWizardStep("assister");
                                                                    }}
                                                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#252526] border border-gray-700 aspect-square"
                                                                >
                                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 mb-2">
                                                                        <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                    </div>
                                                                    <span className="text-sm text-white font-bold text-center w-full truncate">{player.name}</span>
                                                                </button>
                                                            ))}
                                                            <button
                                                                onClick={() => {
                                                                    const newEvent: GoalEvent = {
                                                                        id: Date.now(),
                                                                        quarter: currentQuarter,
                                                                        scorerId: "OG",
                                                                        assisterId: null,
                                                                        isOpponentOwnGoal: true,
                                                                        team: "A"
                                                                    };
                                                                    if (gameType === "match") {
                                                                        setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    } else {
                                                                        setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    }
                                                                    setMatchGoalEvents(prev => ({
                                                                        ...prev,
                                                                        [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                    }));
                                                                    setWizardStep("idle");
                                                                }}
                                                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-900/20 border border-red-500/50 aspect-square"
                                                            >
                                                                <span className="text-2xl mb-1">🥅</span>
                                                                <span className="text-sm text-red-400 font-bold">상대 자책골</span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {wizardStep === "assister" && currentGoal && (
                                                        <div className="flex flex-col gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    const newEvent: GoalEvent = {
                                                                        id: Date.now(),
                                                                        quarter: currentQuarter,
                                                                        scorerId: currentGoal.scorerId!,
                                                                        assisterId: null,
                                                                        isOpponentOwnGoal: false,
                                                                        team: "A"
                                                                    };
                                                                    if (gameType === "scrimmage") {
                                                                        const scorerEntry = batchEntries.find(e => e.playerId === currentGoal.scorerId);
                                                                        newEvent.team = (scorerEntry?.quarters[currentQuarter]?.team || "A") as "A" | "B";
                                                                    }
                                                                    setMatchGoalEvents(prev => ({
                                                                        ...prev,
                                                                        [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                    }));
                                                                    if (gameType === "match") {
                                                                        setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    } else {
                                                                        const team = newEvent.team;
                                                                        if (team === "A") setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                        else setTeamBScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                    }
                                                                    setWizardStep("idle");
                                                                }}
                                                                className="w-full py-4 bg-gray-700 text-white font-bold rounded-xl text-lg mb-2"
                                                            >
                                                                없음 (단독 득점)
                                                            </button>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {players.filter(p => p.id !== currentGoal.scorerId).map(player => (
                                                                    <button
                                                                        key={player.id}
                                                                        onClick={() => {
                                                                            const newEvent: GoalEvent = {
                                                                                id: Date.now(),
                                                                                quarter: currentQuarter,
                                                                                scorerId: currentGoal.scorerId!,
                                                                                assisterId: player.id,
                                                                                isOpponentOwnGoal: false,
                                                                                team: "A"
                                                                            };
                                                                            if (gameType === "scrimmage") {
                                                                                const scorerEntry = batchEntries.find(e => e.playerId === currentGoal.scorerId);
                                                                                newEvent.team = (scorerEntry?.quarters[currentQuarter]?.team || "A") as "A" | "B";
                                                                            }
                                                                            setMatchGoalEvents(prev => ({
                                                                                ...prev,
                                                                                [currentQuarter]: [...prev[currentQuarter], newEvent]
                                                                            }));
                                                                            if (gameType === "match") {
                                                                                setOurScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                            } else {
                                                                                const team = newEvent.team;
                                                                                if (team === "A") setTeamAScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                                else setTeamBScore(prev => ({ ...prev, [currentQuarter]: (prev[currentQuarter] || 0) + 1 }));
                                                                            }
                                                                            setWizardStep("idle");
                                                                        }}
                                                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#252526] border border-gray-700 aspect-square"
                                                                    >
                                                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 mb-2">
                                                                            <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                                        </div>
                                                                        <span className="text-sm text-white font-bold text-center w-full truncate">{player.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mobile Messenger UI - REMOVED per user request */}
                                                <div className="hidden"></div>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                {/* 우측: 필드 뷰 & 통합 로그 뷰 */}
                                <div className="hidden lg:flex flex-1 flex-col h-full overflow-hidden bg-[#121212] relative">
                                    {/* PC View: Field (Top 40%) + Summary (Bottom 60%) */}
                                    <div className="hidden lg:block h-[40%] bg-[#1A1A1A] p-4 border-b border-gray-800 relative">
                                        <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/10">
                                            🏟️ {currentQuarter}Q 포메이션
                                        </div>
                                        {/* Formation View (Larger & Centered) */}
                                        <div className="w-full h-full flex flex-col justify-center items-center bg-[#1a1a1a] rounded-xl overflow-hidden shadow-inner border border-white/5 relative">
                                            <div className="absolute inset-0 p-4">
                                                <FormationField
                                                    players={players
                                                        .filter(p => {
                                                            const entry = batchEntries.find(e => e.playerId === p.id);
                                                            return entry?.quarters[currentQuarter]?.attended;
                                                        })
                                                        .map(p => ({
                                                            ...p,
                                                            id: parseInt(p.id) || 0,
                                                            position: p.mainPosition,
                                                            image: p.profileImage,
                                                            season: "26", // Mock Data
                                                            seasonType: "general",
                                                            number: 0,
                                                            overall: p.ovr,
                                                            shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0, pace: 0
                                                        }))}
                                                    handleDragStart={() => { }}
                                                    handleDrop={() => { }}
                                                    handleDragOver={() => { }}
                                                    onPlayerSelect={(player) => {
                                                        setWizardStep("scorer");
                                                        setCurrentGoal(prev => ({ scorerId: player.id.toString(), assisterId: null, isOpponentOwnGoal: false }));
                                                        setWizardStep("assister");
                                                    }}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary View (Bottom 55% -> Expanded) */}
                                    <div className="flex-1 overflow-hidden flex flex-col relative">
                                        <div className="absolute inset-0 flex flex-col"> {/* Removed overflow-y-auto and pb-20 */}
                                            <SummaryView
                                                batchEntries={batchEntries}
                                                goalEvents={getDisplayEvents()}
                                                players={players}
                                                activeEventId={activeEventId}
                                                setActiveEventId={setActiveEventId}
                                                quarterCompleted={quarterCompleted}
                                                setQuarterCompleted={setQuarterCompleted}
                                                currentQuarter={currentQuarter}
                                                setCurrentQuarter={setCurrentQuarter}
                                                setShowFinishModal={setShowFinishModal}
                                                handleBatchSubmit={handleBatchSubmit}
                                                showFinishModal={showFinishModal}
                                                setShowPreviewModal={setShowPreviewModal}
                                                showPreviewModal={showPreviewModal}
                                                showNilNilAlert={showNilNilAlert}
                                                setShowNilNilAlert={setShowNilNilAlert}
                                                handleNilNilConfirm={handleNilNilConfirm}
                                                gameType={gameType}
                                                matchGoalEvents={matchGoalEvents}
                                                setMatchGoalEvents={setMatchGoalEvents}
                                                wizardStep={wizardStep}
                                                setWizardStep={setWizardStep}
                                                currentGoal={currentGoal}
                                                setCurrentGoal={setCurrentGoal}
                                                teamAScore={teamAScore}
                                                teamBScore={teamBScore}
                                                theirScore={theirScore}
                                                showQuarterFinishModal={showQuarterFinishModal}
                                                setShowQuarterFinishModal={setShowQuarterFinishModal}
                                                setOurScore={setOurScore}
                                                setTeamAScore={setTeamAScore}
                                                setTeamBScore={setTeamBScore}
                                            />
                                        </div>
                                    </div>

                                    {/* PC Bottom Action Bar (Right Panel Footer) - Added per user request */}
                                    <div className="hidden lg:flex w-full p-4 bg-[#1a1a1a] border-t border-gray-800 z-40 gap-2 shrink-0 justify-end">
                                        {currentQuarter > 1 && (
                                            <button
                                                onClick={() => setCurrentQuarter(prev => (prev - 1) as 1 | 2 | 3 | 4)}
                                                className="px-6 py-3 font-bold text-sm rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center justify-center shadow-lg"
                                            >
                                                ⬅️
                                            </button>
                                        )}
                                        {currentQuarter < 4 ? (
                                            <button
                                                onClick={() => setShowQuarterFinishModal(true)}
                                                className="flex-1 py-3 font-bold text-sm rounded-xl bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span>{currentQuarter}Q 종료 및 다음 쿼터 시작</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setShowQuarterFinishModal(true)}
                                                className="flex-1 py-3 font-bold text-sm rounded-xl bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/10 transition-all"
                                            >
                                                💾 경기 종료 및 리포트 확인
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                )
            }

            {/* Feature: Sticky Bottom Save Button */}
            {
                hasUnsavedChanges && (
                    <div className="hidden md:flex fixed bottom-0 left-0 w-full p-4 bg-[#1a1a1a]/90 backdrop-blur-md border-t border-gray-800 z-50 items-center justify-between shadow-2xl animate-slide-up">
                        <div className="text-white">
                            <span className="font-bold text-yellow-500 text-lg mr-2">⚠️ 변경사항이 있습니다</span>
                            <span className="text-gray-400 text-sm">저장하지 않으면 사라집니다.</span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setShowSaveConfirmModal(true)}
                            className="w-full md:w-auto md:px-12 py-4 text-lg font-bold shadow-lg shadow-primary/20 rounded-xl"
                        >
                            💾 스탯 수정사항 저장하기
                        </Button>
                    </div>
                )
            }

            {/* Feature: Save Confirmation Modal */}
            {
                showSaveConfirmModal && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-60 animate-fade-in p-4">
                        <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-700 animate-scale-up">
                            <div className="p-5 border-b border-gray-800 bg-[#252526]">
                                <h3 className="text-xl font-bold text-white">💾 스탯 변경 내역 확인</h3>
                                <p className="text-sm text-gray-400 mt-1">다음 변경사항을 저장하시겠습니까?</p>
                            </div>
                            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                                {players.filter(p => {
                                    const original = originalPlayers.find(op => op.id === p.id);
                                    if (!original) return false;
                                    return manualFields.some(key => p[key] !== original[key]);
                                }).length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">변경사항이 없습니다.</div>
                                ) : (
                                    players.filter(p => {
                                        const original = originalPlayers.find(op => op.id === p.id);
                                        if (!original) return false;
                                        return manualFields.some(key => p[key] !== original[key]);
                                    }).map(p => {
                                        const original = originalPlayers.find(op => op.id === p.id)!;
                                        const diffs = manualFields.filter(key => p[key] !== original[key]);

                                        return (
                                            <div key={p.id} className="bg-[#121212] rounded-xl p-3 border border-gray-800">
                                                <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-800">
                                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                                                        <Image src={p.profileImage} alt={p.name} fill className="object-cover" />
                                                    </div>
                                                    <span className="text-white font-bold">{p.name}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {diffs.map(field => (
                                                        <div key={field} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-400">{fieldLabels[field] || field}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 line-through">{original[field] as number}</span>
                                                                <span className="text-gray-600">→</span>
                                                                <span className="text-primary font-bold">{p[field] as number}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-800 bg-[#252526] flex gap-3">
                                <Button variant="line" onClick={() => setShowSaveConfirmModal(false)} className="flex-1 py-3 text-gray-400">취소</Button>
                                <Button variant="primary" onClick={() => { saveStatChanges(); setShowSaveConfirmModal(false); }} className="flex-1 py-3 font-bold">확인 및 저장</Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 쿼터 종료 컨펌 모달 */}
            {
                showQuarterFinishModal && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-60 animate-fade-in p-6">
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm text-center border border-gray-700 shadow-2xl animate-scale-up">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ring-1 ring-primary/40">⏱️</div>
                            <h3 className="text-xl font-bold text-white mb-2">{currentQuarter}쿼터를 마감하시겠습니까?</h3>

                            <div className="bg-black/30 rounded-xl p-4 my-6 flex items-center justify-around border border-white/5">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Our Team</span>
                                    <span className="text-3xl font-extrabold text-white tabular-nums">
                                        {gameType === "match" ? (matchGoalEvents[currentQuarter] || []).length : teamAScore[currentQuarter]}
                                    </span>
                                </div>
                                <div className="text-gray-700 text-xl font-black">VS</div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Opponent</span>
                                    <span className="text-3xl font-extrabold text-white tabular-nums">
                                        {gameType === "match" ? (theirScore[currentQuarter] || 0) : teamBScore[currentQuarter]}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-400 text-xs mb-6">
                                입력하신 정보가 맞는지 확인해주세요.<br />
                                {currentQuarter === 4
                                    ? "확인 시 경기 기록을 종료하고 리포트를 확인합니다."
                                    : `확인 시 ${currentQuarter + 1}쿼터 입력으로 넘어갑니다.`
                                }
                            </p>

                            <div className="flex gap-3">
                                <Button variant="line" onClick={() => setShowQuarterFinishModal(false)} className="flex-1 py-3 rounded-xl border-gray-600 text-gray-400">
                                    취소
                                </Button>
                                <Button variant="primary" onClick={() => {
                                    // CS Logic
                                    let updatedEntries = [...batchEntries];
                                    const opponentScore = gameType === "match" ? (theirScore[currentQuarter] || 0) : teamBScore[currentQuarter];

                                    if (opponentScore === 0) {
                                        updatedEntries = updatedEntries.map(entry => {
                                            const player = players.find(p => p.id === entry.playerId);
                                            // Check if player attended this quarter AND is a Defender/GK
                                            if (entry.quarters[currentQuarter]?.attended && player && ["GK", "CB", "LB", "RB", "DF"].some(pos => player.mainPosition.includes(pos))) {
                                                return {
                                                    ...entry,
                                                    quarters: {
                                                        ...entry.quarters,
                                                        [currentQuarter]: {
                                                            ...entry.quarters[currentQuarter],
                                                            cleanSheet: true
                                                        }
                                                    }
                                                };
                                            }
                                            return entry;
                                        });
                                        setBatchEntries(updatedEntries);
                                    }

                                    setQuarterCompleted(prev => ({ ...prev, [currentQuarter]: true }));
                                    if (currentQuarter < 4) {
                                        setCurrentQuarter(prev => (prev + 1) as 1 | 2 | 3 | 4);
                                    } else {
                                        setShowPreviewModal(true); // If 4Q, go to preview
                                    }
                                    setShowQuarterFinishModal(false);
                                }} className="flex-1 py-3 rounded-xl font-bold">
                                    네, 맞습니다
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Mobile Bottom Action Bar (Next Quarter / Finish) */}


            {/* 무득점 경기 알럿 모달 */}
            {
                showNilNilAlert && (
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
                )
            }

            {/* 경기 종합 결과 보고서 (Match Report Modal) */}
            {
                showPreviewModal && (
                    <div className="fixed inset-0 bg-black/95 z-100 flex flex-col animate-fade-in overflow-hidden">
                        {/* Header - Simple & Clean like DatePicker */}
                        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-5 bg-[#1a1a1a] shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                <span className="text-xl font-bold text-white tracking-tight">경기 기록 확인</span>
                                {gameType === "match" ? (
                                    <span className="ml-3 text-lg text-gray-400 font-normal">
                                        (Total: <span className="text-white font-bold">{Object.values(matchGoalEvents).flat().length}</span> - <span className="text-white font-bold">{Object.values(theirScore).reduce((a, b) => a + b, 0)}</span>)
                                    </span>
                                ) : (
                                    <span className="ml-3 text-lg text-gray-400 font-normal">
                                        (Total: <span className="text-red-400 font-bold">{Object.values(teamAScore).reduce((a, b) => a + b, 0)}</span> - <span className="text-blue-400 font-bold">{Object.values(teamBScore).reduce((a, b) => a + b, 0)}</span>)
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-4 py-2 rounded-xl bg-[#252526] text-gray-300 font-bold text-sm border border-gray-700 hover:bg-[#333] hover:text-white transition-all shadow-lg"
                            >
                                뒤로 가기
                            </button>
                        </div>

                        {/* Main Content (Match Log + Stat Changes) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            {/* 1. Quarter-by-Quarter Match Log */}
                            <div className="max-w-7xl mx-auto">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span>📅</span> 쿼터별 기록 요약
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((q) => {
                                        const events = matchGoalEvents[q as 1 | 2 | 3 | 4] || [];
                                        return (
                                            <div key={q} className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800 flex flex-col h-full">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-gray-400 font-bold text-sm">{q}쿼터</span>
                                                    <div className="flex gap-1 items-center">
                                                        {events.length > 0 && <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-300 font-bold">{events.length}골</span>}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 flex-1">
                                                    {/* Goal Events */}
                                                    {events.length === 0 ? (
                                                        <div className="flex items-center justify-center text-gray-600 text-xs py-2 border-b border-gray-800/50 pb-4">
                                                            득점 기록 없음
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                                            {events.map((evt, idx) => {
                                                                const scorer = players.find(p => p.id === evt.scorerId);
                                                                const assister = players.find(p => p.id === evt.assisterId);
                                                                return (
                                                                    <div key={evt.id} className="text-xs bg-black/20 p-2 rounded border border-gray-700/50">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                            <span className="text-yellow-500 font-bold">#{idx + 1}</span>
                                                                            <span className="text-white font-bold">{evt.isOpponentOwnGoal ? "상대 자책골" : scorer?.name}</span>
                                                                        </div>
                                                                        {!evt.isOpponentOwnGoal && assister && (
                                                                            <div className="text-gray-500 pl-4">└ 도움: {assister.name}</div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Clean Sheet List */}
                                                    {batchEntries.some(e => e.quarters[q]?.cleanSheet) && (
                                                        <div className="pt-2 border-t border-gray-800/50">
                                                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                                🛡️ CS
                                                            </h4>
                                                            <div className="flex flex-wrap gap-1">
                                                                {batchEntries.filter(e => e.quarters[q]?.cleanSheet).map(e => {
                                                                    const p = players.find(player => player.id === e.playerId);
                                                                    if (!p) return null;
                                                                    return (
                                                                        <span key={p.id} className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                                                                            <span>{p.name}</span>
                                                                            {p.mainPosition.includes("GK") && <span>🧤</span>}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Player Stat Changes */}
                            <div className="max-w-7xl mx-auto">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span>📈</span> 최종 스탯 변화
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {players.map(player => {
                                        // summaryData is inside SummaryView, so we need to recalculate here or pass it.
                                        // Actually, it's easier to just pass necessary data or recalculate.
                                        // Inside PlayerManagementPanel, we can calculate session results.

                                        const sessionStats = batchEntries.find(d => d.playerId === player.id);
                                        if (!sessionStats) return null;

                                        let sGoals = 0, sAssists = 0, sCS = 0;
                                        Object.values(sessionStats.quarters).forEach(q => {
                                            if (q.attended) {
                                                sGoals += q.goals;
                                                sAssists += q.assists;
                                                if (q.cleanSheet) sCS++;
                                            }
                                        });

                                        if (sGoals === 0 && sAssists === 0 && sCS === 0) return null;

                                        return (
                                            <div key={player.id} className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800 flex gap-4 items-center relative overflow-hidden group hover:border-gray-600 transition-colors">
                                                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                                                    <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg font-bold text-white truncate">{player.name}</span>
                                                    </div>
                                                    <div className="space-y-1 text-sm bg-black/20 p-2 rounded-lg">
                                                        {sGoals > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-400">골</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-gray-500">{player.goals}</span>
                                                                    <span className="text-gray-600">→</span>
                                                                    <span className="text-white font-bold">{player.goals + sGoals}</span>
                                                                    <span className="text-green-400 font-bold ml-1 text-xs">(+{sGoals})</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {sAssists > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-400">어시</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-gray-500">{player.assists}</span>
                                                                    <span className="text-gray-600">→</span>
                                                                    <span className="text-white font-bold">{player.assists + sAssists}</span>
                                                                    <span className="text-blue-400 font-bold ml-1 text-xs">(+{sAssists})</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {sCS > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-400 font-medium">CS</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-gray-500">{player.cleanSheets}</span>
                                                                    <span className="text-gray-600">→</span>
                                                                    <span className="text-green-400 font-extrabold">{player.cleanSheets + sCS}</span>
                                                                    <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-black border border-green-500/10 ml-1">🛡️ +{sCS}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-gray-800 bg-[#1a1a1a] flex gap-4 shrink-0">
                            <Button
                                variant="line"
                                onClick={() => setShowPreviewModal(false)}
                                className="flex-1 py-4 rounded-xl border-gray-600 text-gray-400 hover:text-white"
                            >
                                기록 수정하기
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleBatchSubmit}
                                className="flex-1 py-4 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/40"
                            >
                                네, 최종 저장합니다
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* 종료 컨펌 모달 */}
            {
                showFinishModal && (
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
                )
            }
            {/* Player Release Confirmation Modal */}
            {
                deletingPlayerId && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-70 animate-fade-in p-4">
                        <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-700 animate-scale-up">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ring-1 ring-red-500/30">
                                    🗑️
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">선수 방출 확인</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    <span className="text-white font-bold">{players.find(p => p.id === deletingPlayerId)?.name}</span> 선수를<br />
                                    정말로 팀에서 방출하시겠습니까?
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="line"
                                        onClick={() => setDeletingPlayerId(null)}
                                        className="flex-1 py-3 border-gray-600 text-gray-400 hover:text-white"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={confirmDeletePlayer}
                                        className="flex-1 py-3 font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20"
                                    >
                                        방출하기
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                showToast && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] bg-green-500/90 text-white px-8 py-4 rounded-full font-bold shadow-2xl animate-bounce-in backdrop-blur-md flex items-center gap-3 border border-white/20">
                        <span className="text-2xl">✅</span>
                        <span className="text-lg">경기 기록이 성공적으로 저장되었습니다!</span>
                    </div>
                )
            }
        </div >
    );
}

// 하단 뷰 분리 컴포넌트
interface SummaryViewProps {
    batchEntries: BatchEntry[];
    goalEvents: GoalEvent[];
    players: PlayerRecord[];
    activeEventId: number | null;
    setActiveEventId: (id: number | null) => void;
    setShowFinishModal: (show: boolean) => void;
    handleBatchSubmit: () => void;
    showFinishModal: boolean;
    quarterCompleted: Record<number, boolean>;
    setQuarterCompleted: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    setShowPreviewModal: (show: boolean) => void;
    showPreviewModal: boolean;
    showNilNilAlert: boolean;
    setShowNilNilAlert: (show: boolean) => void;
    handleNilNilConfirm: () => void;
    currentQuarter: 1 | 2 | 3 | 4;
    setCurrentQuarter: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>;
    gameType: "match" | "scrimmage";
    matchGoalEvents: Record<number, GoalEvent[]>;
    setMatchGoalEvents: React.Dispatch<React.SetStateAction<Record<number, GoalEvent[]>>>;
    wizardStep: "idle" | "scorer" | "assister";
    setWizardStep: (step: "idle" | "scorer" | "assister") => void;
    currentGoal: { scorerId: string | null; assisterId: string | null; isOpponentOwnGoal: boolean } | null;
    setCurrentGoal: React.Dispatch<React.SetStateAction<{ scorerId: string | null; assisterId: string | null; isOpponentOwnGoal: boolean } | null>>;
    teamAScore: { [key: number]: number };
    teamBScore: { [key: number]: number };
    theirScore: { [key: number]: number };
    showQuarterFinishModal: boolean;
    setShowQuarterFinishModal: (show: boolean) => void;
    setOurScore: React.Dispatch<React.SetStateAction<{ [key: number]: number; }>>;
    setTeamAScore: React.Dispatch<React.SetStateAction<{ [key: number]: number; }>>;
    setTeamBScore: React.Dispatch<React.SetStateAction<{ [key: number]: number; }>>;
}

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
    setQuarterCompleted,
    setShowPreviewModal,
    showPreviewModal,
    showNilNilAlert,
    setShowNilNilAlert,
    handleNilNilConfirm,
    currentQuarter,
    setCurrentQuarter,
    gameType,
    matchGoalEvents,
    setMatchGoalEvents,
    wizardStep,
    setWizardStep,
    currentGoal,
    setCurrentGoal,
    teamAScore,
    teamBScore,
    theirScore,
    showQuarterFinishModal,
    setShowQuarterFinishModal,
    setOurScore,
    setTeamAScore,
    setTeamBScore
}: SummaryViewProps) {
    const [activeTab, setActiveTab] = useState<"log" | "summary">("log");

    // 합산 데이터 계산
    const summaryData = batchEntries.map(entry => {
        let totalGoals = 0;
        let totalAssists = 0;
        let totalOG = 0;
        let totalCS = 0;

        Object.values(entry.quarters).forEach(q => {
            if (q.attended) {
                totalGoals += q.goals;
                totalAssists += q.assists;
                totalOG += q.ownGoals;
                if (q.cleanSheet) totalCS++;
            }
        });

        const player = players.find(p => p.id === entry.playerId);
        return {
            ...entry,
            totalGoals,
            totalAssists,
            totalOG,
            totalCS,
            name: player?.name || ""
        };
    }).filter(d => d.totalGoals > 0 || d.totalAssists > 0 || d.totalOG > 0 || d.totalCS > 0)
        .sort((a, b) => (b.totalGoals * 2 + b.totalAssists) - (a.totalGoals * 2 + a.totalAssists));

    return (
        <div className="h-full bg-[#1a1a1a] flex flex-col">
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
                            <p className="text-xs text-center">기록된 이벤트가 없습니다.<br />좌측 패널에 기록을 입력해주세요.</p>
                        </div>
                    ) : (
                        goalEvents.slice().reverse().map(event => {
                            const scorer = players.find(p => p.id === event.scorerId);
                            const isOG = event.scorerId === "OG";
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
                                        <span className="text-white font-bold text-sm">{isOG ? "상대 자책골" : scorer?.name}</span>
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMatchGoalEvents(prev => ({
                                                ...prev,
                                                [event.quarter]: prev[event.quarter].filter(ev => ev.id !== event.id)
                                            }));

                                            if (gameType === "match") {
                                                setOurScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                            } else {
                                                const team = event.team;
                                                if (team === "A") setTeamAScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                                else setTeamBScore(prev => ({ ...prev, [event.quarter]: Math.max(0, (prev[event.quarter] || 0) - 1) }));
                                            }
                                        }}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
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
                                            {data.totalOG > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">😱 {data.totalOG}</span>}
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
        </div>
    );
}
