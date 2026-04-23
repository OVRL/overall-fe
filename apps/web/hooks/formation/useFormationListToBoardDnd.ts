import { useCallback, useId, useMemo, useState } from "react";
import {
  PointerSensor,
  TouchSensor,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { validateInHouseListToBoardDnD } from "@/lib/formation/roster/validateInHouseListToBoardDnD";
import { toast } from "@/lib/toast";

export type UseFormationListToBoardDndParams = {
  matchType: "MATCH" | "INTERNAL";
  formationRosterViewMode: FormationRosterViewMode;
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  assignPlayer: (
    quarterId: number,
    positionIndex: number,
    player: Player,
  ) => void;
  setCurrentQuarterId: (id: number | null) => void;
  /** 포인터와 드롭 존 중심 거리가 이 값 미만이면 후보로 스냅 (모바일 40, 데스크톱 30) */
  hitRadiusPx: number;
  /** 모바일 터치 드래그 시 true */
  enableTouchSensor?: boolean;
};

function createProximityCollisionDetection(
  hitRadiusPx: number,
): CollisionDetection {
  return (args) => {
    const { pointerCoordinates, droppableContainers, droppableRects } = args;
    if (!pointerCoordinates) return rectIntersection(args);

    const collisions = [];
    for (const container of droppableContainers) {
      const rect = droppableRects.get(container.id);
      if (rect) {
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const dx = pointerCoordinates.x - center.x;
        const dy = pointerCoordinates.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < hitRadiusPx) {
          collisions.push({
            id: container.id,
            data: { droppableContainer: container, value: distance },
          });
        }
      }
    }
    return collisions.sort(
      (a, b) => (a.data?.value as number) - (b.data?.value as number),
    );
  };
}

/**
 * 명단(또는 동일 데이터 계열)에서 보드 슬롯으로의 @dnd-kit 리스트→보드 드래그 공통 훅.
 */
export function useFormationListToBoardDnd({
  matchType,
  formationRosterViewMode,
  getDraftTeam,
  assignPlayer,
  setCurrentQuarterId,
  hitRadiusPx,
  enableTouchSensor = false,
}: UseFormationListToBoardDndParams) {
  const dndId = useId();
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const collisionDetection = useMemo(
    () => createProximityCollisionDetection(hitRadiusPx),
    [hitRadiusPx],
  );

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const sensors = useSensors(
    pointerSensor,
    ...(enableTouchSensor ? [touchSensor] : []),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const player = event.active.data.current?.player as Player;
    if (player) setActivePlayer(player);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActivePlayer(null);
      const { over } = event;
      if (!over) return;
      if (formationRosterViewMode === "draft") return;

      const player = event.active.data.current?.player as Player;
      if (!player) return;

      const dragSourceType = event.active.data.current?.type as
        | string
        | undefined;
      const check = validateInHouseListToBoardDnD(
        matchType,
        formationRosterViewMode,
        dragSourceType,
        player,
        getDraftTeam,
      );
      if (!check.allowed) {
        toast.error(check.message);
        return;
      }

      const quarterId = over.data.current?.quarterId as number;
      const positionIndex = over.data.current?.positionIndex as number;

      if (quarterId != null && positionIndex !== undefined) {
        assignPlayer(quarterId, positionIndex, player);
        setCurrentQuarterId(quarterId);
      }
    },
    [
      assignPlayer,
      formationRosterViewMode,
      getDraftTeam,
      matchType,
      setCurrentQuarterId,
    ],
  );

  return {
    dndId,
    sensors,
    collisionDetection,
    activePlayer,
    handleDragStart,
    handleDragEnd,
  };
}
