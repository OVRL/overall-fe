"use client";

import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { findTeamByInviteCodeQuery } from "@/__generated__/findTeamByInviteCodeQuery.graphql";
import Button from "@/components/ui/Button";
import { EmblemImage } from "@/components/ui/EmblemImage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ModalLayout from "@/components/modals/ModalLayout";
import useModal from "@/hooks/useModal";
import {
  getUniformImagePath,
  parseUniformDesignFromApi,
  type UniformDesign,
} from "@/app/create-team/_lib/uniformDesign";
import type { ModalPropsMap } from "@/components/modals/types";
import { FindTeamByInviteCodeQuery } from "@/lib/relay/queries/findTeamByInviteCodeQuery";
import { formatRegionSearchDisplay } from "@/lib/region/formatRegionSearchDisplay";
import { cn } from "@/lib/utils";
import { TeamInfoModalJoinFooter } from "@/components/modals/TeamInfoModal/TeamInfoModalJoinFooter";
import {
  findPendingJoinRequestIdForTeam,
  findRejectedReasonForTeam,
  formatFoundedLabel,
} from "@/components/modals/TeamInfoModal/teamInfoModalUtils";

function InfoBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 text-center w-full", className)}>
      <span className="text-[0.8125rem] text-gray-700 font-medium">
        {label}
      </span>
      <span className="text-[0.9375rem] font-semibold text-white">{value}</span>
    </div>
  );
}

/** 홈/어웨이 유니폼 썸네일 + 라벨 한 세트 */
function UniformPreview({
  design,
  alt,
  label,
}: {
  design: UniformDesign;
  alt: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-13.5">
        <EmblemImage
          src={getUniformImagePath(design)}
          alt={alt}
          fill
          className="object-contain"
          sizes="5.25rem"
        />
      </div>
      <span className="text-[0.9375rem] text-white font-semibold">{label}</span>
    </div>
  );
}

const WRAPPER_CLASS = cn(
  "relative max-w-[min(100%,22.5rem)] w-full md:w-90 !gap-y-4 overflow-visible",
  "px-5 pb-5 pt-1",
);

/** Relay 대기 — `ModalLoadingFallback`과 동일하게 스피너만 사용(스켈레톤 미사용) */
function TeamInfoModalFallback() {
  return (
    <ModalLayout title="팀 정보" wrapperClassName={WRAPPER_CLASS}>
      <div
        className="flex min-h-48 w-full flex-col items-center justify-center gap-4 font-pretendard"
        aria-busy="true"
        aria-live="polite"
        role="status"
      >
        <LoadingSpinner label="팀 정보를 불러오는 중입니다." size="md" />
      </div>
    </ModalLayout>
  );
}

function TeamInfoModalLoaded({ inviteCode }: ModalPropsMap["TEAM_INFO"]) {
  const { hideModal } = useModal();

  const data = useLazyLoadQuery<findTeamByInviteCodeQuery>(
    FindTeamByInviteCodeQuery,
    { inviteCode },
    {
      // store-only는 프리패치 실패 시 스토어 비어 Suspense가 끝나지 않을 수 있어 store-or-network로 복구 가능하게 함.
      fetchPolicy: "store-or-network",
    },
  );

  const team = data.findTeamByInviteCode;

  if (team == null) {
    return (
      <ModalLayout title="팀 정보" wrapperClassName={WRAPPER_CLASS}>
        <div
          className="flex w-full flex-col items-center gap-6 font-pretendard text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-gray-500 text-[0.9375rem]">
            해당 초대 코드로 조회된 팀이 없습니다.
          </p>
          <Button
            type="button"
            variant="primary"
            size="xl"
            className="w-full text-Label-Fixed_black"
            onClick={hideModal}
          >
            확인
          </Button>
        </div>
      </ModalLayout>
    );
  }

  const regionFromSearch = formatRegionSearchDisplay(team.region);
  const activityAreaDisplay =
    regionFromSearch !== ""
      ? regionFromSearch
      : (team.activityArea?.trim() ?? "") || "—";

  const teamName = team.name?.trim() || "이름 없는 팀";
  const description = team.description?.trim() ?? "";

  const homeUniformDesign = parseUniformDesignFromApi(team.homeUniform);
  const awayUniformDesign = parseUniformDesignFromApi(team.awayUniform);

  return (
    <ModalLayout title="팀 정보" wrapperClassName={WRAPPER_CLASS}>
      <div className="flex w-full flex-col items-center gap-8 font-pretendard">
        <div className="relative size-25 shrink-0 overflow-hidden rounded-xl border border-border-card bg-surface-elevated">
          <EmblemImage
            src={team.emblem}
            alt={`${teamName} 로고`}
            fill
            className="object-cover"
            sizes="6.25rem"
            priority
          />
        </div>

        <div className="flex flex-col gap-3 text-center">
          <h3 className="text-[1.75rem] font-bold text-white leading-[150%]">
            {teamName}
          </h3>
          <p className="text-gray-500 whitespace-pre-wrap">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-5">
          <InfoBlock label="주요 활동 지역" value={activityAreaDisplay} />
          <InfoBlock
            label="창단일"
            value={formatFoundedLabel(team.historyStartDate)}
          />
          <div className="flex flex-col gap-3 w-full">
            <span className="text-[0.8125rem] text-gray-700 font-medium text-center">
              유니폼
            </span>
            <div className="flex justify-center gap-8">
              <UniformPreview
                design={homeUniformDesign}
                alt="홈 유니폼"
                label="Home"
              />
              <UniformPreview
                design={awayUniformDesign}
                alt="어웨이 유니폼"
                label="Away"
              />
            </div>
          </div>
        </div>

        <TeamInfoModalJoinFooter
          inviteCode={inviteCode}
          initialPendingJoinRequestId={findPendingJoinRequestIdForTeam(
            data.findMyJoinRequest,
            team.id,
          )}
          rejectedReason={findRejectedReasonForTeam(
            data.findMyJoinRequest,
            team.id,
          )}
        />
      </div>
    </ModalLayout>
  );
}

export default function TeamInfoModal(props: ModalPropsMap["TEAM_INFO"]) {
  return (
    <Suspense fallback={<TeamInfoModalFallback />}>
      <TeamInfoModalLoaded key={props.inviteCode} {...props} />
    </Suspense>
  );
}
