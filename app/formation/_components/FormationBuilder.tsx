"use client";

import React from "react";
import dynamic from "next/dynamic";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useFormationBuilderController } from "@/app/formation/_hooks/useFormationBuilderController";
import FormationBuilderMobile from "./FormationBuilderMobile";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";
import FormationHeader from "./FormationHeader";
import type { QuarterData } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import type { FormationMatchFormationPrimarySource } from "@/types/formationMatchPageSnapshot";
import type { MatchQuarterSpec } from "@/app/formation/_types/matchQuarterSpec";

export type { MatchQuarterSpec } from "@/app/formation/_types/matchQuarterSpec";

/** 데스크톱 전용 DnD 번들을 모바일에서 로드하지 않도록 dynamic import */
const FormationBuilderDesktopWithDnd = dynamic(
  () => import("./FormationBuilderDesktopWithDnd").then((m) => m.default),
  {
    ssr: false,
    loading: () => <FormationBuilderContentSkeleton />,
  },
);

interface FormationBuilderProps {
  scheduleCard: React.ReactNode;
  matchQuarterSpec?: MatchQuarterSpec | null;
  savedInitialQuarters?: QuarterData[] | null;
  savedInitialInHouseDraftTeamByKey?: InHouseDraftTeamByPlayerKey | null;
  savedDraftMatchFormationId?: number | null;
  savedLatestConfirmedMatchFormationId?: number | null;
  savedInitialFormationPrimarySource?: FormationMatchFormationPrimarySource | null;
  savedInitialFormationSourceRevision?: string | null;
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태는 `useFormationBuilderController`, 1024px 기준 데스크/모바일 분기.
 * 선수 풀은 `FormationMatchPlayersProvider`(SSR 데이터)에서 읽습니다.
 */
export default function FormationBuilder({
  scheduleCard,
  matchQuarterSpec = null,
  savedInitialQuarters = null,
  savedInitialInHouseDraftTeamByKey = null,
  savedDraftMatchFormationId = null,
  savedLatestConfirmedMatchFormationId = null,
  savedInitialFormationPrimarySource = null,
  savedInitialFormationSourceRevision = null,
}: FormationBuilderProps) {
  const isLgOrBelow = useIsMobile(1023);
  const {
    commonProps,
    handleReset,
    handleSaveConfirm,
    isCreateFormationInFlight,
    isConfirmInFlight,
    isUpdateForConfirmInFlight,
    userId,
  } = useFormationBuilderController({
    matchQuarterSpec,
    savedInitialQuarters,
    savedInitialInHouseDraftTeamByKey,
    savedDraftMatchFormationId,
    savedLatestConfirmedMatchFormationId,
    savedInitialFormationPrimarySource,
    savedInitialFormationSourceRevision,
  });

  const content = isLgOrBelow ? (
    <FormationBuilderMobile scheduleCard={scheduleCard} {...commonProps} />
  ) : (
    <FormationBuilderDesktopWithDnd
      scheduleCard={scheduleCard}
      {...commonProps}
    />
  );

  return (
    <div
      className={
        isLgOrBelow
          ? "min-h-dvh pt-safe bg-surface-primary flex flex-col"
          : "h-dvh max-h-dvh overflow-hidden pt-safe bg-surface-primary flex flex-col"
      }
    >
      <FormationHeader
        onReset={handleReset}
        onSaveConfirm={userId != null ? handleSaveConfirm : undefined}
        isSaveConfirmPending={
          isCreateFormationInFlight ||
          isConfirmInFlight ||
          isUpdateForConfirmInFlight
        }
      />
      <main
        className={
          isLgOrBelow
            ? "flex-1 flex flex-col min-h-0 px-3 md:px-6 py-4 w-full items-center bg-surface-primary"
            : "flex-1 flex flex-col min-h-0 overflow-hidden px-3 md:px-6 py-4 w-full items-center bg-surface-primary"
        }
      >
        {content}
      </main>
    </div>
  );
}
