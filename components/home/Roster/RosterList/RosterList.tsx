import PlayerInfoList from "./PlayerInfoList";
import PlayerListCategory from "./PlayerListCategory";
import { useMemberSort } from "@/hooks/useMemberSort";
import type { RosterMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";

const RosterList = ({
  members,
  onMemberSelect,
}: {
  members: readonly RosterMember[];
  onMemberSelect?: (member: RosterMember) => void;
}) => {
  const { sortedMembers, sortConfig, handleSort } = useMemberSort(members);

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-1 overflow-hidden">
      {/* 고정된 헤더 */}
      <div className="flex-none sticky top-0 z-10 bg-surface-card px-0">
        <PlayerListCategory sortConfig={sortConfig} onSort={handleSort} />
      </div>

      {/* 스크롤 가능한 리스트 영역 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-none scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <PlayerInfoList
          members={sortedMembers}
          onMemberSelect={onMemberSelect}
          showHeader={false}
        />

        {/* 데이터가 없을 때의 상태 */}
        {members.length === 0 && (
          <div className="text-gray-500 text-center py-10">
            선수가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterList;
