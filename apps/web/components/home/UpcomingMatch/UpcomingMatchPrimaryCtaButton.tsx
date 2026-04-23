"use client";

import Link from "@/components/Link";
import Button, { buttonVariants } from "@/components/ui/Button";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import useModal from "@/hooks/useModal";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { HomePrimaryCta } from "@/utils/match/computeHomeUpcomingMatchLayout";

type UpcomingMatchPrimaryCtaButtonProps = {
  primary: HomePrimaryCta;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
  className?: string;
};

/**
 * 홈 다가오는 경기 카드의 단일 우선 CTA (기획 우선순위에 맞춘 라벨).
 */
export function UpcomingMatchPrimaryCtaButton({
  primary,
  onAttendanceVote,
  onCopyTeamCode,
  className,
}: UpcomingMatchPrimaryCtaButtonProps) {
  const base = "font-semibold text-sm cursor-pointer";
  const { selectedTeamIdNum } = useSelectedTeamId();
  const { openModal: openFormationLineupModal } = useModal(
    "FORMATION_CHECK_LINEUP",
  );
  const { openModal: openMomVoteModal } = useModal("MOM_VOTE");

  switch (primary.kind) {
    case "mom_vote": {
      const momMatchId = primary.matchId;
      if (momMatchId == null) {
        return (
          <Link
            href={primary.href}
            className={cn(
              buttonVariants({ variant: "primary", size: "m" }),
              base,
              className,
            )}
          >
            MOM 투표하기
          </Link>
        );
      }
      return (
        <Button
          variant="primary"
          size="m"
          className={cn(base, className)}
          onClick={() => {
            if (selectedTeamIdNum == null) {
              toast.error("팀을 선택한 뒤 다시 시도해 주세요.");
              return;
            }
            openMomVoteModal({
              matchId: momMatchId,
              teamId: selectedTeamIdNum,
            });
          }}
        >
          MOM 투표하기
        </Button>
      );
    }
    case "attendance":
      return (
        <Button
          variant="primary"
          size="m"
          className={cn(base, className)}
          onClick={onAttendanceVote}
        >
          참석 투표하기
        </Button>
      );
    case "formation_preparing":
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-xl border border-border-card bg-Fill_Quatiary px-4 py-2.5 text-sm text-Label-Tertiary",
            className,
          )}
        >
          포메이션 준비 중
        </span>
      );
    case "formation_confirm":
      return (
        <Button
          variant="primary"
          size="m"
          className={cn(base, className)}
          onClick={() => {
            if (selectedTeamIdNum == null) {
              toast.error("팀을 선택한 뒤 다시 시도해 주세요.");
              return;
            }
            openFormationLineupModal({
              matchId: primary.matchId,
              teamId: selectedTeamIdNum,
            });
          }}
        >
          포메이션 확인
        </Button>
      );
    case "copy_team_code":
      return (
        <Button
          variant="primary"
          size="m"
          className={cn(base, className)}
          onClick={onCopyTeamCode}
        >
          팀 코드 복사
        </Button>
      );
  }
}
