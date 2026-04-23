"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { EmblemImage } from "@/components/ui/EmblemImage";
import MatchInfoRow from "@/components/formation/MatchScheduleCard/MatchInfoRow";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import type { MatchDisplay } from "./getMatchDisplay";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

const NaverDynamicMap = dynamic(
  () => import("@/components/ui/map/NaverDynamicMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-sm aspect-square mx-auto rounded-[0.625rem] bg-Fill_Tertiary flex items-center justify-center text-Label-Tertiary text-sm">
        지도 정보를 불러오는 중...
      </div>
    ),
  },
);

function getUniformImageByType(
  uniformType: string | null | undefined,
): string {
  if (uniformType === "AWAY") return getUniformImagePath("SOLID_RED");
  return getUniformImagePath("SOLID_WHITE");
}

function getUniformLabel(uniformType: string | null | undefined): string {
  if (uniformType === "AWAY") return "어웨이";
  return "홈";
}

/** SRP: 매칭 상대 섹션 — "상대팀/내전 표시 규칙" 변경 시 이 컴포넌트만 수정 */
export function MatchOpponentSection({
  display,
}: {
  display: Pick<
    MatchDisplay,
    "isInternal" | "opponentLabel" | "emblemSrc" | "showRecord"
  >;
}) {
  return (
    <MatchInfoRow title="매칭 상대" direction="column">
      <div className="flex items-center gap-1">
        <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden bg-border-card">
          <EmblemImage
            src={display.emblemSrc}
            alt={display.isInternal ? "내전 팀 엠블럼" : "상대팀 로고"}
            sizes="1.875rem"
            className="object-contain"
          />
        </div>
        <span className="text-[#F7F8F8] font-semibold text-sm">
          {display.opponentLabel}
        </span>
        {display.showRecord ? (
          <span className="text-Label-Tertiary text-[0.8125rem]">
            전적은 추후 연동 예정입니다.
          </span>
        ) : null}
      </div>
    </MatchInfoRow>
  );
}

/** SRP: 경기 일정 섹션 */
export function MatchScheduleSection({
  formattedDate,
}: {
  formattedDate: string;
}) {
  return (
    <MatchInfoRow title="경기 일정" direction="column">
      <span className="text-[#F7F8F8] font-semibold text-sm">
        {formattedDate}
      </span>
    </MatchInfoRow>
  );
}

/** SRP: 경기 구장 섹션 — 주소 클릭 복사, 지도 표시 규칙 변경 시 이 컴포넌트만 수정 */
export function MatchVenueSection({
  venue,
  hasValidCoordinates,
  onCopyAddress,
}: {
  venue: MatchDisplay["venue"];
  hasValidCoordinates: boolean;
  onCopyAddress: () => void;
}) {
  return (
    <MatchInfoRow title="경기 구장" direction="column">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            onClick={onCopyAddress}
            disabled={!venue?.address}
            className="text-left text-[#F7F8F8] text-sm font-semibold cursor-pointer disabled:cursor-default disabled:opacity-70 hover:underline focus:underline focus:outline-none"
          >
            {venue?.address ?? "-"}
          </button>
        </div>
        {hasValidCoordinates && venue ? (
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[0.625rem] aspect-square max-h-52 px-4">
            <NaverDynamicMap
              latitude={venue.latitude}
              longitude={venue.longitude}
              className="max-w-full! h-full w-full"
            />
          </div>
        ) : null}
      </div>
    </MatchInfoRow>
  );
}

/** SRP: 유니폼 섹션 — 내전이 아닐 때만 렌더. 표시 규칙 변경 시 이 컴포넌트만 수정 */
export function MatchUniformSection({ match }: { match: MatchNode }) {
  const isInternal = match.matchType === "INTERNAL";
  if (isInternal) return null;

  return (
    <MatchInfoRow title="유니폼">
      <div className="flex items-center gap-2 h-7.5">
        <div className="relative w-7.5 h-7.5 shrink-0">
          <Image
            src={getUniformImageByType(match.uniformType)}
            alt="유니폼"
            fill
            sizes="1.875rem"
            quality={100}
            className="object-contain"
            aria-hidden
          />
        </div>
        <span className="text-white text-sm whitespace-nowrap">
          {getUniformLabel(match.uniformType)}
        </span>
      </div>
    </MatchInfoRow>
  );
}

/** SRP: 메모 섹션 */
export function MatchMemoSection({ description }: { description: string }) {
  return (
    <MatchInfoRow title="메모" direction="column">
      <span className="text-white text-sm leading-relaxed">
        {description}
      </span>
    </MatchInfoRow>
  );
}
