"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface PlayerStat {
  id: string;
  backNumber: number;
  name: string;
  profileImage: string;
  position: string;
  attendance: number;
  goals: number;
  assists: number;
  gaPoints: number;
  yellowCards: number;
  wins: number;
  draws: number;
  losses: number;
}

// ──────────────────────────────────────────────
// Mock 데이터
// ──────────────────────────────────────────────
const POSITIONS = ["SS","MM","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL"];
const NAMES = [
  "이름최다여섯","김철수","박명희","최지훈","이수민",
  "장민호","오세훈","한지민","권민지","이상호",
  "조아라","김진수","박서준","한지우",
];

const INITIAL_PLAYERS: PlayerStat[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  backNumber: 99 + i,
  name: NAMES[i],
  profileImage: "/images/ovr.png",
  position: POSITIONS[i],
  attendance: 10 + (i % 6),
  goals: (i * 3) % 8,
  assists: (i * 2) % 12,
  gaPoints: (i * 5) % 8,
  yellowCards: (i * 7) % 13,
  wins: (i * 4) % 9,
  draws: i % 4,
  losses: (i * 6) % 10,
}));

// ──────────────────────────────────────────────
// 통계 컬럼 정의
// ──────────────────────────────────────────────
const COLUMNS: { key: keyof PlayerStat; label: string }[] = [
  { key: "attendance", label: "출석" },
  { key: "goals", label: "득점" },
  { key: "assists", label: "도움" },
  { key: "gaPoints", label: "기점" },
  { key: "yellowCards", label: "클린시트" },
  { key: "wins", label: "승" },
  { key: "draws", label: "무" },
  { key: "losses", label: "패" },
];

// ──────────────────────────────────────────────
// 변경 사항 타입
// ──────────────────────────────────────────────
interface ChangeItem {
  playerName: string;
  field: string;
  before: number;
  after: number;
}

// ──────────────────────────────────────────────
// 포지션 뱃지
// ──────────────────────────────────────────────
const PosBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center justify-center rounded border border-[#c0392b]/80 text-[#e74c3c] text-[10px] font-bold leading-none px-1.5 py-[3px] min-w-[28px]">
    {label}
  </span>
);

// ──────────────────────────────────────────────
// 편집 가능한 숫자 셀
// ──────────────────────────────────────────────
const EditCell = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <input
    type="number"
    value={value}
    min={0}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
    className="w-12 text-center bg-transparent border border-white/30 rounded text-white text-xs py-1 outline-none focus:border-primary/70 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  />
);

// ──────────────────────────────────────────────
// 변경사항 확인 모달
// ──────────────────────────────────────────────
function SavePreviewModal({
  changes,
  onConfirm,
  onCancel,
}: {
  changes: ChangeItem[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // 선수별로 그룹화
  const grouped = changes.reduce<Record<string, ChangeItem[]>>((acc, ch) => {
    if (!acc[ch.playerName]) acc[ch.playerName] = [];
    acc[ch.playerName].push(ch);
    return acc;
  }, {});
  const playerNames = Object.keys(grouped);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white">변경사항 확인</h2>
            <p className="text-xs text-gray-500 mt-0.5">저장 전 변경된 내용을 확인해주세요</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 선수별 카드 목록 */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin px-6 py-4 space-y-3">
          {playerNames.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">변경된 항목이 없습니다.</p>
          ) : (
            playerNames.map((name) => (
              <div key={name} className="bg-[#2a2a2a] rounded-xl px-4 py-3 space-y-2">
                {/* 선수 이름 */}
                <p className="text-xs font-bold text-white mb-1">{name}</p>
                {/* 변경 항목들 */}
                {grouped[name].map((ch, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 bg-[#1a1a1a] px-2 py-0.5 rounded-md">
                      {ch.field}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-gray-400">{ch.before}</span>
                      <span className="text-gray-600">→</span>
                      <span
                        className={
                          ch.after > ch.before
                            ? "text-primary font-bold"
                            : "text-red-400 font-bold"
                        }
                      >
                        {ch.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 text-sm hover:bg-white/5 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────
// Main Panel
// ──────────────────────────────────────────────
export default function PlayerManagementPanel() {
  const [savedPlayers, setSavedPlayers] = useState<PlayerStat[]>(INITIAL_PLAYERS); // 마지막 저장 스냅샷
  const [players, setPlayers] = useState<PlayerStat[]>(INITIAL_PLAYERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<PlayerStat>>({});
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = players.filter(
    (p) => p.name.includes(searchTerm) || String(p.backNumber).includes(searchTerm)
  );

  /** 버퍼를 players에 반영 */
  const flushBuffer = (id: string, buf: Partial<PlayerStat>): PlayerStat[] => {
    const updated = players.map((p) => (p.id === id ? { ...p, ...buf } : p));
    setPlayers(updated);
    return updated;
  };

  const handleRowClick = (player: PlayerStat) => {
    if (editingId === player.id) return;
    if (editingId) flushBuffer(editingId, editBuffer);
    setEditingId(player.id);
    setEditBuffer({ ...player });
  };

  const updateBuffer = (field: keyof PlayerStat, value: number) => {
    setEditBuffer((prev) => ({ ...prev, [field]: value }));
    setHasUnsaved(true);
  };

  /** 저장 버튼 클릭 → 변경사항 계산 후 모달 표시 */
  const handleSaveClick = () => {
    // 현재 편집 중인 버퍼 반영
    let latestPlayers = players;
    if (editingId) {
      latestPlayers = flushBuffer(editingId, editBuffer);
    }

    // 변경사항 계산 (savedPlayers와 비교)
    const changes: ChangeItem[] = [];
    const statKeys = COLUMNS.map((c) => c.key);

    latestPlayers.forEach((current) => {
      const original = savedPlayers.find((p) => p.id === current.id);
      if (!original) return;
      statKeys.forEach((key) => {
        const before = original[key] as number;
        const after = current[key] as number;
        if (before !== after) {
          changes.push({
            playerName: current.name,
            field: COLUMNS.find((c) => c.key === key)?.label ?? String(key),
            before,
            after,
          });
        }
      });
    });

    setShowPreview(true);
    // changes를 모달로 전달하기 위해 상태로 저장
    setPendingChanges(changes);
  };

  const [pendingChanges, setPendingChanges] = useState<ChangeItem[]>([]);

  const handleConfirmSave = () => {
    setSavedPlayers([...players]);
    setEditingId(null);
    setEditBuffer({});
    setHasUnsaved(false);
    setShowPreview(false);
    setPendingChanges([]);
  };

  const handleReset = () => {
    setPlayers(INITIAL_PLAYERS);
    setSavedPlayers(INITIAL_PLAYERS);
    setEditingId(null);
    setEditBuffer({});
    setHasUnsaved(false);
  };

  return (
    <div className={`flex flex-col ${hasUnsaved ? "pb-16" : ""}`}>

      {/* ── 헤더 ── */}
      <div className="px-6 pt-6 pb-5">
        <h1 className="text-lg font-bold text-white mb-5">선수 관리</h1>

        {/* 검색 바 — input과 버튼 분리, 약간의 gap */}
        <div className="flex items-center gap-2 max-w-[380px]">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchInputRef.current?.blur()}
            placeholder="선수 검색"
            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none placeholder:text-gray-600 focus:border-white/20 transition-colors"
          />
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="bg-[#2a2a2a] hover:bg-[#333] border border-white/10 text-gray-300 text-xs px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            검색
          </button>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div className="px-6 pb-20">
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-2xl border border-white/8">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#161616] border-b border-white/8 text-gray-500">
              <th className="py-2.5 px-3 text-left font-medium w-[64px]">등번호</th>
              <th className="py-2.5 px-2 text-left font-medium w-[140px]">이름</th>
              <th className="py-2.5 px-2 text-center font-medium w-[56px]">포지션</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="py-2.5 px-2 text-center font-medium whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => {
              const isEditing = editingId === player.id;
              const buf = isEditing ? editBuffer : player;

              return (
                <tr
                  key={player.id}
                  onClick={() => handleRowClick(player)}
                  className={`border-b border-white/6 cursor-pointer select-none transition-colors ${
                    isEditing ? "bg-[#1c1c1c]" : "hover:bg-white/3"
                  }`}
                >
                  {/* 등번호 */}
                  <td className="py-2.5 px-3 text-gray-400 font-mono">
                    {isEditing ? (
                      <span className="border border-white/20 rounded px-2 py-1 text-white inline-block">
                        {player.backNumber}
                      </span>
                    ) : (
                      player.backNumber
                    )}
                  </td>

                  {/* 이름 + 프로필 */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#2a2a2a] shrink-0">
                        <Image
                          src={player.profileImage}
                          alt={player.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-white font-medium truncate max-w-[80px] text-xs">
                        {player.name}
                      </span>
                    </div>
                  </td>

                  {/* 포지션 */}
                  <td className="py-2.5 px-2 text-center">
                    <PosBadge label={player.position} />
                  </td>

                  {/* 통계 컬럼 */}
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="py-2.5 px-2 text-center">
                      {isEditing ? (
                        <EditCell
                          value={(buf[col.key] as number) ?? 0}
                          onChange={(v) => updateBuffer(col.key, v)}
                        />
                      ) : (
                        <span className="text-gray-300">
                          {player[col.key] as number}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>

      {/* ── 고정 저장 바 ── */}
      {hasUnsaved && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between bg-[#0f0f0f] border-t border-white/10 px-6 py-3">
          <span className="text-xs text-gray-500">
            변경사항이 있습니다. 저장하지 않으면 사라집니다.
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-[#2a2a2a] border border-white/15 text-gray-300 text-xs hover:bg-[#333] transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleSaveClick}
              className="px-5 py-2 rounded-xl bg-primary text-black text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              저장하기
            </button>
          </div>
        </div>
      )}

      {/* ── 변경사항 확인 모달 ── */}
      {showPreview && (
        <SavePreviewModal
          changes={pendingChanges}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
