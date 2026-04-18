"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import calendar from "@/public/icons/calendar.svg";
import { useInviteCodeForTeam } from "./useInviteCodeForTeam";

type HomeUpcomingInviteCopyCardProps = {
  teamId: number;
};

/**
 * 다가오는 경기가 없을 때 기본 CTA로 쓰는 팀 초대 코드 복사 카드.
 */
export default function HomeUpcomingInviteCopyCard({
  teamId,
}: HomeUpcomingInviteCopyCardProps) {
  const { inviteCode, isLoading, copyCode, requestCreateInviteCode } =
    useInviteCodeForTeam(teamId);

  const onClick = () => {
    if (inviteCode == null) {
      requestCreateInviteCode();
      return;
    }
    copyCode();
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-center md:justify-start gap-2.5">
        <Icon src={calendar} nofill />
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-semibold leading-6 text-white">
            팀 코드로 초대하기
          </span>
          <span className="text-xs text-Label-Tertiary">
            예정된 경기가 없을 때 팀원을 초대해 보세요.
          </span>
        </div>
      </div>
      <div className="w-full max-w-83.75 mx-auto md:mx-0 md:w-60 shrink-0">
        <Button
          variant="primary"
          size="m"
          className="w-full font-semibold text-Label-Fixed_black text-sm"
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? "불러오는 중…" : "팀 코드 복사"}
        </Button>
      </div>
    </div>
  );
}
