import React, { useState, Suspense } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn, getValidImageSrc } from "@/lib/utils";
import { Edit2, Trash2, ChevronDown, Plus, X, Swords, Mic, Type, Users, ChevronRight, ArrowLeft } from "lucide-react";
import InHouseMatchPanel from "./InHouseMatchPanel";
import { useMatchRecordsQuery } from "./hooks/useMatchRecordsQuery";
import { useDeleteMatchMutation } from "./hooks/useDeleteMatchMutation";
import { usePlayerManagementQuery } from "./hooks/usePlayerManagementQuery";
import { useUpdateMatchMutation } from "./hooks/useUpdateMatchMutation";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import ImgPlayer from "@/components/ui/ImgPlayer";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { getTeamMemberProfileImageRawUrl, getTeamMemberProfileImageFallbackUrl } from "@/lib/playerPlaceholderImage";

const ENEMY_PLAYERS = [
    "메시", "호날두", "음바페", "홀란드", "호나우두", "펠레", "마라도나", "지단", "베르캄프", "앙리",
    "셰브첸코", "반니스텔루이", "드록바", "에투", "리네커", "뮐러", "레반도프스키", "벤제마", "수아레스",
    "루니", "반바스텐", "네이마르", "호나우지뉴", "카카", "박지성", "케인", "바티스투타", "라울", "델피에로",
    "토티", "이브라히모비치", "칸토나", "크루이프", "푸스카스", "에우제비우", "조지베스트", "디스테파노",
    "아구에로", "오언", "시어러", "인자기", "비야", "토레스", "로벤", "리베리", "제라드", "램파드", "사비",
    "이니에스타", "피구", "손흥민", "베컴",
];

// ─── 한국어 퍼지 매칭 유틸리티 ───────────────────────────────────────────────
const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGSUNG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function decomposeKorean(str: string): string {
    let result = '';
    for (const char of str) {
        const code = char.charCodeAt(0);
        if (code >= 0xAC00 && code <= 0xD7A3) {
            const offset = code - 0xAC00;
            const cho = Math.floor(offset / (21 * 28));
            const jung = Math.floor((offset % (21 * 28)) / 28);
            const jong = offset % 28;
            result += CHOSUNG_LIST[cho] + JUNGSUNG_LIST[jung] + (jong ? JONGSUNG_LIST[jong] : '');
        } else {
            result += char;
        }
    }
    return result;
}

function calculateKoreanSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (!a || !b) return 0;
    const jamoA = decomposeKorean(a);
    const jamoB = decomposeKorean(b);
    const maxLen = Math.max(jamoA.length, jamoB.length);
    if (maxLen === 0) return 1;
    let matches = 0;
    const bArr = jamoB.split('');
    for (const j of jamoA.split('')) {
        const idx = bArr.indexOf(j);
        if (idx !== -1) { matches++; bArr.splice(idx, 1); }
    }
    return matches / maxLen;
}

function fuzzyMatchPlayer(input: string, players: Player[]): Player | undefined {
    const cleaned = input.replace(/이$|가$|이가$|은$|는$|을$|를$|이에요$|이야$|했어요$|했다$|했습니다$/, '').trim();
    if (!cleaned) return undefined;
    const exact = players.find(p => p.name === cleaned);
    if (exact) return exact;
    const contains = players.find(p => p.name.includes(cleaned) || cleaned.includes(p.name));
    if (contains) return contains;
    const best = players.map(p => ({ player: p, score: calculateKoreanSimilarity(cleaned, p.name) }))
        .sort((a, b) => b.score - a.score)[0];
    return (best && best.score > 0.45) ? best.player : undefined;
}

function fuzzyMatchPlayerAll(input: string, players: Player[]): Player[] {
    const cleaned = input.replace(/이$|가$|이가$|은$|는$|을$|를$|이에요$|이야$|했어요$|했다$|했습니다$/, '').trim();
    if (!cleaned) return [];
    const exact = players.filter(p => p.name === cleaned);
    if (exact.length > 0) return exact;
    const contains = players.filter(p => p.name.includes(cleaned) || cleaned.includes(p.name));
    if (contains.length > 0) return contains;
    return players.filter(p => calculateKoreanSimilarity(cleaned, p.name) > 0.45);
}

function parseVoiceInput(text: string, interimText: string, players: Player[]) {
    const fullText = (text + ' ' + interimText).trim();
    if (!fullText) return { goal: undefined, assist: undefined, preAssist: undefined, rawGoal: '', rawAssist: '', rawPreAssist: '' };

    let rawGoal = '', rawAssist = '', rawPreAssist = '';

    // 붙여쓰기 형식 우선: [이름]골[이름]어시[이름]기점
    const noSpace = fullText.replace(/\s/g, '');
    let rem = noSpace;
    const gm = rem.match(/^(.+?)(?:골|득점)/);
    if (gm) { rawGoal = gm[1]; rem = rem.slice(gm[0].length); }
    const am = rem.match(/^(.+?)(?:어시|도움|어시스트)/);
    if (am) { rawAssist = am[1]; rem = rem.slice(am[0].length); }
    const pm = rem.match(/^(.+?)기점/);
    if (pm) rawPreAssist = pm[1];

    // 붙여쓰기 파싱 실패 시 → 띄어쓰기 형식
    if (!rawGoal) {
        const tokens = fullText.trim().split(/\s+/);
        let role: 'none' | 'goal' | 'assist' | 'preAssist' = 'none';
        for (const token of tokens) {
            const t = token.replace(/이$|가$|이가$|은$|는$|을$|를$|이에요$|이야$|했어요$|했다$|했습니다$/, '');
            if (/골$|득점$/.test(t)) {
                rawGoal = t.replace(/골$|득점$/, ''); role = 'goal';
            } else if (/어시$|도움$|어시스트$/.test(t)) {
                rawAssist = t.replace(/어시$|도움$|어시스트$/, ''); role = 'assist';
            } else if (/기점$/.test(t)) {
                rawPreAssist = t.replace(/기점$/, ''); role = 'preAssist';
            } else if (['골', '득점'].includes(t)) {
                role = 'goal';
            } else if (['어시', '도움', '어시스트'].includes(t)) {
                role = 'assist';
            } else if (t === '기점') {
                role = 'preAssist';
            } else if (t) {
                if (role === 'goal' && !rawGoal) rawGoal = t;
                else if (role === 'assist' && !rawAssist) rawAssist = t;
                else if (role === 'preAssist' && !rawPreAssist) rawPreAssist = t;
                else if (role === 'none') { rawGoal = t; role = 'goal'; }
            }
        }
    }

    const clean = (n: string) => n.replace(/이$|가$|이가$|은$|는$|을$|를$/, '').trim();
    return {
        goal: rawGoal ? fuzzyMatchPlayer(clean(rawGoal), players) : undefined,
        assist: rawAssist ? fuzzyMatchPlayer(clean(rawAssist), players) : undefined,
        preAssist: rawPreAssist ? fuzzyMatchPlayer(clean(rawPreAssist), players) : undefined,
        rawGoal: clean(rawGoal),
        rawAssist: clean(rawAssist),
        rawPreAssist: clean(rawPreAssist),
    };
}
// ─────────────────────────────────────────────────────────────────────────────

interface Player {
    id: string;
    name: string;
    profileImage: string;
    fallbackImage?: string;
}

interface ScoreLog {
    id: string;
    type: "goal" | "conceded";
    player?: Player;
    assist?: Player;
    preAssist?: Player;
}

interface MatchRecord {
    id: string;
    date: string;
    opponent: string;
    score: {
        home: number;
        away: number;
    };
    result: "win" | "draw" | "loss";
    expanded: boolean;
    logs: Record<number, ScoreLog[]>; // 쿼터별 로그
}

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "다리알베스", profileImage: "/images/player/img_player_1.webp" },
    { id: "2", name: "권대근(용병)", profileImage: "/images/player/img_player_2.webp" },
    { id: "3", name: "랜디", profileImage: "/images/player/img_player_3.webp" },
    { id: "4", name: "정수", profileImage: "/images/player/img_player_4.webp" },
];

const ResultBadge = ({ result }: { result: "win" | "draw" | "loss" }) => {
    const config = {
        win: { label: "승", bg: "bg-[#4ade80]/20", text: "text-[#4ade80]" },
        draw: { label: "무", bg: "bg-gray-500/20", text: "text-gray-400" },
        loss: { label: "패", bg: "bg-[#f87171]/20", text: "text-[#f87171]" },
    };

    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", config[result].bg, config[result].text)}>
            {config[result].label}
        </span>
    );
};

// --- 모달 컴포넌트 ---
interface PlayerSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { goalId: string; assistId: string; preAssistId: string }) => void;
    onSaveText: (data: (ScoreLog & { quarter: number })[]) => void;
    onShowSummary?: () => void;
    players: Player[];
    currentQuarter: number;
}

const PlayerSelectModal = ({ isOpen, onClose, onSave, onSaveText, players, currentQuarter }: PlayerSelectModalProps) => {
    type ModalMode = "METHOD_SELECT" | "VOICE" | "TEXT" | "SELECT";
    const [mode, setMode] = useState<ModalMode>("METHOD_SELECT");
    const [selectedMethod, setSelectedMethod] = useState<"VOICE" | "TEXT" | "SELECT">("VOICE");

    // 음성 상태
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognitionRef = React.useRef<any>(null);

    // 텍스트 입력 상태 (단일 입력창)
    const [textInput, setTextInput] = useState("");

    // 선수 선택 상태
    const [selectedGoal, setSelectedGoal] = useState<string>("none");
    const [selectedAssist, setSelectedAssist] = useState<string>("none");
    const [selectedPreAssist, setSelectedPreAssist] = useState<string>("none");

    // 모달 열릴 때 상태 초기화
    React.useEffect(() => {
        if (isOpen) {
            setMode("METHOD_SELECT");
            setSelectedMethod("VOICE");
            setTranscript(""); setInterimTranscript("");
            setTextInput("");
            setSelectedGoal("none"); setSelectedAssist("none"); setSelectedPreAssist("none");
            setIsListening(false);
        } else {
            try { recognitionRef.current?.stop(); } catch (_) {}
        }
    }, [isOpen]);

    // 음성인식 시작/중지
    const startListening = () => {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { alert("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요."); return; }
        try { recognitionRef.current?.stop(); } catch (_) {}
        const recognition = new SR();
        recognitionRef.current = recognition;
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
            let interim = '', final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                e.results[i].isFinal ? (final += e.results[i][0].transcript) : (interim += e.results[i][0].transcript);
            }
            if (final) { setTranscript(prev => (prev + ' ' + final).trim()); setInterimTranscript(''); }
            else setInterimTranscript(interim);
        };
        recognition.onerror = () => { setIsListening(false); setInterimTranscript(''); };
        recognition.onend = () => { setIsListening(false); setInterimTranscript(''); };
        recognition.start();
    };
    const stopListening = () => { try { recognitionRef.current?.stop(); } catch (_) {} setIsListening(false); };

    // 선택 모드 핸들러
    const handleGoalChange = (id: string) => {
        setSelectedGoal(id);
        if (selectedAssist === id) setSelectedAssist("none");
        if (selectedPreAssist === id) setSelectedPreAssist("none");
    };
    const handleAssistChange = (id: string) => {
        setSelectedAssist(id);
        if (id !== "none" && selectedGoal === id) setSelectedGoal("none");
        if (id !== "none" && selectedPreAssist === id) setSelectedPreAssist("none");
    };
    const handlePreAssistChange = (id: string) => {
        setSelectedPreAssist(id);
        if (id !== "none" && selectedGoal === id) setSelectedGoal("none");
        if (id !== "none" && selectedAssist === id) setSelectedAssist("none");
    };

    // 음성 파싱 결과 (실시간)
    const voiceParsed = React.useMemo(
        () => parseVoiceInput(transcript, interimTranscript, players),
        [transcript, interimTranscript, players]
    );

    // 텍스트 입력 실시간 파싱 (줄별 복수 득점 지원)
    const textParsedLines = React.useMemo(() => {
        return textInput
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => ({ line, parsed: parseVoiceInput(line, "", players) }));
    }, [textInput, players]);

    // 저장 핸들러
    const handleSave = () => {
        if (mode === "SELECT") {
            if (selectedGoal === "none") { alert("득점자를 선택해주세요."); return; }
            onSave({ goalId: selectedGoal, assistId: selectedAssist, preAssistId: selectedPreAssist });
        } else if (mode === "TEXT") {
            if (!textInput.trim()) { alert("득점 정보를 입력해주세요."); return; }
            const validLines = textParsedLines.filter(l => l.parsed.rawGoal);
            if (validLines.length === 0) { alert("득점자를 입력해주세요.\n예: 알베스 골 빅루트 어시"); return; }

            // 이름이 매칭되지 않을 때 복수 후보 확인
            const checkAmbiguous = (rawName: string, matched: Player | undefined, label: string) => {
                if (rawName && !matched) {
                    const candidates = fuzzyMatchPlayerAll(rawName, players);
                    if (candidates.length > 1) {
                        alert(`"${rawName}"과 비슷한 선수가 여러 명 있습니다.\n${candidates.map(p => p.name).join(', ')}\n${label} 이름을 확인해주세요.`);
                        return false;
                    }
                }
                return true;
            };
            for (const { parsed } of validLines) {
                if (!checkAmbiguous(parsed.rawGoal, parsed.goal, "득점자")) return;
                if (!checkAmbiguous(parsed.rawAssist, parsed.assist, "도움 선수")) return;
            }
            onSaveText(validLines.map(({ parsed }) => ({
                id: crypto.randomUUID(),
                type: "goal" as const,
                quarter: currentQuarter,
                player: parsed.goal,
                assist: parsed.assist,
                preAssist: parsed.preAssist,
            })));
        } else if (mode === "VOICE") {
            if (!transcript.trim()) { alert("먼저 음성을 입력해주세요."); return; }
            onSaveText([{ id: crypto.randomUUID(), type: "goal", quarter: currentQuarter,
                player: voiceParsed.goal, assist: voiceParsed.assist, preAssist: voiceParsed.preAssist }]);
        }
        onClose();
    };

    if (!isOpen) return null;

    const MODAL_TITLE: Record<string, string> = {
        METHOD_SELECT: "득점 선수 입력",
        VOICE: "득점 선수 음성 입력",
        TEXT: "득점 선수 텍스트 입력",
        SELECT: "득점 선수 선택",
    };

    const PlayerRow = ({ icon, label, value, onChange, suggestions }: {
        icon: string; label: string; value: string;
        onChange: (v: string) => void; suggestions: Player[];
    }) => (
        <section>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{icon}</span>
                <span className="text-sm font-bold text-white">{label}</span>
            </div>
            <div className="relative">
                <input
                    type="text" value={value} onChange={e => onChange(e.target.value)}
                    placeholder="선수 이름"
                    className="w-full bg-[#2a2a2a] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-all"
                />
                {suggestions.length > 0 && value.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-white/10 rounded-2xl overflow-hidden z-10 shadow-2xl">
                        {suggestions.map(p => (
                            <button key={p.id} onClick={() => onChange(p.name)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                    <ImgPlayer src={p.profileImage || undefined} fallbackSrc={p.fallbackImage} alt={p.name} />
                                </div>
                                <span className="text-sm text-white font-medium">{p.name}</span>
                                {p.name !== value.trim() && (
                                    <span className="text-[10px] text-primary ml-auto">AI 추천</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
                    {mode !== "METHOD_SELECT" ? (
                        <button onClick={() => setMode("METHOD_SELECT")} className="text-gray-500 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    ) : <div className="w-5" />}
                    <h2 className="text-base font-bold text-white">{MODAL_TITLE[mode]}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                {/* 본문 */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">

                        {/* ── 방법 선택 ── */}
                        {mode === "METHOD_SELECT" && (
                            <div className="space-y-3">
                                {([
                                    { method: "VOICE" as const, icon: Mic, title: "AI 음성 인식 입력", desc: "마이크로 득점 정보를 말합니다." },
                                    { method: "TEXT" as const, icon: Type, title: "텍스트 입력", desc: "득점자 이름을 직접 입력합니다" },
                                    { method: "SELECT" as const, icon: Users, title: "선수 선택", desc: "선수 목록에서 터치하여 선택합니다." },
                                ]).map(({ method, icon: Icon, title, desc }) => (
                                    <button key={method} onClick={() => setSelectedMethod(method)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                            selectedMethod === method ? "border-white/20 bg-white/5" : "border-white/5 hover:border-white/10"
                                        )}>
                                        <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center shrink-0">
                                            <Icon size={22} className="text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-white">{title}</div>
                                            <div className="text-[11px] text-gray-500 mt-0.5">{desc}</div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── 음성 입력 ── */}
                        {mode === "VOICE" && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        className={cn(
                                            "w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl",
                                            isListening
                                                ? "bg-primary shadow-primary/40 scale-110"
                                                : "bg-primary hover:scale-105 shadow-primary/20"
                                        )}
                                    >
                                        <Mic size={52} className="text-black" />
                                    </button>
                                    <p className="text-sm font-bold text-white">
                                        {isListening ? "듣는 중... 클릭하여 중지" : "마이크를 클릭하세요"}
                                    </p>
                                    {isListening && (
                                        <div className="flex gap-1 items-end h-6">
                                            {[10, 16, 10, 20, 12].map((h, i) => (
                                                <div key={i} className="w-1.5 bg-primary rounded-full animate-bounce"
                                                    style={{ height: h, animationDelay: `${i * 80}ms` }} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 예시 */}
                                <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span>💡</span>
                                        <span className="text-xs font-bold text-white">음성 입력 예시</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {['"뺑슨이 득점했어요"', '"빅루트가 골 뺑슨이 도움"', '"골 뺑슨 어시 알베스 기점 랜디"'].map((ex, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[12px] text-gray-400">
                                                <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />{ex}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 음성 텍스트 표시 */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base">⚽</span>
                                        <span className="text-sm font-bold text-white">득점/도움/기점</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={transcript}
                                        onChange={e => setTranscript(e.target.value)}
                                        placeholder="선수 이름"
                                        className="w-full bg-[#2a2a2a] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-all"
                                    />
                                    {interimTranscript && (
                                        <p className="text-xs text-gray-500 italic px-4 mt-1">{interimTranscript}...</p>
                                    )}
                                </div>

                                {/* AI 파싱 결과 */}
                                {(voiceParsed.rawGoal || voiceParsed.rawAssist || voiceParsed.rawPreAssist) && (
                                    <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-2.5">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI 인식 결과</div>
                                        {[
                                            { label: "득점", raw: voiceParsed.rawGoal, matched: voiceParsed.goal },
                                            { label: "도움", raw: voiceParsed.rawAssist, matched: voiceParsed.assist },
                                            { label: "기점", raw: voiceParsed.rawPreAssist, matched: voiceParsed.preAssist },
                                        ].filter(r => r.raw).map(({ label, raw, matched }) => (
                                            <div key={label} className="flex items-center gap-3">
                                                <span className="text-[10px] text-gray-500 w-8 shrink-0">{label}</span>
                                                {matched ? (
                                                    <>
                                                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                                                            <ImgPlayer src={matched.profileImage || undefined} fallbackSrc={matched.fallbackImage} alt={matched.name} />
                                                        </div>
                                                        <span className="text-xs font-bold text-primary">{matched.name}</span>
                                                        {matched.name !== raw && (
                                                            <span className="text-[9px] text-gray-500 ml-auto">"{raw}" → AI 매칭</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-bold text-red-400">"{raw}" (등록 선수 없음)</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── 텍스트 입력 ── */}
                        {mode === "TEXT" && (
                            <div className="space-y-6">
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-base">⚽</span>
                                        <span className="text-sm font-bold text-white">득점/도움</span>
                                        <span className="text-[10px] text-gray-500 ml-auto">줄바꿈으로 여러 골 입력 가능</span>
                                    </div>
                                    <textarea
                                        value={textInput}
                                        onChange={e => setTextInput(e.target.value)}
                                        placeholder={"예시)\n알베스 골 빅루트 어시\n백지민 골 김정수 어시\n손흥민 득점"}
                                        rows={5}
                                        className="w-full bg-[#2a2a2a] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-all resize-none leading-relaxed"
                                    />
                                </section>
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">입력 결과</div>
                                        {textParsedLines.filter(l => l.parsed.rawGoal).length > 0 && (
                                            <span className="text-[10px] text-primary font-bold">
                                                {textParsedLines.filter(l => l.parsed.rawGoal).length}골 등록 예정
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-4">
                                        {!textInput.trim() ? (
                                            <div className="text-xs text-gray-600">득점 정보를 입력하면 결과가 표시됩니다</div>
                                        ) : textParsedLines.length === 0 ? (
                                            <div className="text-xs text-gray-600">-</div>
                                        ) : (
                                            textParsedLines.map(({ line, parsed }, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    {idx > 0 && <div className="border-t border-white/5" />}
                                                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">#{idx + 1} 득점</div>
                                                    {[
                                                        { label: "골", raw: parsed.rawGoal, matched: parsed.goal },
                                                        { label: "도움", raw: parsed.rawAssist, matched: parsed.assist },
                                                        { label: "기점", raw: parsed.rawPreAssist, matched: parsed.preAssist },
                                                    ].filter(r => r.label === "골" || r.raw).map(({ label, raw, matched }) => (
                                                        <div key={label} className="flex items-center gap-3">
                                                            <span className="text-[10px] text-gray-500 w-8 shrink-0">{label}</span>
                                                            {matched ? (
                                                                <>
                                                                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                                                                        <ImgPlayer src={matched.profileImage || undefined} fallbackSrc={matched.fallbackImage} alt={matched.name} />
                                                                    </div>
                                                                    <span className="text-xs font-bold text-primary">{matched.name}</span>
                                                                    {raw && matched.name !== raw && (
                                                                        <span className="text-[9px] text-gray-500 ml-auto">"{raw}" → AI 매칭</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-500">{raw ? `"${raw}" (미매칭)` : "-"}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* ── 선수 선택 ── */}
                        {mode === "SELECT" && (
                            <div className="space-y-8">
                                {/* 득점 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-base">⚽</span>
                                        <span className="text-sm font-medium text-gray-400">득점</span>
                                        <span className="text-sm font-bold text-primary">{players.find(p => p.id === selectedGoal)?.name || ""}</span>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {players.map(player => (
                                            <button key={player.id} onClick={() => handleGoalChange(player.id)} className="flex flex-col items-center gap-2 shrink-0 group">
                                                <div className={cn("w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all", selectedGoal === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100")}>
                                                    <ImgPlayer src={player.profileImage || undefined} fallbackSrc={player.fallbackImage} alt={player.name} />
                                                </div>
                                                <span className={cn("text-[10px] font-medium transition-colors", selectedGoal === player.id ? "text-white" : "text-gray-500")}>{player.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                                {/* 도움 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-base">👟</span>
                                        <span className="text-sm font-medium text-gray-400">도움</span>
                                        <span className="text-sm font-bold text-primary">{selectedAssist === "none" ? "없음" : players.find(p => p.id === selectedAssist)?.name}</span>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        <button onClick={() => handleAssistChange("none")} className={cn("flex flex-col items-center gap-2 shrink-0", selectedAssist === "none" ? "opacity-100" : "opacity-60")}>
                                            <div className={cn("w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center", selectedAssist === "none" ? "border-primary scale-105" : "border-transparent")}>
                                                <span className={cn("text-xs font-bold", selectedAssist === "none" ? "text-primary" : "text-gray-500")}>없음</span>
                                            </div>
                                        </button>
                                        {players.map(player => (
                                            <button key={player.id} onClick={() => handleAssistChange(player.id)} className="flex flex-col items-center gap-2 shrink-0 group">
                                                <div className={cn("w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all", selectedAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100")}>
                                                    <ImgPlayer src={player.profileImage || undefined} fallbackSrc={player.fallbackImage} alt={player.name} />
                                                </div>
                                                <span className={cn("text-[10px] font-medium transition-colors", selectedAssist === player.id ? "text-white" : "text-gray-500")}>{player.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                                {/* 기점 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-base">⛳</span>
                                        <span className="text-sm font-medium text-gray-400">기점</span>
                                        <span className="text-sm font-bold text-primary">{selectedPreAssist === "none" ? "없음" : players.find(p => p.id === selectedPreAssist)?.name}</span>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        <button onClick={() => handlePreAssistChange("none")} className={cn("flex flex-col items-center gap-2 shrink-0", selectedPreAssist === "none" ? "opacity-100" : "opacity-60")}>
                                            <div className={cn("w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center", selectedPreAssist === "none" ? "border-primary scale-105" : "border-transparent")}>
                                                <span className={cn("text-xs font-bold", selectedPreAssist === "none" ? "text-primary" : "text-gray-500")}>없음</span>
                                            </div>
                                        </button>
                                        {players.map(player => (
                                            <button key={player.id} onClick={() => handlePreAssistChange(player.id)} className="flex flex-col items-center gap-2 shrink-0 group">
                                                <div className={cn("w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all", selectedPreAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100")}>
                                                    <ImgPlayer src={player.profileImage || undefined} fallbackSrc={player.fallbackImage} alt={player.name} />
                                                </div>
                                                <span className={cn("text-[10px] font-medium transition-colors", selectedPreAssist === player.id ? "text-white" : "text-gray-500")}>{player.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="px-6 pb-6 pt-4 flex gap-3 shrink-0 border-t border-white/5">
                    <button onClick={onClose} className="flex-1 py-4 rounded-xl bg-[#2a2a2a] text-gray-400 text-sm font-bold hover:bg-[#333] transition-colors">
                        취소
                    </button>
                    {mode === "METHOD_SELECT" ? (
                        <button onClick={() => setMode(selectedMethod)} className="flex-1 py-4 rounded-xl bg-primary text-black text-sm font-bold hover:opacity-90 transition-opacity">
                            다음
                        </button>
                    ) : (
                        <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-primary text-black text-sm font-bold hover:opacity-90 transition-opacity">
                            저장
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function MatchRecordManagementPanelInner({ teamId }: { teamId: number }) {
    const data = useMatchRecordsQuery(teamId);
    const playersData = usePlayerManagementQuery(teamId);
    const { executeMutation: deleteMatch } = useDeleteMatchMutation();
    const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"RECORD" | "IN_HOUSE">("RECORD");
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [logToDelete, setLogToDelete] = useState<{ matchId: string; quarter: number; logId: string; description: string } | null>(null);

    // 실제 팀 멤버 데이터 매핑
    const teamPlayers: Player[] = React.useMemo(() => (playersData.findManyTeamMember.members || []).map((m: any) => {
        const normalizedMemberId = m.id != null ? (parseNumericIdFromRelayGlobalId(m.id) ?? 0) : 0;
        const memberForImage = { ...m, id: normalizedMemberId || 0 };
        const rawUrl = getTeamMemberProfileImageRawUrl(memberForImage as any);
        const fallbackUrl = getTeamMemberProfileImageFallbackUrl(memberForImage as any);
        return {
            id: String(m.id),
            name: m.user?.name || "알 수 없음",
            profileImage: rawUrl,
            fallbackImage: fallbackUrl,
        };
    }), [playersData.findManyTeamMember.members]);
    // API 데이터를 로컬 상태와 결합 (확장 여부 관리용 및 로그 데이터 복원)
    const initialMatches: MatchRecord[] = React.useMemo(() => (data.findMatch || []).map((m: any) => {
        let savedData = { score: { home: 0, away: 0 }, logs: { 1: [], 2: [], 3: [], 4: [] } };
        try {
            if (m.description && m.description.startsWith("{")) {
                savedData = JSON.parse(m.description);
            }
        } catch (e) {
            console.error("Failed to parse match description:", e);
        }

        return {
            id: String(m.id),
            date: m.matchDate ? new Date(m.matchDate).toLocaleDateString() : "-",
            opponent: m.opponentTeam?.name || m.teamName || "상대팀 미정",
            score: savedData.score,
            result: (savedData.score.home > savedData.score.away ? "win" :
                savedData.score.home < savedData.score.away ? "loss" : "draw") as "win" | "draw" | "loss",
            expanded: false,
            logs: savedData.logs,
        };
    }), [data.findMatch]);

    const [matches, setMatches] = useState<MatchRecord[]>(initialMatches);
    const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
    const { executeMutation: updateMatch } = useUpdateMatchMutation();
    const [hasChanges, setHasChanges] = useState(false);
    const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
    const [isSavingChanges, setIsSavingChanges] = useState(false);

    // 초기 데이터 로드 시 상태 동기화
    React.useEffect(() => {
        setMatches(initialMatches);
    }, [initialMatches]);

    const toggleExpand = (id: string) => {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m));
    };

    if (viewMode === "IN_HOUSE") {
        return <InHouseMatchPanel onBack={() => setViewMode("RECORD")} />;
    }

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPendingDeletes(prev => [...prev, id]);
        setHasChanges(true);
    };

    const handleReset = () => {
        setPendingDeletes([]);
        setMatches(initialMatches);
        setHasChanges(false);
    };

    const updateMatchData = (id: string, updater: (m: MatchRecord) => MatchRecord) => {
        setMatches(prev => prev.map(m => {
            if (m.id === id) {
                const updated = updater(m);
                // 결과 자동 계산
                const result = updated.score.home > updated.score.away ? "win" :
                    updated.score.home < updated.score.away ? "loss" : "draw";
                return { ...updated, result };
            }
            return m;
        }));
        setChangedIds(prev => new Set(prev).add(id));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        if (pendingDeletes.length === 0 && changedIds.size === 0) {
            setHasChanges(false);
            return;
        }

        setIsSavingChanges(true);
        try {
            // 삭제 처리
            if (pendingDeletes.length > 0) {
                await Promise.all(pendingDeletes.map(id => deleteMatch(Number(id))));
            }

            // 수정 처리 (로그/스코어 보관을 위해 description 업데이트)
            if (changedIds.size > 0) {
                const updates = Array.from(changedIds).map(id => {
                    const match = matches.find(m => m.id === id);
                    if (!match) return Promise.resolve();

                    const recordData = JSON.stringify({
                        score: match.score,
                        logs: match.logs
                    });

                    return updateMatch({
                        variables: {
                            input: {
                                id: Number(id),
                                description: recordData
                            }
                        }
                    });
                });
                await Promise.all(updates);
            }

            setPendingDeletes([]);
            setChangedIds(new Set());
            setHasChanges(false);
            alert("변경사항이 성공적으로 저장되었습니다.");
        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingChanges(false);
        }
    };

    // 화면에 보여줄 매치 필터링 (임시 삭제된 것 제외)
    const visibleMatches = matches.filter(m => !pendingDeletes.includes(m.id));

    return (
        <>
            <div className="px-4 md:px-6 pt-6 pb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">경기 기록 관리</h1>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        size="s"
                        className="bg-primary text-black font-black flex items-center gap-1.5 px-4 shadow-xl shadow-primary/10"
                        onClick={() => setViewMode("IN_HOUSE")}
                    >
                        <Plus size={16} strokeWidth={3} />
                        내전 등록
                    </Button>
                </div>
            </div>
            <div className="px-4 md:px-6 pb-6 flex flex-col gap-6">

                <div className="flex flex-col gap-3">
                    {visibleMatches.length === 0 ? (
                        <div className="py-20 text-center text-gray-500">등록된 경기 기록이 없습니다.</div>
                    ) : visibleMatches.map((match) => (
                        <div key={match.id} className="flex flex-col bg-[#1a1a1a] border border-[#3e3e3e] rounded-[12px] overflow-hidden">
                            {/* 헤더 카드 */}
                            <div
                                onClick={() => toggleExpand(match.id)}
                                className="p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-2 md:gap-8 min-w-0">
                                    <span className="text-[10px] md:text-xs text-gray-500 font-mono shrink-0">{match.date}</span>
                                    <div className="flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden">
                                        <span className="text-xs md:text-base font-bold text-white truncate">vs {match.opponent}</span>
                                        {match.score && (
                                            <span className="hidden md:inline md:text-base font-bold text-white shrink-0">
                                                {match.score.home} - {match.score.away}
                                            </span>
                                        )}
                                        {match.result && <ResultBadge result={match.result} />}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className={cn("p-2 text-gray-500 hover:text-white transition-all", match.expanded && "rotate-180")}
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* 확장된 상세 정보 */}
                            {match.expanded && (
                                <div className="px-4 md:px-6 pb-4 md:px-6 md:pb-6">
                                    <div className="bg-[#131312] rounded-[12px] p-4 md:p-6 flex flex-col gap-8 w-full">
                                        {/* 쿼터별 스코어 그리드 */}
                                        <div className="flex flex-col gap-4 w-full">
                                            <h4 className="text-[14px] font-bold text-white">쿼터별 스코어</h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                                                {[1, 2, 3, 4].map(q => {
                                                    const qLogs = match.logs[q] || [];
                                                    const homeGoals = qLogs.filter(l => l.type === "goal").length;
                                                    const awayGoals = qLogs.filter(l => l.type === "conceded").length;
                                                    return (
                                                        <div key={`grid-${q}`} className="border border-[#3e3e3e] flex flex-col gap-2 p-3 rounded-[10px]">
                                                            <p className="text-[12px] text-[#666] font-medium">{q}쿼터</p>
                                                            <p className="text-[20px] text-white font-black">{homeGoals} - {awayGoals}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* 타임라인 목록 */}
                                        <div className="relative pl-6 pt-2 pb-4 space-y-6">
                                            {/* 중앙 대시 라인 */}
                                            <div className="absolute left-[39px] top-4 bottom-2 w-[1px] border-l border-dashed border-[#3e3e3e] z-0" />

                                            {[1, 2, 3, 4].map(q => {
                                                const qLogs = match.logs[q] || [];

                                                return (
                                                    <div key={`timeline-${q}`} className="flex flex-col gap-4 relative z-10">
                                                        {/* Q Indicator & Add Buttons */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4 -ml-6">
                                                                <div className="flex items-center justify-center w-[44px] h-[44px] bg-black border border-[#2a2a2a] rounded-full text-[14px] font-bold text-white shrink-0">
                                                                    {q}Q
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedQuarter(q);
                                                                        setActiveMatchId(match.id);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all"
                                                                >
                                                                    <Plus size={10} /> 득점
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const randomName = ENEMY_PLAYERS[Math.floor(Math.random() * ENEMY_PLAYERS.length)];
                                                                        const newLogs = { ...match.logs };
                                                                        newLogs[q] = [
                                                                            ...(newLogs[q] || []),
                                                                            {
                                                                                id: crypto.randomUUID(),
                                                                                type: "conceded",
                                                                                player: { id: "enemy", name: randomName, profileImage: "" }
                                                                            }
                                                                        ];
                                                                        updateMatchData(match.id, m => ({
                                                                            ...m,
                                                                            logs: newLogs,
                                                                            score: { ...m.score, away: m.score.away + 1 }
                                                                        }));
                                                                    }}
                                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold hover:bg-red-500/20 transition-all"
                                                                >
                                                                    <Plus size={10} /> 실점
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Logs for this Q */}
                                                        <div className="flex flex-col gap-2 pl-8">
                                                            {qLogs.map(log => (
                                                                <div key={log.id} className="flex gap-3 items-start justify-between p-2 rounded-xl group hover:bg-white/5 transition-colors -ml-2">
                                                                    <div className="flex gap-3">
                                                                        <div className="shrink-0 mt-0.5 relative">
                                                                            {log.type === "conceded" && (
                                                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center z-10 border border-[#222]">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                                                </div>
                                                                            )}
                                                                            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#222] border border-[#3e3e3e]">
                                                                                <Image
                                                                                    src={getValidImageSrc(log.player?.profileImage)}
                                                                                    alt={log.player?.name || "알 수 없음"}
                                                                                    width={20} height={20}
                                                                                    className="object-cover w-full h-full"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <span className={cn("text-[12px] font-bold", log.type === "goal" ? "text-gray-300" : "text-red-400")}>
                                                                                    {log.type === "goal" ? "득점" : "실점"}
                                                                                </span>
                                                                                <span className="text-[14px] font-semibold text-white">
                                                                                    {log.type === "goal" ? log.player?.name : (log.player?.name || match.opponent)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-[2px]">
                                                                                {log.assist && (
                                                                                    <div className="flex items-center gap-1.5 text-[11px]">
                                                                                        <span className="text-gray-500 font-medium">도움</span>
                                                                                        <span className="text-[#a6a5a5]">{log.assist.name}</span>
                                                                                    </div>
                                                                                )}
                                                                                {log.preAssist && (
                                                                                    <div className="flex items-center gap-1.5 text-[11px]">
                                                                                        <span className="text-gray-500 font-medium">기점</span>
                                                                                        <span className="text-[#a6a5a5]">{log.preAssist.name}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Edit/Delete Actions */}
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {log.type === "goal" && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSelectedQuarter(q);
                                                                                    setActiveMatchId(match.id);
                                                                                    setIsModalOpen(true);
                                                                                }}
                                                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                                            >
                                                                                <Edit2 size={12} />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const parts = [];
                                                                                if (log.player) parts.push(`${log.player.name}골`);
                                                                                else if (log.type === "conceded") parts.push("실점");
                                                                                if (log.assist) parts.push(`${log.assist.name}어시`);

                                                                                setLogToDelete({
                                                                                    matchId: match.id,
                                                                                    quarter: q,
                                                                                    logId: log.id,
                                                                                    description: `${q}Q ${parts.join(" ")}`
                                                                                });
                                                                            }}
                                                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {qLogs.length === 0 && (
                                                                <div className="py-2 text-[10px] text-gray-600/50 uppercase tracking-widest pl-2">
                                                                    No Logs
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <PlayerSelectModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setActiveMatchId(null);
                    }}
                    players={teamPlayers}
                    currentQuarter={selectedQuarter}
                    onShowSummary={() => setShowFullSummary(true)}
                    onSave={(saveData) => {
                        if (!activeMatchId) return;

                        const goalPlayer = teamPlayers.find(p => p.id === saveData.goalId);
                        const assistPlayer = teamPlayers.find(p => p.id === saveData.assistId);
                        const preAssistPlayer = teamPlayers.find(p => p.id === saveData.preAssistId);

                        const newLog: ScoreLog = {
                            id: crypto.randomUUID(),
                            type: "goal",
                            player: goalPlayer,
                            assist: assistPlayer,
                            preAssist: preAssistPlayer
                        };

                        updateMatchData(activeMatchId, m => {
                            const newLogs = { ...m.logs };
                            newLogs[selectedQuarter] = [...(newLogs[selectedQuarter] || []), newLog];
                            return {
                                ...m,
                                logs: newLogs,
                                score: { ...m.score, home: m.score.home + 1 }
                            };
                        });
                    }}
                    onSaveText={(parsedLogs) => {
                        if (!activeMatchId) return;

                        updateMatchData(activeMatchId, m => {
                            const newLogs = { ...m.logs };
                            let homeScoreAdd = 0;

                            parsedLogs.forEach(log => {
                                const { quarter, ...logData } = log;
                                newLogs[quarter] = [...(newLogs[quarter] || []), logData];
                                homeScoreAdd++;
                            });

                            return {
                                ...m,
                                logs: newLogs,
                                score: { ...m.score, home: m.score.home + homeScoreAdd }
                            };
                        });
                    }}
                />

                {/* 전체 쿼터 요약 모달 */}
                {showFullSummary && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">전체 경기 요약 (쿼터별 득점)</h2>
                                <button onClick={() => setShowFullSummary(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
                                {visibleMatches.map(match => (
                                    <div key={match.id} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-primary">vs {match.opponent} ({match.date})</h3>
                                            <span className="text-xs font-bold text-white">{match.score.home} : {match.score.away}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map(q => {
                                                const quarterLogs = match.logs[q] || [];
                                                const goals = quarterLogs.filter(l => l.type === "goal");
                                                if (goals.length === 0) return null;
                                                return (
                                                    <div key={q} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                                        <div className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">{q}QUARTER</div>
                                                        <div className="space-y-2">
                                                            {goals.map((log, idx) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                                    <span className="text-xs text-white font-bold">{log.player?.name}</span>
                                                                    {log.assist && <span className="text-[10px] text-gray-500">(도움: {log.assist.name})</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="h-px bg-white/5 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 삭제 확인 모달 */}
                {logToDelete && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                        <div className="w-full max-w-sm bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                                <Trash2 size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-black text-white mb-2">기록 삭제 확인</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                <span className="text-white font-bold bg-white/5 px-2 py-1 rounded-lg">{logToDelete.description}</span>
                                <br /><br />
                                정말로 이 기록을 삭제하시겠습니까?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setLogToDelete(null)}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 transition-all"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => {
                                        updateMatchData(logToDelete.matchId, m => {
                                            const newLogs = { ...m.logs };
                                            const removedLog = newLogs[logToDelete.quarter]?.find(l => l.id === logToDelete.logId);
                                            newLogs[logToDelete.quarter] = (newLogs[logToDelete.quarter] || []).filter(l => l.id !== logToDelete.logId);

                                            // 스코어 차감
                                            let { home, away } = m.score;
                                            if (removedLog?.type === "goal") home = Math.max(0, home - 1);
                                            else if (removedLog?.type === "conceded") away = Math.max(0, away - 1);

                                            return { ...m, logs: newLogs, score: { home, away } };
                                        });
                                        setLogToDelete(null);
                                    }}
                                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 하단 저장 바 - 변경사항이 있을 때만 노출 (모바일 겹침 방지를 위해 bottom-20 속성 적용 및 무조건 가로 나열) */}
                {hasChanges && (
                    <div className="fixed bottom-20 md:bottom-0 justify-center md:justify-between left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 flex flex-row items-center gap-3 md:px-12 animate-in slide-in-from-bottom duration-300">
                        <p className="text-[11px] md:text-sm text-gray-400 font-medium whitespace-nowrap truncate w-full md:w-auto">
                            변경사항이 있습니다
                            <span className="hidden md:inline">. 저장하지 않으면 사라집니다.</span>
                        </p>
                        <div className="flex flex-row gap-2 shrink-0">
                            <button
                                disabled={isSavingChanges}
                                onClick={handleReset}
                                className="px-4 py-2.5 rounded-xl border border-white/10 text-white text-[11px] md:text-sm font-bold hover:bg-white/5 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                초기화
                            </button>
                            <button
                                disabled={isSavingChanges}
                                onClick={handleSaveChanges}
                                className="px-4 py-2.5 rounded-xl bg-primary text-black text-[11px] md:text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 whitespace-nowrap w-[90px] md:w-auto"
                            >
                                {isSavingChanges ? "저장 중..." : "저장하기"}
                            </button>
                        </div>
                    </div>
                )}
                <div className="h-24" />
            </div>
        </>
    );
}

export default function MatchRecordManagementPanel() {
    const { selectedTeamIdNum } = useSelectedTeamId();

    if (!selectedTeamIdNum) {
        return <div className="p-8 text-center text-gray-500">팀을 선택해주세요.</div>;
    }

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">경기 기록 로딩 중...</div>}>
            <MatchRecordManagementPanelInner teamId={selectedTeamIdNum} />
        </Suspense>
    );
}
