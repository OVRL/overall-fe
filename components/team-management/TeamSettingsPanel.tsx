"use client";

import { useState, useRef, Suspense } from "react";
import { X, Copy, Check, Settings } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { getValidImageSrc, cn } from "@/lib/utils";
import type { TeamMemberRole } from "@/lib/permissions/teamMemberRole";
import { UNIFORM_DESIGNS, type UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import { useNaverAddressSearch } from "@/hooks/useNaverAddressSearch";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useTeamSettingsQuery } from "./hooks/useTeamSettingsQuery";
import { useUpdateTeamMutation } from "./hooks/useUpdateTeamMutation";
import { useUpdateTeamMemberMutation } from "./hooks/useUpdateTeamMemberMutation";
import { useDeleteTeamMemberMutation } from "./hooks/useDeleteTeamMemberMutation";
import useModal from "@/hooks/useModal";
import locationIcon from "@/public/icons/location.svg";
import closeIcon from "@/public/icons/close.svg";
import Icon from "@/components/ui/Icon";
import TextField from "@/components/ui/TextField";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { useUserId, parseUserId } from "@/hooks/useUserId";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { 
  getTeamMemberProfileImageRawUrl, 
  getTeamMemberProfileImageFallbackUrl 
} from "@/lib/playerPlaceholderImage";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export type MemberRole = "감독" | "선수" | "코치" | "중무";

interface TeamMember {
  id: string;
  userId: number;
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
  availableRoles = ["감독", "선수", "코치"],
}: {
  value: MemberRole;
  onChange: (v: MemberRole) => void;
  disabled?: boolean;
  availableRoles?: MemberRole[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex items-center justify-between gap-1 rounded-md bg-[#252526] border border-transparent px-2.5 py-1.5 text-xs text-white min-w-[72px] transition-all ${
          disabled
            ? "opacity-50 cursor-default"
            : open 
              ? "border-Fill_AccentPrimary" 
              : "hover:bg-[#2d2d2e] cursor-pointer"
        }`}
      >
        <span className="flex-1 text-left">{value}</span>
        {!disabled && (
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={cn("transition-transform duration-200", open && "rotate-180")}>
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
          <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[100px] rounded-[0.625rem] bg-[#1a1a1b] border border-white/5 shadow-2xl overflow-hidden py-1.5">
            {availableRoles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-[13px] transition-colors ${
                  r === value
                    ? "text-Fill_AccentPrimary"
                    : "text-white/60 hover:text-white hover:bg-white/10"
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
// 팀 정보 설정 모달
// ──────────────────────────────────────────────
interface TeamInfoModalProps {
  teamName: string;
  locationName: string;
  locationCode: string;
  foundedDate: string;
  description: string;
  emblemSrc: string;
  homeDesign: UniformDesign;
  awayDesign: UniformDesign;
  onClose: () => void;
  onSave: (data: {
    teamName: string;
    locationCode: string;
    locationName: string;
    description: string;
    emblemSrc: string;
    homeDesign: UniformDesign;
    awayDesign: UniformDesign;
  }) => void;
}

function TeamInfoModal({
  teamName: initTeamName,
  locationName: initLocationName,
  locationCode: initLocationCode,
  foundedDate,
  description: initDesc,
  emblemSrc: initEmblem,
  homeDesign: initHome,
  awayDesign: initAway,
  onClose,
  onSave,
}: TeamInfoModalProps) {
  const { openModal } = useModal("ADDRESS_SEARCH");
  const [teamName, setTeamName] = useState(initTeamName);
  const [locationName, setLocationName] = useState(initLocationName);
  const [locationCode, setLocationCode] = useState(initLocationCode);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pb-20 md:pb-4">
      <div className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 max-h-[75vh] md:max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-[#1e1e1e] px-6 py-5">
          <h2 className="pt-2 w-full text-center text-lg font-semibold text-white">
            팀 정보 설정
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1"
          >
            <Icon src={closeIcon} alt="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 클럽 이름 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">클럽 이름</label>
            <div className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-base text-gray-500">
              {teamName}
            </div>
          </div>

          {/* 주요 활동 지역 - ADDRESS_SEARCH 모달 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">주요 활동지역</label>
            <button
              type="button"
              className="w-full cursor-pointer text-left outline-none"
              onClick={() =>
                openModal({
                  onComplete: ({ address, code }) => {
                    setLocationName(address);
                    setLocationCode(code);
                  },
                })
              }
            >
              <div className="w-full flex items-center gap-2.5 py-2">
                <Image src={locationIcon} alt="location" width={20} height={20} className="opacity-50" />
                <span className={cn("text-base truncate", locationName ? "text-white" : "text-gray-400")}>
                  {locationName || "클릭해서 주요 활동 장소를 찾아보세요"}
                </span>
              </div>
            </button>
          </div>

          {/* 클럽 창단일 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">클럽 창단일</label>
            <div className="flex items-center gap-2.5 bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-base text-gray-400">
              <span>📅</span>
              <span>{foundedDate}</span>
            </div>
          </div>

          {/* 클럽 소개 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">클럽 소개</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {/* 클럽 엠블럼 - 실제 파일 선택 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">클럽 엠블럼</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2a2a2a] border border-white/10 shrink-0">
                <Image
                  src={getValidImageSrc(emblemSrc, "/images/teamemblum_default.webp")}
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
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">홈 유니폼</label>
            <UniformGrid selected={homeDesign} onSelect={setHomeDesign} />
          </div>

          {/* 어웨이 유니폼 - 실제 이미지 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">어웨이 유니폼</label>
            <UniformGrid selected={awayDesign} onSelect={setAwayDesign} />
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="sticky bottom-0 bg-[#1e1e1e] px-6 py-4">
          <Button
            variant="primary"
            size="m"
            onClick={() =>
              onSave({ teamName, locationCode, locationName, description, emblemSrc, homeDesign, awayDesign })
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
// 초대 링크 모달
// ──────────────────────────────────────────────
function InviteLinkModal({ inviteLink, onClose }: { inviteLink: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pb-20 md:pb-4">
      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 max-h-[75vh] md:max-h-none overflow-y-auto">
        {/* 헤더 */}
        <div className="bg-[#1a1a1a] px-6 py-5">
          <h2 className="pt-2 w-full text-center text-lg font-semibold text-white">
            초대 링크
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1"
          >
            <Icon src={closeIcon} alt="close" />
          </button>
        </div>

        {/* 내용 */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            아래 링크를 공유하면 새로운 팀원을 초대할 수 있습니다.
          </p>
          {/* 링크 박스 */}
          <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 flex items-center gap-2">
            <span className="flex-1 text-sm text-gray-300 font-medium truncate select-all">
              {inviteLink}
            </span>
          </div>
          {/* 복사 버튼 */}
          <button
            onClick={handleCopy}
            className={cn(
              "w-full h-[52px] flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all",
              copied
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-[#b8ff12] text-black hover:bg-[#c8ff32] active:bg-[#a0e000]"
            )}
          >
            {copied ? (
              <><Check size={16} /> 복사 완료!</>
            ) : (
              <><Copy size={16} /> 링크 복사하기</>
            )}
          </button>
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
  onConfirm: (reason: string, type: "SELF" | "KICK", isBlacklist: boolean) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("개인적인 이유");
  const [type, setType] = useState<"SELF" | "KICK">("KICK");
  const [isBlacklist, setIsBlacklist] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#2a2a2a] rounded-2xl p-6 shadow-2xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4 text-center">선수 방출 사유서</h3>
        
        <div className="space-y-4 mb-6">
          {/* 방출 구분 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">방출 구분</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setType("SELF")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium border transition-all",
                  type === "SELF" ? "bg-white/10 border-white/20 text-white" : "border-white/5 text-gray-500"
                )}
              >
                본인 이적
              </button>
              <button 
                onClick={() => setType("KICK")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium border transition-all",
                  type === "KICK" ? "bg-red-500/20 border-red-500/30 text-red-400" : "border-white/5 text-gray-500"
                )}
              >
                팀에서 방출
              </button>
            </div>
          </div>

          {/* 사유 선택 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">방출 사유</label>
            <Dropdown
              options={[
                { label: "이사", value: "이사" },
                { label: "개인적인 이유", value: "개인적인 이유" },
                { label: "기타", value: "기타" },
              ]}
              value={reason}
              onChange={(val: string) => setReason(val)}
              triggerClassName="h-10 text-xs bg-[#1c1c1c] border-white/10"
            />
          </div>

          {/* 블랙리스트 */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input 
              type="checkbox" 
              id="blacklist" 
              checked={isBlacklist}
              onChange={(e) => setIsBlacklist(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#1c1c1c] checked:bg-red-500"
            />
            <label htmlFor="blacklist" className="text-xs text-red-400 font-medium cursor-pointer">
              블랙리스트에 등록하기 (재가입 불가)
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 text-sm hover:bg-white/5 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(reason, type, isBlacklist)}
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
// Main Panel Wrapper
// ──────────────────────────────────────────────
interface TeamSettingsPanelProps {
  userRole: TeamMemberRole;
}

export default function TeamSettingsPanel({ userRole }: TeamSettingsPanelProps) {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (!selectedTeamIdNum) return <div className="p-6 text-white">팀 데이터를 불러오는 중...</div>;

  return (
    <Suspense fallback={<div className="p-6 text-white text-sm">설정 불러오는 중...</div>}>
      <TeamSettingsPanelInner userRole={userRole} teamId={selectedTeamIdNum} />
    </Suspense>
  );
}

// ──────────────────────────────────────────────
// Inner Panel
// ──────────────────────────────────────────────
function TeamSettingsPanelInner({
  userRole,
  teamId,
}: {
  userRole: TeamMemberRole;
  teamId: number;
}) {
  const currentUserId = useUserId();

  // Query
  const data = useTeamSettingsQuery(teamId);
  const teamMemberConnection = data.findManyTeamMember;

  // 실제 현재 접속자의 역할을 멤버 목록에서 찾음 (상위에서 내려주는 userRole이 Mock일 수 있으므로)
  const currentUserMember = teamMemberConnection.members.find((m: any) => {
    const mUserId = m.user?.id != null ? parseUserId(m.user.id) : null;
    return mUserId != null && currentUserId != null && String(mUserId) === String(currentUserId);
  });

  const effectiveRoleRaw = currentUserMember?.role || userRole;
  const effectiveRole = String(effectiveRoleRaw).toUpperCase();
  const isActualManager = effectiveRole === "MANAGER" || effectiveRole === "감독";
  const isActualCoach = effectiveRole === "COACH" || effectiveRole === "코치";

  // 팀 정보 (첫 번째 멤버의 team 정보를 통해 가져옴)
  const teamData = teamMemberConnection.members[0]?.team;
  
  // 뮤테이션 훅
  const { executeMutation: updateTeam } = useUpdateTeamMutation();
  const { executeMutation: updateMember, isInFlight: isUpdatingMember } = useUpdateTeamMemberMutation();
  const { executeMutation: deleteMember, isInFlight: isDeletingMember } = useDeleteTeamMemberMutation();

  // 선수단 매핑
  const calculateAge = (birthDate?: string | null) => {
    if (!birthDate) return 0;
    const year = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const members: TeamMember[] = teamMemberConnection.members.map((m) => {
    const roleMapping: Record<string, MemberRole> = {
      MANAGER: "감독",
      COACH: "코치",
      PLAYER: "선수"
    };

    // m.id가 Relay 정규화 id(`TeamModel:5` 등)일 때도 숫자만 추출 (플레이스홀더 시드 일관성)
    const normalizedMemberId =
      m.id != null ? parseNumericIdFromRelayGlobalId(m.id) ?? 0 : 0;
    
    // getTeamMemberProfileImage~ 함수들은 member 객체의 id가 숫자 형태여야 홈 화면(PlayerListItem)과 동일한 시드를 생성함
    const memberForImage = {
      ...m,
      id: normalizedMemberId || 0,
    };

    const rawUrl = getTeamMemberProfileImageRawUrl(memberForImage as any);
    const fallbackUrl = getTeamMemberProfileImageFallbackUrl(memberForImage as any);

    return {
      id: String(m.id),
      userId:
        (m.user as { id?: number } | null)?.id != null
          ? parseUserId((m.user as { id: number }).id) || 0
          : 0,
      name: m.user?.name ?? "알 수 없음",
      number: m.backNumber ?? 0,
      mainPos: m.position ?? "-",
      subPos: "",
      age: calculateAge(m.user?.birthDate),
      joinedAt: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "-",
      role: roleMapping[m.role] ?? "선수",
      profileImage: rawUrl,
      fallbackImage: fallbackUrl,
    };
  });

  // 상태는 뮤테이션 처리를 위한 임시 상태로만 존재 (UI 표시는 Relay Store 데이터 기반)
  const inviteLink = "https://ovr-log.com/invite/abc123xyz"; // 백업용 (차후 구현 여부에 따라 변경)
  const [showInviteModal, setShowInviteModal] = useState(false);
  
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

  const handleRoleConfirm = async () => {
    if (!roleModal) return;

    const reverseMapping: Record<MemberRole, string> = {
      "감독": "MANAGER",
      "코치": "COACH",
      "선수": "PLAYER",
      "중무": "PLAYER"
    };

    const targetRole = reverseMapping[roleModal.newRole];

    // 역할 제한 체크: 코치는 최대 4명, 감독은 1명
    if (targetRole === "COACH") {
      const coachCount = teamMemberConnection.members.filter((m: any) => m.role === "COACH").length;
      if (coachCount >= 4) {
        alert("코치는 최대 4명까지만 임명할 수 있습니다.");
        setRoleModal(null);
        return;
      }
    } else if (targetRole === "MANAGER") {
      const managerCount = teamMemberConnection.members.filter((m: any) => m.role === "MANAGER").length;
      if (managerCount >= 1) {
        alert("감독은 이미 존재합니다. 한 팀에 감독은 1명만 가능합니다.");
        setRoleModal(null);
        return;
      }
    }

    try {
      await updateMember({
        id: Number(roleModal.memberId),
        role: targetRole
      });
      alert("권한이 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("Failed to change role:", error);
      alert("권한 변경에 실패했습니다.");
    } finally {
      setRoleModal(null);
    }
  };

  const handleKickConfirm = async (reason: string, type: "SELF" | "KICK", isBlacklist: boolean) => {
    if (!kickModal) return;

    try {
      // API 호출 시 사유 데이터를 포함하도록 확장 (서버 지원 시 필드 반영)
      await deleteMember(Number(kickModal.memberId));
      console.log("Kick Data:", { memberId: kickModal.memberId, reason, type, isBlacklist });
      alert(`${kickModal.memberName}님이 ${type === "SELF" ? "이적" : "방출"} 처리되었습니다.${isBlacklist ? " (블랙리스트 등록 완료)" : ""}`);
    } catch (error) {
      console.error("Failed to kick member:", error);
      alert("멤버 방출에 실패했습니다.");
    } finally {
      setKickModal(null);
    }
  };

  const handleInfoSave = (newData: {
    teamName: string;
    locationCode: string;
    locationName: string;
    description: string;
    emblemSrc: string;
    homeDesign: UniformDesign;
    awayDesign: UniformDesign;
  }) => {
    if (!teamData) {
      alert("팀 정보를 불러올 수 없어 수정할 수 없습니다.");
      return;
    }
  
    const input = {
      id: Number(teamData.id),
      name: newData.teamName,
      activityArea: newData.locationCode,
      description: newData.description,
      homeUniform: newData.homeDesign,
      awayUniform: newData.awayDesign,
    };

    // 백엔드 mutation 응답에서 region 객체를 제대로 채워주지 않을 경우를 대비해 스토어를 직접 변경
    updateTeam({
      variables: { input },
      updater: (store) => {
        const payload = store.getRootField("updateTeam");
        if (!payload) return;
        
        // 새로 저장한 region 객체 레코드를 생성 (client-side only)
        const regionRecord = store.create(`client:region:${newData.locationCode}`, "RegionSearchModel");
        regionRecord.setValue(newData.locationCode, "code");
        regionRecord.setValue(newData.locationName, "name");
        
        payload.setLinkedRecord(regionRecord, "region");
      },
      onCompleted: () => {
        setShowInfoModal(false);
      },
      onError: (err) => {
        console.error(err);
        alert("팀 정보 수정에 실패했습니다.");
      }
    });
  };

  if (!teamData) {
    return <div className="p-6 text-white text-sm">소속 팀 정보를 가져올 수 없습니다.</div>;
  }

  const teamName = teamData.name ?? "";
  const locationName = teamData.region?.name || teamData.activityArea || "";
  const locationCode = teamData.region?.code || teamData.activityArea || "";
  const foundedDate = teamData.historyStartDate  
    ? new Date(teamData.historyStartDate).toLocaleDateString()
    : "";
  const description = teamData.description ?? "";
  const emblemSrc = teamData.emblem ?? "/images/ovr.png";
  const homeDesign = (teamData.homeUniform as UniformDesign) ?? "SOLID_RED";
  const awayDesign = (teamData.awayUniform as UniformDesign) ?? "STRIPE_BLUE";

  // 현재 선택된 유니폼 이미지 경로
  const homeImagePath = UNIFORM_DESIGNS.find((d) => d.design === homeDesign)?.imagePath ?? "";
  const awayImagePath = UNIFORM_DESIGNS.find((d) => d.design === awayDesign)?.imagePath ?? "";

  return (
    <>
        {showInfoModal && (
          <TeamInfoModal
            teamName={teamName}
            locationName={locationName}
            locationCode={locationCode}
            foundedDate={foundedDate}
            description={description}
            emblemSrc={emblemSrc}
            homeDesign={homeDesign as UniformDesign}
            awayDesign={awayDesign as UniformDesign}
            onClose={() => setShowInfoModal(false)}
            onSave={handleInfoSave}
          />
        )}
        {showInviteModal && (
          <InviteLinkModal
            inviteLink={inviteLink}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">팀 설정</h1>
      </div>
      <div className="px-4 md:px-6 pb-6 space-y-4 md:space-y-6">

        {/* ──── 팀 정보 카드 ──── */}
        <section className="bg-[#1a1a1a] rounded-2xl border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-6 pt-6 pb-2">
            <h2 className="text-[20px] font-bold text-white">팀 정보</h2>
            <div className="flex items-center gap-2">
              {/* 초대 링크 버튼 */}
              <button
                onClick={() => setShowInviteModal(true)}
                className="h-[36px] flex items-center gap-2 bg-[#3e3e3e] rounded-[8px] px-3 hover:bg-[#4a4a4a] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#D6D6D5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#D6D6D5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] font-semibold text-[#d6d6d5]">초대 링크</span>
              </button>
              {/* 팀 정보 설정 버튼 */}
              <button
                onClick={() => setShowInfoModal(true)}
                className="h-[36px] flex items-center gap-2 bg-[#3e3e3e] rounded-[8px] px-3 hover:bg-[#4a4a4a] transition-colors"
              >
                <Settings size={18} className="text-[#d6d6d5]" />
                <span className="text-[14px] font-semibold text-[#d6d6d5]">팀 정보 설정</span>
              </button>
            </div>
          </div>

          <div className="px-4 md:px-8 pb-10 mt-6 flex sm:flex-row flex-col gap-8 md:gap-12 items-start">
            {/* 팀 엠블럼 */}
            <div className="w-[84px] h-[84px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden bg-[#2a2a2a] border border-white/10 shrink-0">
              <Image
                src={getValidImageSrc(emblemSrc, "/images/teamemblum_default.webp")}
                alt="Team Logo"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 팀 정보 */}
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-2xl md:text-[28px] font-bold text-white mb-1 md:mb-2 tracking-tight">{teamName}</h3>
              <p className="text-[16px] text-[#e0e0e0] mb-4 leading-relaxed">
                {description || "열정과 실력을 겸비한 아마추어 축구팀입니다."}
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-[#8b8b8b] mb-2">주요 활동 지역</p>
                  <p className="text-sm md:text-base font-normal text-white">{locationName}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-[#8b8b8b] mb-1">창단일</p>
                  <p className="text-sm md:text-base font-normal text-white">{foundedDate}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-[#8b8b8b] mb-2">유니폼</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-[57px] flex flex-col items-center gap-2">
                      <Image src={getValidImageSrc(homeImagePath)} alt="Home uniform" width={53} height={52} className="object-contain" />
                      <span className="text-[15px] font-normal text-white">Home</span>
                    </div>
                    <div className="w-[57px] flex flex-col items-center gap-2">
                      <Image src={getValidImageSrc(awayImagePath)} alt="Away uniform" width={53} height={52} className="object-contain" />
                      <span className="text-[15px] font-normal text-white">Away</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── 선수단 테이블 ──── */}
        <section className="bg-[#1a1a1a] rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-4 md:px-6 pt-6 pb-4">
            <h2 className="text-[20px] font-bold text-white">선수단</h2>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-max text-xs">
              <thead>
                <tr className="border-t border-b border-white/8 text-gray-500 whitespace-nowrap">
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
                  <tr key={member.id} className="hover:bg-white/3 transition-colors whitespace-nowrap">
                    <td className="px-3 md:px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 relative flex items-center justify-center">
                          <ProfileAvatar
                            src={member.profileImage || undefined}
                            fallbackSrc={(member as any).fallbackImage}
                            alt={member.name}
                            size={36}
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
                        disabled={
                          (!isActualManager && !isActualCoach) || 
                          (member.userId === currentUserId) || 
                          (isActualCoach && member.role === "감독")
                        }
                        availableRoles={
                          isActualManager 
                            ? ["감독", "코치", "선수"] 
                            : isActualCoach 
                              ? ["코치", "선수"] 
                              : [member.role]
                        }
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
                      {(isActualManager || isActualCoach) && member.role === "선수" ? (
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
