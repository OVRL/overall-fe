import PlayerItem from "./_components/PlayerItem";
import Icon from "@/components/ui/Icon";
import closeCircle from "@/public/icons/close-circle.svg";
import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";
import type { Player } from "@/types/formation";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";
import type {
  MercenaryDraftRow,
  MercenaryExistingRow,
  PendingTeamMemberRow,
} from "@/types/formationRosterModal";

interface PlayerListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: PendingTeamMemberRow[];
  existingMercenaries: MercenaryExistingRow[];
  mercenaryDraft: MercenaryDraftRow | null;
  pendingTeamMembers: Map<number, PendingTeamMemberRow>;
  pendingMercenaryCreates: ReadonlySet<string>;
  pendingMercenaryDeletes: ReadonlySet<number>;
  onToggleTeamMember: (player: PendingTeamMemberRow) => void;
  onToggleMercenaryDraft: (registerName: string) => void;
  onToggleMercenaryRemove: (mercenaryId: number) => void;
}

function syntheticDraftPlayer(displayName: string): Player {
  return {
    id: -1,
    name: displayName,
    position: "용병",
    number: 0,
    overall: 0,
  };
}

function syntheticExistingMercenaryPlayer(name: string, mercenaryId: number): Player {
  return {
    id: mercenaryId,
    name,
    position: "용병",
    number: 0,
    overall: 0,
    rosterKind: "MERCENARY",
    mercenaryId,
  };
}

const PlayerListSection = ({
  keyword,
  isSearching,
  results,
  existingMercenaries,
  mercenaryDraft,
  pendingTeamMembers,
  pendingMercenaryCreates,
  pendingMercenaryDeletes,
  onToggleTeamMember,
  onToggleMercenaryDraft,
  onToggleMercenaryRemove,
}: PlayerListSectionProps) => {
  const renderPlayerList = () => {
    if (isSearching) {
      return <SearchLoadingList count={3} />;
    }

    if (keyword && results.length === 0) {
      return <SearchEmptyState message="검색 결과가 없습니다." />;
    }

    return (
      <ul className="flex flex-col">
        {results.map((player) => {
          const isSelected = player.currentStatus === "ATTEND";
          return (
            <PlayerItem
              key={player.teamMemberId}
              player={player}
              isSelected={isSelected}
              onSelect={() => onToggleTeamMember(player)}
            />
          );
        })}
      </ul>
    );
  };

  const previewTeamMembers = Array.from(pendingTeamMembers.values());
  const previewCreates = [...pendingMercenaryCreates];
  const previewDeletes = [...pendingMercenaryDeletes];

  return (
    <div className="flex flex-col h-full pl-1 gap-y-6 overflow-y-auto scrollbar-hide pr-2">
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold text-sm leading-4 text-Label-Primary">
          선수단
        </span>
        <div className="py-1">{renderPlayerList()}</div>
      </div>

      {existingMercenaries.length > 0 && !isSearching && (
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            경기 용병
          </span>
          <ul className="flex flex-col">
            {existingMercenaries.map((m) => (
              <PlayerItem
                key={m.mercenaryId}
                player={syntheticExistingMercenaryPlayer(m.name, m.mercenaryId)}
                isSelected={!m.pendingRemove}
                onSelect={() => onToggleMercenaryRemove(m.mercenaryId)}
              />
            ))}
          </ul>
        </div>
      )}

      {mercenaryDraft && !isSearching && (
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            용병으로 추가
          </span>
          <PlayerItem
            player={syntheticDraftPlayer(mercenaryDraft.displayName)}
            isSelected={mercenaryDraft.willRegister}
            onSelect={() => onToggleMercenaryDraft(mercenaryDraft.registerName)}
          />
        </div>
      )}

      {(previewTeamMembers.length > 0 ||
        previewCreates.length > 0 ||
        previewDeletes.length > 0) && (
        <div className="flex flex-col gap-y-2 mt-4 pt-4 border-t border-border-card">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            변경 사항 미리보기
          </span>
          <div className="flex flex-col gap-y-1">
            {previewTeamMembers.map((p) => (
              <div
                key={p.teamMemberId}
                className="flex justify-between items-center p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-Label-Tertiary truncate max-w-[100px]">
                    {p.name}
                  </span>
                  {p.position !== "용병" && (
                    <PositionChip position={p.position as Position} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${p.currentStatus === "ATTEND" ? "text-primary" : "text-red-500"}`}
                  >
                    {p.currentStatus === "ATTEND" ? "참석 추가" : "참석 취소"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleTeamMember(p)}
                    className="flex items-center justify-center rounded-full p-1 cursor-pointer group hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-offset-1 focus:ring-offset-surface-primary"
                    aria-label={`${p.name}의 변경사항 취소`}
                    title="변경 취소"
                  >
                    <Icon
                      src={closeCircle}
                      alt="취소 아이콘"
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className="text-Fill_Tertiary group-hover:text-red-500 transition-colors"
                    />
                  </button>
                </div>
              </div>
            ))}

            {previewCreates.map((name) => (
              <div
                key={`merc-create-${name}`}
                className="flex justify-between items-center p-2 rounded-md"
              >
                <span className="text-sm text-Label-Tertiary truncate max-w-[160px]">
                  {name} (용병 등록)
                </span>
                <button
                  type="button"
                  onClick={() => onToggleMercenaryDraft(name)}
                  className="flex items-center justify-center rounded-full p-1 cursor-pointer group hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-offset-1 focus:ring-offset-surface-primary"
                  aria-label="용병 등록 예약 취소"
                  title="변경 취소"
                >
                  <Icon
                    src={closeCircle}
                    alt="취소 아이콘"
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className="text-Fill_Tertiary group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>
            ))}

            {previewDeletes.map((id) => {
              const label =
                existingMercenaries.find((m) => m.mercenaryId === id)?.name ??
                `용병 #${id}`;
              return (
                <div
                  key={`merc-del-${id}`}
                  className="flex justify-between items-center p-2 rounded-md"
                >
                  <span className="text-sm text-Label-Tertiary truncate max-w-[160px]">
                    {label} (명단 제거)
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleMercenaryRemove(id)}
                    className="flex items-center justify-center rounded-full p-1 cursor-pointer group hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-offset-1 focus:ring-offset-surface-primary"
                    aria-label="용병 제거 예약 취소"
                    title="변경 취소"
                  >
                    <Icon
                      src={closeCircle}
                      alt="취소 아이콘"
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className="text-Fill_Tertiary group-hover:text-red-500 transition-colors"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerListSection;
