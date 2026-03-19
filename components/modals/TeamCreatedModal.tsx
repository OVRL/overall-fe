"use client";

import Image from "next/image";
import Button from "../ui/Button";
import ModalLayout from "./ModalLayout";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useCelebrationConfetti } from "@/hooks/useCelebrationConfetti";
import { useTeamInviteCode } from "./TeamCreatedModal/useTeamInviteCode";

const DISPLAY_TEXT_LOADING = "불러오는 중...";
const DISPLAY_TEXT_INVITE_PROMPT = "코드를 생성해 팀원을 초대하세요!";

export default function TeamCreatedModal() {
  const { selectedTeamIdNum } = useSelectedTeamId();
  const {
    inviteCode,
    firstLoadFailed,
    isInFlight,
    requestInviteCode,
    copyCode,
  } = useTeamInviteCode(selectedTeamIdNum);

  useCelebrationConfetti();

  const displayText =
    inviteCode != null
      ? inviteCode
      : firstLoadFailed
      ? DISPLAY_TEXT_INVITE_PROMPT
      : DISPLAY_TEXT_LOADING;

  return (
    <ModalLayout
      title="팀 생성 완료"
      wrapperClassName="max-w-125 w-full md:w-125"
    >
      <div className="flex flex-col gap-y-8 justify-center">
        <p className="text-2xl text-white font-bold">
          축하드립니다!
          <br />
          팀이 생성 되었습니다.
        </p>
        <div className="flex flex-col gap-y-5">
          <span>팀원을 초대하세요.</span>
          <div className="flex items-center gap-x-3">
            <span className="h-12 flex-1 px-4 border border-[#3E33E] bg-[#252525] rounded-md flex items-center text-[#a6a5a5] text-sm leading-5.25">
              {displayText}
            </span>
            {inviteCode != null ? (
              <Button
                variant="primary"
                size="l"
                className="w-fit py-3 px-4"
                onClick={copyCode}
              >
                코드 복사
              </Button>
            ) : (
              <Button
                variant="primary"
                size="l"
                className="w-fit py-3 px-4"
                onClick={requestInviteCode}
                disabled={isInFlight}
              >
                초대 코드 만들기
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-center pb-20">
          <Image
            src="/images/team_squad_picture.webp"
            alt="팀 스쿼드 사진"
            height={328}
            width={328}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </ModalLayout>
  );
}
