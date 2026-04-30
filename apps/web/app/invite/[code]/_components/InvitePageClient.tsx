"use client";

import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EmblemImage } from "@/components/ui/EmblemImage";
import { FindTeamByInviteCodeQuery } from "@/lib/relay/queries/findTeamByInviteCodeQuery";
import type { findTeamByInviteCodeQuery } from "@/__generated__/findTeamByInviteCodeQuery.graphql";
import {
  findPendingJoinRequestIdForTeam,
  findRejectedReasonForTeam,
} from "@/components/modals/TeamInfoModal/teamInfoModalUtils";
import { TeamInfoModalJoinFooter } from "@/components/modals/TeamInfoModal/TeamInfoModalJoinFooter";
import ovrLogo from "@/public/images/ovr.png";

// ──────────────────────────────────────────────
// 로딩 스켈레톤
// ──────────────────────────────────────────────
function InvitePageSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 animate-pulse">
      <div className="w-24 h-24 rounded-2xl bg-white/10" />
      <div className="w-40 h-7 rounded-lg bg-white/10" />
      <div className="w-64 h-5 rounded-lg bg-white/10" />
      <div className="w-full max-w-xs h-14 rounded-xl bg-white/10 mt-4" />
    </div>
  );
}

// ──────────────────────────────────────────────
// 팀 데이터 로드 후 렌더
// ──────────────────────────────────────────────
function InviteContent({ code }: { code: string }) {
  const router = useRouter();
  const data = useLazyLoadQuery<findTeamByInviteCodeQuery>(
    FindTeamByInviteCodeQuery,
    { inviteCode: code },
    { fetchPolicy: "store-or-network" },
  );

  const team = data.findTeamByInviteCode;

  if (team == null) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-3xl">⚽</span>
        </div>
        <div className="space-y-2">
          <p className="text-white font-bold text-xl">유효하지 않은 초대 링크</p>
          <p className="text-gray-500 text-sm">링크가 만료되었거나 존재하지 않는 팀입니다.</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/15 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const teamName = team.name?.trim() || "팀";
  const pendingId = findPendingJoinRequestIdForTeam(data.findMyJoinRequest, team.id);
  const rejectedReason = findRejectedReasonForTeam(data.findMyJoinRequest, team.id);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xs">
      {/* 팀 엠블럼 */}
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/15 bg-[#1a1a1a] shadow-2xl">
        <EmblemImage
          src={team.emblem}
          alt={`${teamName} 로고`}
          fill
          sizes="6rem"
          className="object-cover"
          priority
        />
      </div>

      {/* 입단 제안 텍스트 */}
      <div className="text-center space-y-3">
        <p className="text-xs font-bold tracking-[0.2em] text-[#b8ff12] uppercase">
          입단 제안
        </p>
        <h1 className="text-2xl font-black text-white leading-tight">
          {teamName}
        </h1>
        <p className="text-[15px] text-gray-400 leading-relaxed">
          <span className="text-white font-semibold">{teamName}</span>
          {team.description?.trim()
            ? `이(가) 영입 제안을 했습니다.`
            : `이(가) 영입 제안을 했습니다.`}
          <br />
          수락하시겠습니까?
        </p>
        {team.description?.trim() && (
          <p className="text-sm text-gray-600 italic px-4 line-clamp-2">
            &ldquo;{team.description.trim()}&rdquo;
          </p>
        )}
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-white/8" />

      {/* 가입 신청 / 대기 버튼 */}
      <div className="w-full">
        <TeamInfoModalJoinFooter
          inviteCode={code}
          initialPendingJoinRequestId={pendingId}
          rejectedReason={rejectedReason}
          className="flex-col gap-3"
        />
      </div>

      {/* 홈 이동 */}
      <button
        onClick={() => router.push("/")}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2"
      >
        오버롤 홈으로 이동
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// 페이지 진입점
// ──────────────────────────────────────────────
export default function InvitePageClient({ code }: { code: string }) {
  return (
    <main className="min-h-dvh bg-[#0f0f0f] flex flex-col items-center justify-center px-5 py-12">
      {/* OVR 로고 */}
      <div className="mb-10 flex items-center gap-2 opacity-60">
        <Image src={ovrLogo} alt="Overall" width={72} height={20} className="object-contain" />
      </div>

      <Suspense fallback={<InvitePageSkeleton />}>
        <InviteContent code={code} />
      </Suspense>
    </main>
  );
}
