import PlayerItem from "./_components/PlayerItem";
import Icon from "@/components/ui/Icon";
import closeCircle from "@/public/icons/close-circle.svg";
import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";
import type { PendingPlayerItem } from "@/hooks/usePlayerSearch";

interface PlayerListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: PendingPlayerItem[];
  mercenary: PendingPlayerItem | null;
  pendingChanges: Map<number, PendingPlayerItem>;
  onToggle: (player: PendingPlayerItem) => void;
}

const PlayerListSection = ({
  keyword,
  isSearching,
  results,
  mercenary,
  pendingChanges,
  onToggle,
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
              onSelect={() => onToggle(player)}
            />
          );
        })}
      </ul>
    );
  };

  const previewPlayers = Array.from(pendingChanges.values());

  return (
    <div className="flex flex-col h-full pl-1 gap-y-6 overflow-y-auto scrollbar-hide pr-2">
      {/* 선수단 섹션 */}
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold text-sm leading-4 text-Label-Primary">
          선수단
        </span>
        <div className="py-1">{renderPlayerList()}</div>
      </div>

      {/* 용병으로 추가 섹션 */}
      {mercenary && !isSearching && (
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            용병으로 추가
          </span>
          <PlayerItem
            player={mercenary}
            isSelected={mercenary.currentStatus === "ATTEND"}
            onSelect={() => onToggle(mercenary)}
          />
        </div>
      )}

      {/* 변경 사항 미리보기 섹션 */}
      {pendingChanges.size > 0 && (
        <div className="flex flex-col gap-y-2 mt-4 pt-4 border-t border-border-card">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            변경 사항 미리보기
          </span>
          <div className="flex flex-col gap-y-1">
            {previewPlayers.map((p) => (
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
                    onClick={() => onToggle(p)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerListSection;
