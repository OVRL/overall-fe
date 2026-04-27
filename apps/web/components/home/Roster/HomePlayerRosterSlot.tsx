"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIntersectionObserveOnce } from "@/hooks/useIntersectionObserveOnce";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { computeShouldMountHomeRosterPanel } from "./computeShouldMountHomeRosterPanel";
import { useUnblockOnTeamIdChange } from "./useUnblockOnTeamIdChange";
import { HOME_ROSTER_MOBILE_STACK_MEDIA_QUERY } from "./homeRosterBreakpoint";
import RosterPanelPlaceholderSkeleton from "./RosterPanelPlaceholderSkeleton";

const LazyPlayerRosterPanel = dynamic(() => import("./PlayerRosterPanel"), {
  loading: () => <RosterPanelPlaceholderSkeleton />,
});

type HomePlayerRosterSlotProps = {
  className?: string;
};

export default function HomePlayerRosterSlot({
  className,
}: HomePlayerRosterSlotProps) {
  const { selectedTeamIdNum } = useSelectedTeamId();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserveOnce(containerRef);
  const maxBelowLg = useMediaQuery(HOME_ROSTER_MOBILE_STACK_MEDIA_QUERY);
  const isLayoutMobile = maxBelowLg !== false;
  const unblockAfterTeamSwitch = useUnblockOnTeamIdChange(selectedTeamIdNum);
  const hasSelectedTeam = selectedTeamIdNum != null;

  const shouldMount = computeShouldMountHomeRosterPanel({
    hasSelectedTeam,
    isLayoutMobile,
    isInView,
    unblockAfterTeamSwitch,
  });

  return (
    <div ref={containerRef} className="relative h-full w-full flex justify-center">
      {shouldMount ? (
        <LazyPlayerRosterPanel className={className} />
      ) : (
        <RosterPanelPlaceholderSkeleton />
      )}
    </div>
  );
}
