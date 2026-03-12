"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { TeamRole } from "./TeamManagementSidebar";
import { UNIFORM_DESIGNS, type UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import { useNaverAddressSearch } from "@/hooks/useNaverAddressSearch";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export type MemberRole = "감독" | "선수" | "코치" | "중무";

interface TeamMember {
  id: string;
  name: string;
  number: number;
  mainPos: string;
  subPos?: string;
  age: number;
  joinedAt: string;
  role: MemberRole;
  profileImage: string;
}

// ──────────────────────────────────────────────
// Mock 데이터
// ──────────────────────────────────────────────
const MOCK_MEMBERS: TeamMember[] = Array.from({ length: 13 }, (_, i) => ({
  id: String(i + 1),
  name: "이름최다여섯",
  number: 99,
  mainPos: "SS",
  subPos: "CM",
  age: 30,
  joinedAt: "2026.03.08",
  role: i === 0 ? "감독" : "선수",
  profileImage: "/images/ovr.png",
}));

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

/** 포지션 뱃지 */
const PosBadge = ({ label, type }: { label: string; type: "main" | "sub" }) => (
  <span
    className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold leading-none ${type === "main" ? "bg-[#d4f54a] text-black" : "bg-[#e74c3c] text-white"
      }`}
  >
    {label}
  </span>
);

/** 역할 드롭다운 */
const RoleDropdown = ({
  value,
  onChange,
  disabled,
}: {
  value: MemberRole;
  onChange: (v: MemberRole) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const roles: MemberRole[] = ["감독", "선수", "코치"];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex items-center gap-1 rounded-md bg-[#2a2a2a] border border-white/10 px-2.5 py-1.5 text-xs text-white min-w-[68px] ${disabled ? "opacity-50 cursor-default" : "hover:bg-[#333] cursor-pointer"
          }`}
      >
        <span className="flex-1 text-left">{value}</span>
        {!disabled && (
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="#888"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 min-w-[90px] rounded-lg bg-[#2a2a2a] border border-white/10 shadow-xl overflow-hidden">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-xs transition-colors ${r === value ? "bg-primary/20 text-primary font-bold" : "text-white hover:bg-white/10"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// 유니폼 선택 그리드 (실제 이미지 사용)
// ──────────────────────────────────────────────
const UniformGrid = ({
  selected,
  onSelect,
}: {
  selected: UniformDesign;
  onSelect: (d: UniformDesign) => void;
}) => (
  <div className="grid grid-cols-5 gap-2">
    {UNIFORM_DESIGNS.map(({ design, imagePath, label }) => (
      <button
        key={design}
        type="button"
        onClick={() => onSelect(design)}
        title={label}
        className={`relative flex items-center justify-center rounded-lg border-2 transition-all p-1 ${selected === design
            ? "border-primary bg-primary/10"
            : "border-transparent hover:border-white/20 hover:bg-white/5"
          }`}
      >
        <Image
          src={imagePath}
          alt={label}
          width={44}
          height={44}
          className="object-contain"
        />
        {selected === design && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </button>
    ))}
  </div>
);

// ──────────────────────────────────────────────
// 인라인 장소 검색 컴포넌트
// ──────────────────────────────────────────────
const LocationSearchField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (address: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const {
    inputValue,
    setInputValue,
    searchResults,
    selectedAddress,
    isLoading,
    handleSelect,
  } = useNaverAddressSearch({
    onComplete: (result) => {
      onChange(result.address);
      setOpen(false);
    },
  });

  const handleClickResult = (item: typeof searchResults[number]) => {
    handleSelect(item);
    onChange(item.address);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* 현재 선택된 값 표시 입력창 */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">📍</span>
        <input
          readOnly
          value={value}
          placeholder="경기 장소를 검색하세요"
          onClick={() => setOpen(true)}
          className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none cursor-pointer hover:border-white/30 transition-colors placeholder:text-gray-600 focus:border-primary/60"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* 검색 드롭다운 */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#1e1e1e] border border-white/15 rounded-xl shadow-2xl overflow-hidden">
          {/* 검색 입력창 */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="지역이나 동네로 검색하기"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* 검색 결과 */}
          <div className="max-h-48 overflow-y-auto scrollbar-thin">
            {isLoading ? (
              <div className="px-4 py-3 text-xs text-gray-500 text-center">검색 중...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={`${item.latitude}-${item.longitude}`}
                  type="button"
                  onClick={() => handleClickResult(item)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/8 border-b border-white/5 last:border-none ${selectedAddress?.address === item.address
                      ? "text-primary bg-primary/10"
                      : "text-gray-300"
                    }`}
                >
                  <span className="text-gray-500 mr-2 text-xs">📍</span>
                  {item.address}
                </button>
              ))
            ) : inputValue ? (
              <div className="px-4 py-4 text-xs text-gray-500 text-center">일치하는 주소가 없습니다.</div>
            ) : (
              <div className="px-4 py-4 text-xs text-gray-500 text-center">지역명을 입력해 검색하세요</div>
            )}
          </div>

          {/* 닫기 */}
          <div className="p-2 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// 팀 정보 설정 모달
// ──────────────────────────────────────────────
interface TeamInfoModalProps {
  teamName: string;
  location: string;
  foundedDate: string;
  description: string;
  emblemSrc: string;
  homeDesign: UniformDesign;
  awayDesign: UniformDesign;
  onClose: () => void;
  onSave: (data: {
    teamName: string;
    location: string;
    description: string;
    emblemSrc: string;
    homeDesign: UniformDesign;
    awayDesign: UniformDesign;
  }) => void;
}

function TeamInfoModal({
  teamName: initTeamName,
  location: initLocation,
  foundedDate,
  description: initDesc,
  emblemSrc: initEmblem,
  homeDesign: initHome,
  awayDesign: initAway,
  onClose,
  onSave,
}: TeamInfoModalProps) {
  const [teamName, setTeamName] = useState(initTeamName);
  const [location, setLocation] = useState(initLocation);
  const [description, setDescription] = useState(initDesc);
  const [emblemSrc, setEmblemSrc] = useState(initEmblem);
  const [homeDesign, setHomeDesign] = useState<UniformDesign>(initHome);
  const [awayDesign, setAwayDesign] = useState<UniformDesign>(initAway);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 → 로컬 미리보기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEmblemSrc(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#1e1e1e] px-6 py-5 border-b border-white/10">
          <h2 className="text-base font-bold text-white">팀 정보 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* 클럽 이름 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400">클럽 이름</label>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          {/* 주요 활동 지역 - 네이버 주소 검색 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400">주요 활동 지역</label>
            <LocationSearchField value={location} onChange={setLocation} />
          </div>

          {/* 클럽 창단일 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400">클럽 창단일</label>
            <div className="flex items-center gap-2.5 bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3">
              <span className="text-gray-500">📅</span>
              <span className="text-sm text-gray-400">{foundedDate}</span>
            </div>
          </div>

          {/* 클럽 소개 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400">클럽 소개</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {/* 클럽 엠블럼 - 실제 파일 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400">클럽 엠블럼</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2a2a2a] border border-white/10 shrink-0">
                <Image
                  src={emblemSrc}
                  alt="엠블럼"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* 숨겨진 파일 input - 모바일:앨범, PC:파일탐색기 모두 지원 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:border-white/20 transition-colors text-center"
              >
                📷 앨범/파일에서 사진 선택
              </button>
            </div>
          </div>

          {/* 홈 유니폼 - 실제 이미지 */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400">홈 유니폼</label>
            <UniformGrid selected={homeDesign} onSelect={setHomeDesign} />
          </div>

          {/* 어웨이 유니폼 - 실제 이미지 */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400">어웨이 유니폼</label>
            <UniformGrid selected={awayDesign} onSelect={setAwayDesign} />
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="sticky bottom-0 bg-[#1e1e1e] px-6 py-4 border-t border-white/10">
          <Button
            variant="primary"
            size="m"
            onClick={() =>
              onSave({ teamName, location, description, emblemSrc, homeDesign, awayDesign })
            }
            className="rounded-xl font-bold"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 권한 변경 확인 모달
// ──────────────────────────────────────────────
function RoleChangeModal({
  memberName,
  currentRole,
  newRole,
  onConfirm,
  onCancel,
}: {
  memberName: string;
  currentRole: MemberRole;
  newRole: MemberRole;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs bg-[#2a2a2a] rounded-2xl p-7 shadow-2xl border border-white/10 text-center">
        <h3 className="text-base font-bold text-white mb-3">권한 변경</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-7">
          {memberName}님의{" "}
          <span className="text-gray-300 font-medium">{currentRole}</span> 역할을
          <br />
          <span className="text-white font-bold">{newRole}</span>(으)로 변경합니다.
        </p>
        <div className="flex gap-3">
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
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 선수 방출 확인 모달
// ──────────────────────────────────────────────
function KickModal({
  memberName,
  onConfirm,
  onCancel,
}: {
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs bg-[#2a2a2a] rounded-2xl p-7 shadow-2xl border border-white/10 text-center">
        <h3 className="text-base font-bold text-white mb-3">선수 방출</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-7">
          {memberName}님을
          <br />
          팀에서 방출하시겠습니까?
        </p>
        <div className="flex gap-3">
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
            방출하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Panel
// ──────────────────────────────────────────────
interface TeamSettingsPanelProps {
  userRole: TeamRole;
}

export default function TeamSettingsPanel({ userRole }: TeamSettingsPanelProps) {
  const isManager = userRole === "manager";

  // 팀 정보 상태
  const [teamName, setTeamName] = useState("바르셀로나 FC");
  const [location, setLocation] = useState("서울 강남구");
  const [foundedDate] = useState("2026. 2. 10.");
  const [description, setDescription] = useState("열정과 실력을 겸비한 아마추어 축구팀입니다.");
  const [homeDesign, setHomeDesign] = useState<UniformDesign>("SOLID_RED");
  const [awayDesign, setAwayDesign] = useState<UniformDesign>("STRIPE_BLUE");
  const [emblemSrc, setEmblemSrc] = useState("/images/ovr.png");
  const [inviteLink] = useState("https://ovr-log.com/invite/abc123xyz");

  // 선수단 상태
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);

  // 모달 상태
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [roleModal, setRoleModal] = useState<{
    memberId: string;
    memberName: string;
    currentRole: MemberRole;
    newRole: MemberRole;
  } | null>(null);
  const [kickModal, setKickModal] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => { });
    alert("링크가 복사되었습니다.");
  };

  const handleRoleConfirm = () => {
    if (!roleModal) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === roleModal.memberId ? { ...m, role: roleModal.newRole } : m
      )
    );
    setRoleModal(null);
  };

  const handleKickConfirm = () => {
    if (!kickModal) return;
    setMembers((prev) => prev.filter((m) => m.id !== kickModal.memberId));
    setKickModal(null);
  };

  const handleInfoSave = (data: {
    teamName: string;
    location: string;
    description: string;
    emblemSrc: string;
    homeDesign: UniformDesign;
    awayDesign: UniformDesign;
  }) => {
    setTeamName(data.teamName);
    setLocation(data.location);
    setDescription(data.description);
    setEmblemSrc(data.emblemSrc);
    setHomeDesign(data.homeDesign);
    setAwayDesign(data.awayDesign);
    setShowInfoModal(false);
  };

  // 현재 선택된 유니폼 이미지 경로
  const homeImagePath = UNIFORM_DESIGNS.find((d) => d.design === homeDesign)?.imagePath ?? "";
  const awayImagePath = UNIFORM_DESIGNS.find((d) => d.design === awayDesign)?.imagePath ?? "";

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-4xl mx-auto w-full">
        {/* 페이지 제목 */}
        <h1 className="text-xl font-bold text-white">팀 설정</h1>

        {/* ──── 팀 정보 카드 ──── */}
        <section className="bg-[#1a1a1a] rounded-2xl border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-5 pb-3">
            <h2 className="text-sm font-semibold text-white">팀 정보</h2>
            {isManager && (
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/15 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                팀 정보 설정
              </button>
            )}
          </div>

          <div className="px-4 md:px-6 pb-4 md:pb-6 flex sm:flex-row flex-col gap-4 md:gap-5 items-start">
            {/* 팀 엠블럼 */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2a2a2a] border-2 border-white/15 shrink-0">
              <Image
                src={emblemSrc}
                alt="Team Logo"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 팀 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">{teamName}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{description}</p>

              <div className="space-y-1.5">
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">주요 활동 지역</p>
                  <p className="text-sm font-semibold text-white">{location}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">창단일</p>
                  <p className="text-sm font-semibold text-white">{foundedDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">유니폼</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-600">홈</span>
                      <Image src={homeImagePath} alt="홈 유니폼" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-600">어웨이</span>
                      <Image src={awayImagePath} alt="어웨이 유니폼" width={32} height={32} className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 초대 링크 */}
          <div className="mx-4 md:mx-6 mb-4 md:mb-6 bg-[#111] rounded-xl border border-white/8 p-3 md:p-4">
            <p className="text-xs font-semibold text-gray-400 mb-2 md:mb-3">초대 링크</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-500 truncate">
                {inviteLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-primary text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                링크 복사
              </button>
            </div>
          </div>
        </section>

        {/* ──── 선수단 테이블 ──── */}
        <section className="bg-[#1a1a1a] rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-4 md:px-6 pt-4 md:pt-5 pb-3">
            <h2 className="text-sm font-semibold text-white">선수단</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-t border-b border-white/8 text-gray-500">
                  <th className="px-3 md:px-4 py-3 text-left font-medium w-[160px] md:w-[180px]">이름</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium">등번호</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium">포지션</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium">나이</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium min-w-[80px]">가입일</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium">역할</th>
                  <th className="px-2 md:px-3 py-3 text-center font-medium">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-3 md:px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden bg-[#2a2a2a] shrink-0">
                          <Image
                            src={member.profileImage}
                            alt={member.name}
                            width={32}
                            height={32}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <span className="text-white font-medium truncate max-w-[80px] md:max-w-[100px] text-xs md:text-sm">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-300 font-mono font-bold">
                      {member.number}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <PosBadge label={member.mainPos} type="main" />
                        {member.subPos && <PosBadge label={member.subPos} type="sub" />}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-400">{member.age}세</td>
                    <td className="px-3 py-3 text-center text-gray-400">{member.joinedAt}</td>
                    <td className="px-3 py-3 text-center">
                      <RoleDropdown
                        value={member.role}
                        disabled={!isManager || member.role === "감독"}
                        onChange={(newRole) => {
                          setRoleModal({
                            memberId: member.id,
                            memberName: member.name,
                            currentRole: member.role,
                            newRole,
                          });
                        }}
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      {isManager && member.role !== "감독" ? (
                        <button
                          onClick={() =>
                            setKickModal({ memberId: member.id, memberName: member.name })
                          }
                          className="text-gray-600 hover:text-red-400 transition-colors p-1"
                          title="방출"
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <rect
                              x="2" y="2" width="11" height="11" rx="2"
                              stroke="currentColor" strokeWidth="1.3"
                            />
                            <path
                              d="M5 5l5 5M10 5l-5 5"
                              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ──── 팀 정보 설정 모달 ──── */}
      {showInfoModal && (
        <TeamInfoModal
          teamName={teamName}
          location={location}
          foundedDate={foundedDate}
          description={description}
          emblemSrc={emblemSrc}
          homeDesign={homeDesign}
          awayDesign={awayDesign}
          onClose={() => setShowInfoModal(false)}
          onSave={handleInfoSave}
        />
      )}

      {/* ──── 권한 변경 모달 ──── */}
      {roleModal && (
        <RoleChangeModal
          memberName={roleModal.memberName}
          currentRole={roleModal.currentRole}
          newRole={roleModal.newRole}
          onConfirm={handleRoleConfirm}
          onCancel={() => setRoleModal(null)}
        />
      )}

      {/* ──── 방출 모달 ──── */}
      {kickModal && (
        <KickModal
          memberName={kickModal.memberName}
          onConfirm={handleKickConfirm}
          onCancel={() => setKickModal(null)}
        />
      )}
    </>
  );
}
