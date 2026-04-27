"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Download, Upload, AlertTriangle, Trash2, Edit2, Check, X,
  FileSpreadsheet, ChevronDown, ChevronLeft, ChevronRight, Calendar,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PastRecord {
  id: string;
  number: string;
  name: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  wins: number;
  draws: number;
  losses: number;
}

interface YearData {
  year: number;
  records: PastRecord[];
  savedAt: string;
}

type SavedStore = Record<number, YearData>;

const STORAGE_KEY = "past_records_v2";
const REQUIRED_HEADERS = ["등번호", "이름", "골", "어시", "클린시트", "승", "무", "패"];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadStore(): SavedStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveStore(store: SavedStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function parseExcelRows(rows: any[][]): { records: PastRecord[]; errors: string[] } {
  const records: PastRecord[] = [];
  const errors: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const number = String(row[0] ?? "").trim();
    const name = String(row[1] ?? "").trim();
    if (!number && !name) continue;
    if (!number || !name) { errors.push(`${i + 2}행: 등번호/이름 필수`); continue; }
    records.push({
      id: crypto.randomUUID(), number, name,
      goals: Number(row[2]) || 0, assists: Number(row[3]) || 0,
      cleanSheets: Number(row[4]) || 0, wins: Number(row[5]) || 0,
      draws: Number(row[6]) || 0, losses: Number(row[7]) || 0,
    });
  }
  return { records, errors };
}

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    REQUIRED_HEADERS,
    ["10", "홍길동", 5, 3, 2, 8, 2, 2],
    ["7", "김철수", 12, 6, 0, 10, 1, 1],
  ]);
  ws["!cols"] = REQUIRED_HEADERS.map(() => ({ wch: 12 }));
  XLSX.utils.book_append_sheet(wb, ws, "과거기록");
  XLSX.writeFile(wb, "과거기록_양식.xlsx");
}

// ─── Year Picker Modal ────────────────────────────────────────────────────────

function YearPickerModal({
  value, onChange, onClose,
}: { value: number | null; onChange: (y: number) => void; onClose: () => void }) {
  const [decade, setDecade] = useState(Math.floor((value ?? CURRENT_YEAR) / 10) * 10);
  const decades = Array.from({ length: 4 }, (_, i) => decade - 10 + i * 10);
  const yearsInDecade = Array.from({ length: 10 }, (_, i) => decade + i).filter(y => y >= 2000 && y <= CURRENT_YEAR);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#181818] border border-white/10 rounded-3xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-black text-white tracking-tight">연도 선택</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        {/* 연대 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setDecade(d => Math.max(2000, d - 10))}
            disabled={decade <= 2000}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
            {decade}s
          </span>
          <button
            onClick={() => setDecade(d => Math.min(CURRENT_YEAR - (CURRENT_YEAR % 10), d + 10))}
            disabled={decade + 10 > CURRENT_YEAR}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 연도 그리드 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {yearsInDecade.map(y => (
            <button
              key={y}
              onClick={() => { onChange(y); onClose(); }}
              className={cn(
                "py-2.5 rounded-xl text-sm font-black transition-all",
                value === y
                  ? "bg-primary text-black scale-105 shadow-lg shadow-primary/30"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {y}
            </button>
          ))}
        </div>

        {/* 빠른 선택 */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2">최근</p>
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.slice(0, 5).map(y => (
              <button
                key={y}
                onClick={() => { onChange(y); onClose(); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  value === y ? "bg-primary text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NumInput ─────────────────────────────────────────────────────────────────

function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => { setDisplay(String(value)); }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onFocus={e => e.target.select()}
      onChange={e => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setDisplay(raw);
        onChange(raw === "" ? 0 : parseInt(raw, 10));
      }}
      onBlur={() => setDisplay(String(value))}
      className="w-14 bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-primary/50"
    />
  );
}

// ─── Data Table (공유 컴포넌트) ───────────────────────────────────────────────

function RecordTable({
  rows, editable = false,
  onEdit, onCancelEdit, onConfirmEdit, onDelete, onUpdateField,
}: {
  rows: (PastRecord & { editing?: boolean })[];
  editable?: boolean;
  onEdit?: (id: string) => void;
  onCancelEdit?: (id: string) => void;
  onConfirmEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
  onUpdateField?: (id: string, field: keyof PastRecord, value: string | number) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {["등번호", "이름", "골", "어시", "클린시트", "승", "무", "패", ...(editable ? [""] : [])].map((h, i) => (
              <th key={i} className="px-4 py-3 text-[10px] font-black text-gray-600 uppercase tracking-widest text-left first:pl-6 last:pr-6 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
              {row.editing ? (
                <>
                  <td className="px-4 py-2 pl-6">
                    <input value={row.number} onFocus={e => e.target.select()}
                      onChange={e => onUpdateField?.(row.id, "number", e.target.value)}
                      className="w-16 bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={row.name} onFocus={e => e.target.select()}
                      onChange={e => onUpdateField?.(row.id, "name", e.target.value)}
                      className="w-28 bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50" />
                  </td>
                  {(["goals", "assists", "cleanSheets", "wins", "draws", "losses"] as (keyof PastRecord)[]).map(f => (
                    <td key={f} className="px-4 py-2">
                      <NumInput value={row[f] as number} onChange={v => onUpdateField?.(row.id, f, v)} />
                    </td>
                  ))}
                  <td className="px-4 py-2 pr-6">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onConfirmEdit?.(row.id)} className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                        <Check size={14} />
                      </button>
                      <button onClick={() => onCancelEdit?.(row.id)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 pl-6 text-gray-400 font-bold text-xs">{row.number}</td>
                  <td className="px-4 py-3 text-white font-bold text-sm">{row.name}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{row.goals}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{row.assists}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{row.cleanSheets}</td>
                  <td className="px-4 py-3 text-blue-400 text-xs font-bold">{row.wins}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.draws}</td>
                  <td className="px-4 py-3 text-red-400 text-xs">{row.losses}</td>
                  {editable && (
                    <td className="px-4 py-3 pr-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit?.(row.id)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete?.(row.id, row.name)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Mobile Guard ─────────────────────────────────────────────────────────────

export default function PastRecordsPanel() {
  const isMobile = useIsMobile(1023);
  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <FileSpreadsheet size={48} className="text-gray-600" />
        <h2 className="text-lg font-bold text-white">PC에서만 사용 가능합니다</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          과거 기록 연동은 엑셀 파일 업로드가 필요하여<br />PC 환경에서만 이용하실 수 있습니다.
        </p>
      </div>
    );
  }
  return <PastRecordsPanelInner />;
}

// ─── Inner Panel ──────────────────────────────────────────────────────────────

function PastRecordsPanelInner() {
  const [store, setStore] = useState<SavedStore>({});
  const [pendingRecords, setPendingRecords] = useState<(PastRecord & { editing: boolean })[]>([]);
  const [pendingYear, setPendingYear] = useState<number | null>(CURRENT_YEAR);
  const [viewYear, setViewYear] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadStore();
    setStore(saved);
    const years = Object.keys(saved).map(Number).sort((a, b) => b - a);
    if (years.length > 0) setViewYear(years[0]);
  }, []);

  const savedYears = Object.keys(store).map(Number).sort((a, b) => b - a);
  const hasSavedData = savedYears.length > 0;
  const hasPending = pendingRecords.length > 0;

  // ── 파일 처리 ──────────────────────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) { alert("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (rows.length < 2) { alert("데이터가 없습니다."); return; }
        const header = (rows[0] as string[]).map(h => String(h).trim());
        const missing = REQUIRED_HEADERS.filter(h => !header.includes(h));
        if (missing.length > 0) { alert(`누락된 열: ${missing.join(", ")}\n엑셀 양식을 다운받아 사용해주세요.`); return; }
        const colIdx = REQUIRED_HEADERS.map(h => header.indexOf(h));
        const dataRows = rows.slice(1).map(row => colIdx.map(i => row[i]));
        const { records: parsed, errors } = parseExcelRows(dataRows);
        setParseErrors(errors);
        setPendingRecords(parsed.map(r => ({ ...r, editing: false })));
        setPendingYear(CURRENT_YEAR);
        if (errors.length > 0) alert(`파일을 불러왔습니다.\n\n⚠️ 오류 행:\n${errors.join("\n")}`);
      } catch { alert("파일을 읽는 중 오류가 발생했습니다."); }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  // ── 미리보기 편집 ──────────────────────────────────────────────────────────

  const startEdit = (id: string) => setPendingRecords(prev => prev.map(r => ({ ...r, editing: r.id === id })));
  const cancelEdit = (id: string) => setPendingRecords(prev => prev.map(r => r.id === id ? { ...r, editing: false } : r));
  const confirmEdit = (id: string) => setPendingRecords(prev => prev.map(r => r.id === id ? { ...r, editing: false } : r));
  const updateField = (id: string, field: keyof PastRecord, value: string | number) =>
    setPendingRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const deletePending = (id: string, name: string) => {
    if (!confirm(`"${name}" 데이터를 삭제하시겠습니까?`)) return;
    setPendingRecords(prev => prev.filter(r => r.id !== id));
  };

  // ── 저장된 데이터 편집 ─────────────────────────────────────────────────────

  const [editingView, setEditingView] = useState<Record<string, boolean>>({});

  const startViewEdit = (id: string) => setEditingView(prev => ({ ...prev, [id]: true }));
  const cancelViewEdit = (id: string) => setEditingView(prev => ({ ...prev, [id]: false }));
  const confirmViewEdit = (id: string) => setEditingView(prev => ({ ...prev, [id]: false }));

  const updateViewField = (year: number, id: string, field: keyof PastRecord, value: string | number) => {
    setStore(prev => {
      const updated = { ...prev };
      updated[year] = {
        ...updated[year],
        records: updated[year].records.map(r => r.id === id ? { ...r, [field]: value } : r),
      };
      saveStore(updated);
      return { ...updated };
    });
  };

  const deleteViewRecord = (year: number, id: string, name: string) => {
    if (!confirm(`"${name}" 데이터를 삭제하시겠습니까?`)) return;
    setStore(prev => {
      const updated = { ...prev };
      const remaining = updated[year].records.filter(r => r.id !== id);
      if (remaining.length === 0) {
        delete updated[year];
        const newYears = Object.keys(updated).map(Number).sort((a, b) => b - a);
        setViewYear(newYears[0] ?? null);
      } else {
        updated[year] = { ...updated[year], records: remaining };
      }
      saveStore(updated);
      return { ...updated };
    });
  };

  // ── 저장 ──────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (pendingRecords.length === 0) { alert("저장할 데이터가 없습니다."); return; }
    if (!pendingYear) { alert("연도를 선택해주세요."); setShowYearPicker(true); return; }
    const confirmed = confirm(
      `⚠️ 과거 기록 저장 안내\n\n${pendingYear}년 데이터를 저장합니다.\n이 데이터는 참고용이며 실제 오버롤 스탯에 반영되지 않습니다.\n\n저장하시겠습니까?`
    );
    if (!confirmed) return;
    const newEntry: YearData = {
      year: pendingYear,
      records: pendingRecords.map(({ editing: _e, ...r }) => r),
      savedAt: new Date().toISOString(),
    };
    const updated = { ...store, [pendingYear]: newEntry };
    saveStore(updated);
    setStore(updated);
    setViewYear(pendingYear);
    setPendingRecords([]);
    setPendingYear(CURRENT_YEAR);
    setParseErrors([]);
  };

  // ─────────────────────────────────────────────────────────────────────────

  const viewRecords: (PastRecord & { editing: boolean })[] =
    viewYear != null && store[viewYear]
      ? store[viewYear].records.map(r => ({ ...r, editing: editingView[r.id] ?? false }))
      : [];

  return (
    <div className="flex flex-col h-full min-h-screen bg-black text-white">
      {/* 헤더 */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">과거 기록 연동</h1>
      </div>

      <div className="flex-1 px-4 md:px-6 pb-36 space-y-5">
        {/* 안내 배너 */}
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-4">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-300 leading-relaxed font-medium">
            과거 데이터는 <span className="font-black">참고용 데이터</span>입니다.
            실제 오버롤 스탯에는 반영되지 않습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-3">
          <button onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm font-bold text-white hover:border-white/20 hover:bg-white/5 transition-all">
            <Download size={16} /> 엑셀 양식 다운로드
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black text-sm font-bold hover:opacity-90 transition-all">
            <Upload size={16} /> 파일 첨부
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls"
            onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }}
            className="hidden" />
        </div>

        {/* 드래그 앤 드롭 (데이터 없을 때) */}
        {!hasPending && (
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-10 cursor-pointer transition-all",
              isDragging ? "border-primary/60 bg-primary/5" : "border-white/10 bg-[#0e0e0e] hover:border-white/20"
            )}
          >
            <FileSpreadsheet size={36} className={isDragging ? "text-primary" : "text-gray-600"} />
            <div className="text-center">
              <p className="text-sm font-bold text-gray-400">엑셀 파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-600 mt-1">.xlsx, .xls 형식 지원</p>
            </div>
          </div>
        )}

        {/* ── 미리보기 (업로드 후, 저장 전) ─────────────────────────────── */}
        {hasPending && (
          <div className="bg-[#0e0e0e] rounded-3xl border border-white/5 overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-bold text-white shrink-0">미리보기</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full shrink-0">{pendingRecords.length}명</span>
              </div>

              {/* 연도 선택 */}
              <button
                onClick={() => setShowYearPicker(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black transition-all shrink-0",
                  pendingYear
                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                )}
              >
                <Calendar size={14} />
                {pendingYear ? `${pendingYear}년` : "연도 선택"}
                <ChevronDown size={13} />
              </button>

              <button
                onClick={() => { setPendingRecords([]); setParseErrors([]); }}
                className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                <X size={14} /> 취소
              </button>
            </div>

            <RecordTable
              rows={pendingRecords}
              editable
              onEdit={startEdit}
              onCancelEdit={cancelEdit}
              onConfirmEdit={confirmEdit}
              onDelete={deletePending}
              onUpdateField={updateField}
            />

            <div className="px-6 py-3 border-t border-white/5">
              <button onClick={() => fileInputRef.current?.click()}
                className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1.5">
                <Upload size={12} /> 다른 파일 업로드
              </button>
            </div>
          </div>
        )}

        {parseErrors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-xs font-bold text-red-400">파싱 오류 ({parseErrors.length}건)</span>
            </div>
            {parseErrors.map((e, i) => <p key={i} className="text-xs text-red-300">{e}</p>)}
          </div>
        )}

        {/* ── 저장된 데이터 뷰어 ──────────────────────────────────────────── */}
        {hasSavedData && !hasPending && (
          <div className="bg-[#0e0e0e] rounded-3xl border border-white/5 overflow-hidden">
            {/* 연도 탭 */}
            <div className="flex items-center gap-0.5 px-4 pt-4 pb-0 border-b border-white/5 overflow-x-auto scrollbar-hide">
              {savedYears.map(y => (
                <button
                  key={y}
                  onClick={() => setViewYear(y)}
                  className={cn(
                    "px-5 py-2.5 text-sm font-black rounded-t-xl transition-all whitespace-nowrap shrink-0 border-b-2",
                    viewYear === y
                      ? "text-primary border-primary bg-primary/5"
                      : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/3"
                  )}
                >
                  {y}년
                </button>
              ))}
            </div>

            {/* 연도별 데이터 */}
            {viewYear != null && store[viewYear] && (
              <>
                <div className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">과거 데이터</span>
                    <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">{store[viewYear].records.length}명</span>
                  </div>
                  <span className="text-[10px] text-gray-600">
                    저장: {new Date(store[viewYear].savedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <RecordTable
                  rows={viewRecords}
                  editable
                  onEdit={startViewEdit}
                  onCancelEdit={cancelViewEdit}
                  onConfirmEdit={confirmViewEdit}
                  onDelete={(id, name) => deleteViewRecord(viewYear, id, name)}
                  onUpdateField={(id, field, value) => updateViewField(viewYear, id, field, value)}
                />

                <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1.5">
                    <Upload size={12} /> 새 파일 업로드
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm(`${viewYear}년 전체 데이터를 삭제하시겠습니까?`)) return;
                      setStore(prev => {
                        const updated = { ...prev };
                        delete updated[viewYear];
                        saveStore(updated);
                        const newYears = Object.keys(updated).map(Number).sort((a, b) => b - a);
                        setViewYear(newYears[0] ?? null);
                        return { ...updated };
                      });
                    }}
                    className="text-xs text-red-500/60 hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={12} /> {viewYear}년 전체 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 하단 저장 바 */}
      {hasPending && (
        <div className="fixed left-0 right-0 z-60 bg-[#0e0e0e]/95 backdrop-blur-3xl border-t border-white/5 px-4 md:px-8 flex items-center justify-between gap-3 box-border h-16 md:h-20"
          style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center gap-2 text-[10px] md:text-sm text-yellow-300 font-bold">
            <AlertTriangle size={14} className="text-yellow-400 shrink-0" />
            <span className="hidden sm:inline">오버롤에 반영되지 않는 참고용 데이터입니다</span>
            <span className="sm:hidden">참고용 데이터 (오버롤 미반영)</span>
          </div>
          <button onClick={handleSave}
            className="px-6 md:px-10 py-2 md:py-2.5 rounded-xl bg-primary text-black text-[10px] md:text-xs font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
            저장하기
          </button>
        </div>
      )}

      {/* Year Picker Modal */}
      {showYearPicker && (
        <YearPickerModal
          value={pendingYear}
          onChange={setPendingYear}
          onClose={() => setShowYearPicker(false)}
        />
      )}
    </div>
  );
}
