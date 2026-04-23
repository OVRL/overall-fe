"use client";

import { Activity, Suspense, useEffect, useMemo, useRef } from "react";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { ErrorBoundary } from "react-error-boundary";
import MomOverlay from "./MomOverlay";
import { useMomResultOverlayStore } from "./momResultOverlayStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { findMatchMomQuery } from "@/__generated__/findMatchMomQuery.graphql";
import { FindMatchMomQuery } from "@/lib/relay/queries/findMatchMomQuery";
import type { GachaCardProps } from "./GachaCard";
import type { PreloadedQuery } from "react-relay";
import { toast } from "@/lib/toast";
import { mapFindMatchMomToGachaCandidates } from "@/lib/mom/mapFindMatchMomToGachaCandidates";

const EMPTY_ROWS: ReadonlyArray<
  NonNullable<findMatchMomQuery["response"]["findMatchMom"]>[number]
> = [];

export default function MomResultOverlayHost() {
  const isOpen = useMomResultOverlayStore((s) => s.isOpen);
  const isFetching = useMomResultOverlayStore((s) => s.isFetching);
  const sessionId = useMomResultOverlayStore((s) => s.sessionId);
  const request = useMomResultOverlayStore((s) => s.request);
  const requestId = useMomResultOverlayStore((s) => s.requestId);
  const openWithCandidates = useMomResultOverlayStore(
    (s) => s.openWithCandidates,
  );
  const clearRequest = useMomResultOverlayStore((s) => s.clearRequest);
  const close = useMomResultOverlayStore((s) => s.close);

  useScrollLock(isOpen);

  // 버튼 클릭(=openByMatch) 시에만 loadQuery가 호출되도록 queryRef는 기본 null로 유지
  const [queryRef, loadQuery, disposeQuery] =
    useQueryLoader<findMatchMomQuery>(FindMatchMomQuery);

  useEffect(() => {
    if (!request) return;

    // 중요: 렌더 단계가 아니라 effect에서만 호출 (Relay 문서 권장)
    loadQuery(
      { matchId: request.matchId, teamId: request.teamId },
      {
        // 버튼을 다시 누르면 "다시 fetching"이 보장되도록 항상 네트워크를 탄다
        fetchPolicy: "network-only",
      },
    );
  }, [requestId, request, loadQuery]);

  useEffect(() => {
    // 오버레이가 닫혀있는데 queryRef가 남지 않도록 안전하게 정리
    if (!isOpen && !isFetching) disposeQuery();
  }, [isOpen, isFetching, disposeQuery]);

  // openWithCandidates로 열린 경우(스토어에 candidates가 이미 채워진 경우) fallback 경로
  const candidates = useMomResultOverlayStore((s) => s.candidates);
  const hasCandidatesPayload = candidates.length > 0;

  return (
    <Activity
      mode={isOpen || isFetching ? "visible" : "hidden"}
      name="MomResultOverlay"
    >
      {hasCandidatesPayload ? (
        <MomOverlay key={sessionId} candidates={candidates} onClose={close} />
      ) : queryRef ? (
        <ErrorBoundary
          resetKeys={[requestId, sessionId]}
          onError={() => {
            toast.error("MOM 결과를 불러오지 못했습니다.", {
              description: "잠시 후 다시 시도해 주세요.",
            });
            disposeQuery();
            clearRequest();
          }}
          fallbackRender={() => null}
        >
          {/* 성공했을 때만 오버레이를 열기 위해 로딩 UI는 표시하지 않음 */}
          <Suspense fallback={null}>
            <MomResultOverlayQueryBootstrap
              queryRef={queryRef}
              sessionId={sessionId}
              onOpen={(nextCandidates) => {
                openWithCandidates(nextCandidates);
                disposeQuery();
                clearRequest();
              }}
              onEmpty={() => {
                toast.error("MOM 결과를 불러오지 못했습니다.", {
                  description: "결과가 없거나 조회에 실패했습니다.",
                });
                disposeQuery();
                clearRequest();
              }}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </Activity>
  );
}

function MomResultOverlayQueryBootstrap({
  queryRef,
  sessionId,
  onOpen,
  onEmpty,
}: {
  queryRef: PreloadedQuery<findMatchMomQuery>;
  sessionId: number;
  onOpen: (candidates: GachaCardProps[]) => void;
  onEmpty: () => void;
}) {
  const data = usePreloadedQuery<findMatchMomQuery>(FindMatchMomQuery, queryRef);
  const rows = data.findMatchMom ?? EMPTY_ROWS;

  const candidates = useMemo((): GachaCardProps[] => {
    return mapFindMatchMomToGachaCandidates(rows);
  }, [rows]);

  const lastHandledSessionIdRef = useRef<number | null>(null);

  useEffect(() => {
    // query가 성공적으로 resolve된 시점(=렌더 가능)에만 오버레이를 연다.
    // sessionId는 strict mode 이중 effect에서도 같은 candidates로 열리더라도 store가 다시 열림 처리할 수 있으니 key로 유지.
    if (lastHandledSessionIdRef.current === sessionId) return;
    lastHandledSessionIdRef.current = sessionId;

    if (candidates.length === 0) {
      onEmpty();
      return;
    }
    onOpen(candidates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return null;
}
