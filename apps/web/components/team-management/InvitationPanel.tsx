"use client";

import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Info } from "lucide-react";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { FindTeamJoinRequestQuery } from "@/lib/relay/queries/findTeamJoinRequestQuery";
import { FindUserByIdQuery } from "@/lib/relay/queries/findUserByIdQuery";
import { RejectJoinRequestMutation } from "@/lib/relay/mutations/rejectJoinRequestMutation";
import type { findTeamJoinRequestQuery } from "@/__generated__/findTeamJoinRequestQuery.graphql";
import type { findUserByIdQuery } from "@/__generated__/findUserByIdQuery.graphql";
import type { rejectJoinRequestMutation } from "@/__generated__/rejectJoinRequestMutation.graphql";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { toast } from "sonner";


type FilterType = "all" | "pending" | "approved" | "rejected" | "transfer";

interface DeletedMember {
  id: string;
  name: string;
  profileImage: string;
  type: "SELF" | "KICK";
  reason: string;
  isBlacklist: boolean;
  deletedAt: string;
  position: string;
}

type ModalState = {
  type: "approve" | "reject";
  requestId: number;
  userId: number;
  userName: string;
} | null;

// ──────────────────────────────────────────────
// 방출 이력 모달
// ──────────────────────────────────────────────
function PlayerHistoryModal({ player, onClose }: { player: DeletedMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-linear-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <ProfileAvatar src={player.profileImage} size={48} alt={player.name} />
            <div>
              <h2 className="text-xl font-bold text-white">{player.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{player.position} | 방출 상세 기록</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-red-400/80 flex items-center gap-2 uppercase tracking-tight">
              <Info size={14} /> 방출 이력 정보
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-gray-500 mb-1">방출 유형</p><p className="text-white">{player.type === "SELF" ? "본인 이적" : "팀에서 방출"}</p></div>
              <div><p className="text-gray-500 mb-1">방출 일자</p><p className="text-white">{player.deletedAt}</p></div>
              <div className="col-span-2"><p className="text-gray-500 mb-1">사유</p><p className="text-white leading-relaxed">{player.reason}</p></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-[#141414]">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/10 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 신청자 정보 카드 (유저 쿼리 내부에서 실행)
// ──────────────────────────────────────────────
type RequestItem = {
  id: number;
  userId: number;
  status: string;
  createdAt: any;
  message?: string | null;
  rejectedReason?: string | null;
};

function formatPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

function JoinRequestCard({
  req,
  onApprove,
  onReject,
}: {
  req: RequestItem;
  onApprove: (requestId: number, userId: number, userName: string) => void;
  onReject: (requestId: number, userId: number, userName: string) => void;
}) {
  const data = useLazyLoadQuery<findUserByIdQuery>(
    FindUserByIdQuery,
    { id: req.userId },
    { fetchPolicy: "store-or-network" },
  );

  const user = data.findUserById;
  const userName = user.name || `사용자 #${req.userId}`;

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const positionLabel = [user.mainPosition, ...(user.subPositions ?? [])].filter(Boolean).join(" / ");

  return (
    <div
      className={cn(
        "bg-[#1a1a1a] border border-[#3e3e3e] rounded-[12px] p-4 md:px-[24px] md:py-[16px] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6",
        req.status === "REJECTED" && "opacity-75",
      )}
    >
      {/* 좌측: 날짜 + 프로필 + 정보 */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-[16px] w-full min-w-0">
        {/* 날짜 */}
        <span className="text-[13px] text-[#a6a5a5] whitespace-nowrap shrink-0">
          {formatDate(req.createdAt)}
        </span>

        {/* 프로필 + 텍스트 정보 */}
        <div className="flex items-center gap-3 min-w-0">
          <ProfileAvatar src={user.profileImage ?? undefined} size={36} alt={userName} />
          <div className="flex flex-col gap-1 min-w-0">
            {/* 이름 */}
            <span className="text-[14px] font-bold text-white truncate">{userName}</span>
            {/* 연락처 · 이메일 · 포지션 */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              {user.email && (
                <span className="text-[12px] text-[#a6a5a5]">{user.email}</span>
              )}
              {user.phone && (
                <>
                  <span className="text-[#3e3e3e] text-[11px]">·</span>
                  <span className="text-[12px] text-[#a6a5a5]">{formatPhone(user.phone)}</span>
                </>
              )}
              {positionLabel && (
                <>
                  <span className="text-[#3e3e3e] text-[11px]">·</span>
                  <span className="text-[12px] text-[#b8ff12]/80 font-medium">{positionLabel}</span>
                </>
              )}
              {user.preferredNumber != null && (
                <>
                  <span className="text-[#3e3e3e] text-[11px]">·</span>
                  <span className="text-[12px] text-[#a6a5a5]">#{user.preferredNumber}번</span>
                </>
              )}
            </div>
            {/* 신청 메시지 */}
            {req.message && (
              <p className="text-[11px] text-[#a6a5a5] italic truncate max-w-[280px]">
                &ldquo;{req.message}&rdquo;
              </p>
            )}
            {/* 거절 사유 */}
            {req.status === "REJECTED" && req.rejectedReason && (
              <p className="text-[11px] text-[#f54346]">거절 사유: {req.rejectedReason}</p>
            )}
          </div>
        </div>
      </div>

      {/* 우측: 버튼 / 상태 배지 */}
      <div className="flex shrink-0 w-full md:w-auto justify-end border-t border-white/5 pt-3 md:border-0 md:pt-0">
        {req.status === "PENDING" ? (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(req.id, req.userId, userName)}
              className="w-[77px] h-[41px] flex items-center justify-center bg-[#b8ff12] rounded-[10px] text-black text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              수락
            </button>
            <button
              onClick={() => onReject(req.id, req.userId, userName)}
              className="w-[77px] h-[41px] flex items-center justify-center bg-[#252525] rounded-[10px] text-[#a6a5a5] text-[14px] font-semibold hover:bg-white/10 hover:text-white transition-colors"
            >
              거절
            </button>
          </div>
        ) : req.status === "APPROVED" ? (
          <div className="px-3 h-[30px] flex items-center justify-center bg-[rgba(184,255,18,0.2)] rounded-[10px] text-[#b8ff12] text-[12px] font-medium">
            승인완료
          </div>
        ) : (
          <div className="px-3 h-[30px] flex items-center justify-center bg-[rgba(245,67,70,0.2)] rounded-[10px] text-[#f54346] text-[12px] font-medium">
            거절됨
          </div>
        )}
      </div>
    </div>
  );
}

function JoinRequestCardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#3e3e3e] rounded-[12px] p-4 md:px-[24px] md:py-[16px] flex items-center gap-4 animate-pulse">
      <div className="w-[72px] h-4 bg-white/5 rounded" />
      <div className="w-10 h-10 bg-white/5 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-28 bg-white/5 rounded" />
        <div className="h-3 w-48 bg-white/5 rounded" />
      </div>
      <div className="flex gap-2 ml-auto">
        <div className="w-[77px] h-[41px] bg-white/5 rounded-[10px]" />
        <div className="w-[77px] h-[41px] bg-white/5 rounded-[10px]" />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 목록 + 필터
// ──────────────────────────────────────────────
function JoinRequestList({ teamId }: { teamId: number }) {
  const [filter, setFilter] = useState<FilterType>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<DeletedMember | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [rejectReason, setRejectReason] = useState("");
  const data = useLazyLoadQuery<findTeamJoinRequestQuery>(
    FindTeamJoinRequestQuery,
    { teamId },
    { fetchPolicy: "store-and-network" },
  );

  const [commitReject, isRejectInFlight] = useMutation<rejectJoinRequestMutation>(
    RejectJoinRequestMutation,
  );

  const allRequests = data.findTeamJoinRequest ?? [];

  const filteredRequests = allRequests.filter((req) => {
    if (filter === "transfer") return false;
    if (filter === "all") return true;
    if (filter === "pending") return req.status === "PENDING";
    if (filter === "approved") return req.status === "APPROVED";
    if (filter === "rejected") return req.status === "REJECTED";
    return true;
  });

  const pendingCount = allRequests.filter((req) => req.status === "PENDING").length;

  const handleReject = () => {
    if (!modal || modal.type !== "reject") return;
    commitReject({
      variables: { joinRequestId: modal.requestId, rejectedReason: rejectReason || undefined },
      onCompleted: () => {
        toast.success("가입 신청을 거절했습니다.");
        setModal(null);
        setRejectReason("");
      },
      onError: (err) => {
        console.error("[InvitationPanel] reject error:", err);
        toast.error("거절 처리 중 오류가 발생했습니다.");
      },
    });
  };

  const handleApprove = () => {
    toast.info("승인 기능은 현재 준비 중입니다.");
    setModal(null);
  };

  return (
    <>
      <div className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">선수 입단 관리</h1>
          {pendingCount > 0 && (
            <span className="w-5 h-5 bg-[#fb2c36] rounded-full flex items-center justify-center text-[11px] text-white font-bold">
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 pb-8 flex flex-col h-full overflow-hidden">
        {/* 필터 탭 */}
        <div className="flex gap-[8px] mb-6 flex-wrap">
          {(["all", "pending", "approved", "rejected", "transfer"] as FilterType[]).map((tab) => {
            const label =
              tab === "all" ? "전체"
              : tab === "pending" ? "대기중"
              : tab === "approved" ? "승인 완료"
              : tab === "rejected" ? "거절"
              : "이적";
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                  filter === tab
                    ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]"
                    : "bg-[#131312] text-[#d6d6d5]",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 이적 탭 */}
        {filter === "transfer" ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="relative w-full group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="방출된 멤버 이름 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/3 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-600">
                <p className="text-sm font-medium">이적 이력 조회 기능을 준비 중입니다.</p>
              </div>
            </div>
          </div>
        ) : (
          /* 신청 목록 */
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {filteredRequests.map((req) => (
              <Suspense key={req.id} fallback={<JoinRequestCardSkeleton />}>
                <JoinRequestCard
                  req={req}
                  onApprove={(rId, uId, name) =>
                    setModal({ type: "approve", requestId: rId, userId: uId, userName: name })
                  }
                  onReject={(rId, uId, name) =>
                    setModal({ type: "reject", requestId: rId, userId: uId, userName: name })
                  }
                />
              </Suspense>
            ))}

            {filteredRequests.length === 0 && (
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm italic">
                신청 내역이 없습니다.
              </div>
            )}
          </div>
        )}

        {selectedPlayer && (
          <PlayerHistoryModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}

        {/* 처리 확인 모달 */}
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center mb-8">
                <h4 className="text-xl font-bold text-white mb-4">
                  {modal.type === "approve" ? "팀 가입 수락" : "팀 가입 거절"}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-white font-bold">{modal.userName}</span>님의<br />
                  팀 가입을 {modal.type === "approve" ? "수락하시겠습니까?" : "거절하시겠습니까?"}
                </p>
              </div>

              {modal.type === "reject" && (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="거절 사유 (선택)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-primary/40 transition-all"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setModal(null); setRejectReason(""); }}
                  className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 text-sm font-bold hover:bg-white/10 transition-colors"
                >
                  취소
                </button>
                {modal.type === "approve" ? (
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-3 bg-primary rounded-xl text-black text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    수락하기
                  </button>
                ) : (
                  <button
                    onClick={handleReject}
                    disabled={isRejectInFlight}
                    className="flex-1 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {isRejectInFlight ? "처리 중..." : "거절하기"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// 스켈레톤 (목록 최초 로딩)
// ──────────────────────────────────────────────
function JoinRequestListSkeleton() {
  return (
    <>
      <div className="px-4 md:px-6 pt-6 pb-4">
        <div className="h-7 w-36 bg-white/5 rounded-lg animate-pulse" />
      </div>
      <div className="px-4 md:px-6 pb-8 flex flex-col gap-4">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[41px] w-20 bg-white/5 rounded-[10px] animate-pulse" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <JoinRequestCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// 진입점
// ──────────────────────────────────────────────
export default function InvitationPanel() {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (!selectedTeamIdNum) {
    return (
      <div className="px-4 md:px-6 pt-6 flex items-center justify-center h-40 text-gray-500 text-sm">
        팀을 선택해주세요.
      </div>
    );
  }

  return (
    <Suspense fallback={<JoinRequestListSkeleton />}>
      <JoinRequestList teamId={selectedTeamIdNum} />
    </Suspense>
  );
}
