"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Player } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import type { ModalPropsMap } from "@/components/modals/types";
import {
  getFormationRosterPlayerKey,
} from "@/lib/formation/roster/formationRosterPlayerKey";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
import type { Position } from "@/types/position";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import FormationDraftSubTeamToggle from "@/components/formation/player-list/FormationDraftSubTeamToggle";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useModal from "@/hooks/useModal";
import ModalLayout from "./ModalLayout";

function cloneDraftMap(map: InHouseDraftTeamByPlayerKey): InHouseDraftTeamByPlayerKey {
  return { ...map };
}

/**
 * 전체 참석자를 한 화면에서 A/B/미배정으로 나누는 모바일 전용 드래프트 모달.
 * `Modals` / `ModalLayout` 경유 — 스크롤 락은 전역 모달 스토어에서 처리.
 */
export default function FormationMobileTeamDraftModal({
  players,
  initialDraftByKey,
  onApply,
}: ModalPropsMap["FORMATION_MOBILE_TEAM_DRAFT"]) {
  const { hideModal } = useModal();
  const [pending, setPending] = useState<InHouseDraftTeamByPlayerKey>(() =>
    cloneDraftMap(initialDraftByKey),
  );
  const [index, setIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setPending(cloneDraftMap(initialDraftByKey));
    setIndex(0);
  }, [initialDraftByKey]);

  const safeIndex = Math.min(Math.max(index, 0), Math.max(players.length - 1, 0));
  const current = players[safeIndex];

  const scrollToIndex = useCallback((i: number) => {
    const el = itemRefs.current[i];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  useEffect(() => {
    if (players.length === 0) return;
    const t = window.setTimeout(() => scrollToIndex(safeIndex), 50);
    return () => window.clearTimeout(t);
  }, [players.length, safeIndex, scrollToIndex]);

  const choiceFor = useCallback(
    (player: Player): InHouseDraftTeamChoice => {
      const k = getFormationRosterPlayerKey(player);
      return pending[k] ?? null;
    },
    [pending],
  );

  const setChoiceForPlayer = useCallback((player: Player, team: InHouseDraftTeamChoice) => {
    const key = getFormationRosterPlayerKey(player);
    setPending((prev) => {
      const next = { ...prev };
      if (team === null) {
        delete next[key];
      } else {
        next[key] = team;
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    onApply(pending);
    hideModal();
  }, [onApply, hideModal, pending]);

  const canNavigate = players.length > 1;

  return (
    <ModalLayout
      title="팀 드래프트"
      wrapperClassName="max-w-lg w-full gap-y-4 md:max-w-lg"
    >
      <div className="flex min-h-0 flex-col gap-4 px-1 pb-2">
        {players.length === 0 || current == null ? (
          <p className="py-6 text-center text-sm text-Label-Tertiary">
            참석 선수가 없습니다.
          </p>
        ) : (
          <>
            <ul className="m-0 flex list-none gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 pt-1">
              {players.map((player, i) => {
                const { src, fallbackSrc } =
                  getFormationPlayerProfileAvatarUrls(player);
                const rosterKey = getFormationRosterPlayerKey(player);
                const isActive = i === safeIndex;
                return (
                  <li
                    key={rosterKey}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="w-[min(100%,20rem)] shrink-0 snap-center"
                  >
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className={cn(
                        "flex w-full flex-col items-center gap-3 rounded-xl border px-4 py-5 text-left touch-manipulation",
                        isActive
                          ? "border-Position-MF-Green bg-surface-secondary/80"
                          : "border-border-card bg-surface-secondary/40 opacity-80",
                      )}
                    >
                      <ProfileAvatar
                        src={src}
                        fallbackSrc={fallbackSrc}
                        alt=""
                        size={72}
                      />
                      <PositionChip
                        position={player.position as Position}
                        variant="outline"
                      />
                      <span className="line-clamp-2 text-center text-base font-semibold text-Label-Primary">
                        {player.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {canNavigate ? (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full border border-border-card p-2 text-Label-Primary touch-manipulation disabled:opacity-40"
                  aria-label="이전 선수"
                  disabled={safeIndex <= 0}
                  onClick={() => setIndex((v) => Math.max(0, v - 1))}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <span className="text-xs tabular-nums text-Label-Tertiary">
                  {safeIndex + 1} / {players.length}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-border-card p-2 text-Label-Primary touch-manipulation disabled:opacity-40"
                  aria-label="다음 선수"
                  disabled={safeIndex >= players.length - 1}
                  onClick={() =>
                    setIndex((v) => Math.min(players.length - 1, v + 1))
                  }
                >
                  <ChevronRight className="size-6" />
                </button>
              </div>
            ) : null}

            <div className="flex justify-center rounded-xl bg-surface-primary/80 px-3 py-4">
              <FormationDraftSubTeamToggle
                value={choiceFor(current)}
                onChange={(team) => setChoiceForPlayer(current, team)}
                playerName={current.name}
              />
            </div>
          </>
        )}

        <div className="flex gap-2 border-t border-border-card pt-4">
          <Button
            type="button"
            variant="ghost"
            size="l"
            className="flex-1"
            onClick={() => hideModal()}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="l"
            className="flex-1"
            onClick={handleSave}
            disabled={players.length === 0}
          >
            저장
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
