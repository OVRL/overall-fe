import TeamItem from "./_components/TeamItem";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";
import type {
  TeamSearchItem,
  TeamSearchResult,
  ExternalTeamItem,
} from "@/hooks/useTeamSearch";

interface TeamListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: TeamSearchItem[];
  externalTeam: ExternalTeamItem | null;
  selectedTeam: TeamSearchResult | null;
  onSelect: (team: TeamSearchResult) => void;
}

function getTeamKey(team: TeamSearchResult): string {
  if (team.id !== null) return `team-${team.id}`;
  return `external-${team.name}`;
}

const TeamListSection = ({
  keyword,
  isSearching,
  results,
  externalTeam,
  selectedTeam,
  onSelect,
}: TeamListSectionProps) => {
  const selectedKey =
    selectedTeam !== null ? getTeamKey(selectedTeam) : null;

  const renderTeamList = () => {
    if (isSearching) {
      return <SearchLoadingList count={3} />;
    }

    if (keyword && results.length === 0 && !externalTeam) {
      return <SearchEmptyState message="검색 결과가 없습니다." />;
    }

    return (
      <ul className="flex flex-col">
        {results.map((team) => (
          <TeamItem
            key={team.id}
            team={team}
            isSelected={selectedKey === getTeamKey(team)}
            onSelect={onSelect}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col h-full pl-1 gap-y-6">
      {/* 팀 검색 결과 섹션 */}
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold text-sm leading-4 text-Label-Primary">
          팀 목록
        </span>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide py-1">
          {renderTeamList()}
        </div>
      </div>

      {/* 외부팀으로 추가 섹션 (PlayerSearchModal의 용병으로 추가와 동일) */}
      {externalTeam && !isSearching && (
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            외부팀으로 추가
          </span>
          <TeamItem
            team={externalTeam}
            isSelected={selectedKey === getTeamKey(externalTeam)}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
};

export default TeamListSection;
