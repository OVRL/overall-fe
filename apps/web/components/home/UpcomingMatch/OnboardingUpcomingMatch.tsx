"use client";

import Image from "next/image";
import directorImage from "@/public/images/director.webp";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useInviteCodeForTeam } from "./useInviteCodeForTeam";

type OnboardingUpcomingMatchProps = {
  /** 선택 팀 숫자 ID. 없으면 초대 코드 조회/복사 불가 */
  teamId: number | null;
};

/** 오른쪽 CTA 슬롯 공통 위치·패딩 */
const INVITE_ACTION_BUTTON_CLASS =
  "md:absolute right-0 top-1/2 md:size-fit min-h-11 min-w-11 md:-translate-y-1/2 p-3";

/**
 * 팀 ID·조회 상태·코드 유무를 바탕으로 단일 액션 상태를 계산합니다.
 * UI 분기는 슬롯 컴포넌트에서 이 타입만 소비합니다.
 */
type InviteCodeAction =
  | { kind: "no_team" }
  | { kind: "loading" }
  | { kind: "create"; onClick: () => void; disabled: boolean }
  | { kind: "copy"; onClick: () => void };

function resolveInviteCodeAction(
  teamId: number | null,
  isLoading: boolean,
  inviteCode: string | null,
  isInFlight: boolean,
  copyCode: () => void,
  requestCreateInviteCode: () => void,
): InviteCodeAction {
  if (teamId == null) return { kind: "no_team" };
  if (isLoading) return { kind: "loading" };
  if (inviteCode != null) return { kind: "copy", onClick: copyCode };
  return {
    kind: "create",
    onClick: requestCreateInviteCode,
    disabled: isInFlight,
  };
}

/** 온보딩 카드 우측: 초대 코드 관련 단일 버튼/로딩 슬롯 */
function OnboardingInviteCodeActionSlot({
  action,
}: {
  action: InviteCodeAction;
}) {
  switch (action.kind) {
    case "no_team":
      return (
        <Button
          variant="primary"
          size="m"
          type="button"
          disabled
          className={INVITE_ACTION_BUTTON_CLASS}
          aria-label="팀을 선택한 뒤 코드를 복사할 수 있습니다"
        >
          팀 코드 복사
        </Button>
      );
    case "loading":
      return (
        <Button
          variant="primary"
          size="m"
          type="button"
          disabled
          className={INVITE_ACTION_BUTTON_CLASS}
          aria-busy="true"
        >
          <LoadingSpinner label="초대 코드를 불러오는 중" size="sm" />
        </Button>
      );
    case "create":
      return (
        <Button
          variant="primary"
          size="m"
          type="button"
          className={INVITE_ACTION_BUTTON_CLASS}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          초대 코드 만들기
        </Button>
      );
    case "copy":
      return (
        <Button
          variant="primary"
          size="m"
          type="button"
          className={INVITE_ACTION_BUTTON_CLASS}
          onClick={action.onClick}
        >
          팀 코드 복사
        </Button>
      );
  }
}

const OnboardingUpcomingMatch = ({ teamId }: OnboardingUpcomingMatchProps) => {
  const {
    inviteCode,
    isLoading,
    isInFlight,
    requestCreateInviteCode,
    copyCode,
  } = useInviteCodeForTeam(teamId);

  const action = resolveInviteCodeAction(
    teamId,
    isLoading,
    inviteCode,
    isInFlight,
    copyCode,
    requestCreateInviteCode,
  );

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center gap-2">
      <div className="relative flex flex-col gap-1">
        <p className="text-center text-xs font-medium text-gray-500">
          팀원에게 초대 코드를 공유하세요
        </p>
        <p className="text-center font-medium text-[#f7f8f8]">
          팀 운영을 위해 선수를 영입하세요.
        </p>
        <Image
          src={directorImage}
          height={66}
          className="absolute -right-17 top-1/2 -translate-y-1/2 hidden md:block"
          alt="팔장끼고 눈 감고 있는 감독 이미지"
        />
      </div>

      <OnboardingInviteCodeActionSlot action={action} />
    </div>
  );
};

export default OnboardingUpcomingMatch;
