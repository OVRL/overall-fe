"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { HomeUpcomingMatchLayoutSnapshot } from "@/lib/relay/ssr/buildHomeUpcomingMatchLayoutSnapshot";

const HomeUpcomingMatchLayoutSnapshotContext =
  createContext<HomeUpcomingMatchLayoutSnapshot | null>(null);

type HomeUpcomingMatchLayoutSnapshotProviderProps = {
  snapshot: HomeUpcomingMatchLayoutSnapshot | null;
  children: ReactNode;
};

/**
 * `loadLayoutSSR`가 계산한 홈 다가오는 경기 레이아웃 스냅샷을 트리에 주입합니다.
 * (데이터 파생은 서버 로더 책임 — Provider는 전달만)
 */
export function HomeUpcomingMatchLayoutSnapshotProvider({
  snapshot,
  children,
}: HomeUpcomingMatchLayoutSnapshotProviderProps) {
  return (
    <HomeUpcomingMatchLayoutSnapshotContext.Provider value={snapshot}>
      {children}
    </HomeUpcomingMatchLayoutSnapshotContext.Provider>
  );
}

export function useHomeUpcomingMatchLayoutSnapshot(): HomeUpcomingMatchLayoutSnapshot | null {
  return useContext(HomeUpcomingMatchLayoutSnapshotContext);
}
