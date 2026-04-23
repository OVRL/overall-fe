"use client";

import { FORMATION_POSITIONS } from "@/constants/formations";
import type { Player, QuarterData } from "@/types/formation";

function lineupPlayerList(
  quarter: QuarterData,
): { index: number; position: string; player: Player | null }[] {
  const positions = FORMATION_POSITIONS[quarter.formation] || [];
  return positions.map((posKey, index) => ({
    index,
    position: posKey,
    player: quarter.lineup?.[index] ?? null,
  }));
}

type FormationCheckLineupPlayerPanelProps = {
  quarter: QuarterData;
  roster: Player[];
};

/**
 * 우측 명단: 선발 슬롯 순 + 교체(명단에 있으나 선발에 없는 선수).
 */
export default function FormationCheckLineupPlayerPanel({
  quarter,
}: FormationCheckLineupPlayerPanelProps) {
  const rows = lineupPlayerList(quarter);

  return (
    <div className="min-w-0 w-full md:w-38 shrink-0 text-white text-sm">
      <div className="flex flex-col gap-2 h-full">
        <ol className="flex flex-col gap-1 list-none p-0 m-0 overflow-y-auto scrollbar-hide py-8">
          {rows.map(({ index, position, player }) => (
            <li
              key={`${quarter.id}-${index}-${position}`}
              className="flex justify-between gap-3 text-xs md:text-sm px-1 py-2"
            >
              <span className="text-white font-medium text-sm shrink-0 w-6 text-right">
                {index + 1}
              </span>
              <span className="flex-1 truncate text-white text-sm font-extrabold text-left">
                {player?.name ?? "—"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
