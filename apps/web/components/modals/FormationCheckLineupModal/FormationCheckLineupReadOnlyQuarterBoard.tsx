"use client";

import ObjectField from "@/components/ui/ObjectField";
import FormationPlayerImageThumbnail from "@/components/formation/board/FormationPlayerImageThumbnail";
import { FORMATION_POSITIONS } from "@/constants/formations";
import {
  DESKTOP_CROP,
  MOBILE_CROP,
  getFieldCoordinates,
  getRelativePosition,
} from "@/constants/formationCoordinates";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import { getInHouseFormationForTeam } from "@/lib/formation/inHouseQuarterFormations";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { QuarterData } from "@/types/formation";
import type { Position } from "@/types/position";
import { cn } from "@/lib/utils";

/** 내전 쿼터에서 A/B 탭에 맞는 `formation`·`lineup`을 반영한 표시용 쿼터. */
export function resolveQuarterForInHouseTab(
  q: QuarterData,
  inHouseSubTeam: "A" | "B" | null,
): QuarterData {
  if (q.type !== "IN_HOUSE" || inHouseSubTeam == null) return q;
  const formation = getInHouseFormationForTeam(q, inHouseSubTeam);
  const rawLineup = inHouseSubTeam === "A" ? q.teamA : q.teamB;
  const lineup =
    rawLineup != null && Object.keys(rawLineup).length > 0
      ? { ...rawLineup }
      : { ...(q.lineup ?? {}) };
  return { ...q, formation, lineup };
}

type FormationCheckLineupReadOnlyQuarterBoardProps = {
  quarter: QuarterData;
  className?: string;
};

/**
 * `QuarterFormationBoard`와 동일한 좌표계(`formationCoordinates` + `FORMATION_POSITIONS`)로
 * 읽기 전용 필드·슬롯만 렌더합니다.
 */
export default function FormationCheckLineupReadOnlyQuarterBoard({
  quarter,
  className,
}: FormationCheckLineupReadOnlyQuarterBoardProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formationPositions = FORMATION_POSITIONS[quarter.formation] || [];

  return (
    <div className={cn("relative w-full rounded-lg", className)}>
      <ObjectField
        type="full"
        className="w-full"
        crop={(isDesktop ?? false) ? DESKTOP_CROP : MOBILE_CROP}
        autoAspect={true}
      >
        <div className="absolute inset-0 pointer-events-none">
          {formationPositions.map((posKey, index) => {
            const position = posKey as Position;
            const fieldCoords = getFieldCoordinates(quarter.formation, position);
            if (!fieldCoords) return null;
            const styleCoords = getRelativePosition(
              fieldCoords,
              isDesktop ?? false,
            );
            const player = quarter.lineup?.[index] ?? null;
            const slotProfile =
              player != null
                ? getFormationPlayerProfileAvatarUrls(player)
                : null;

            return (
              <div
                key={`${quarter.id}-${index}-${position}`}
                className="absolute flex items-center justify-center w-12 h-12 pointer-events-none"
                style={{
                  left: styleCoords.left,
                  top: styleCoords.top,
                  marginLeft: "-1.5rem",
                  marginTop: "-1.5rem",
                }}
              >
                {player != null && slotProfile != null ? (
                  <FormationPlayerImageThumbnail
                    imgUrl={slotProfile.src}
                    imgFallbackSrc={slotProfile.fallbackSrc}
                    playerName={player.name}
                    playerSeason={player.season}
                    className="transition-transform"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-card bg-surface-card/80 text-[10px] font-bold text-Label-Tertiary">
                    {position}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </ObjectField>
    </div>
  );
}
