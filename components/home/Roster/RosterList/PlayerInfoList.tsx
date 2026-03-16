import PlayerListItem from "./PlayerListItem";
import PlayerListHeader from "./PlayerListHeader";
import type { RosterMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";

export { PlayerListHeader };

interface PlayerInfoListProps {
  id?: string;
  members: readonly RosterMember[];
  showHeader?: boolean;
  onMemberSelect?: (member: RosterMember) => void;
}

const PlayerInfoList = ({
  id,
  members,
  showHeader = true,
  onMemberSelect,
}: PlayerInfoListProps) => {
  return (
    <div id={id} className="w-full flex flex-col rounded-tl-xl overflow-hidden">
      {showHeader && <PlayerListHeader />}
      {members.map((member, index) => (
        <PlayerListItem
          key={member.id}
          member={member}
          onClick={() => onMemberSelect?.(member)}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default PlayerInfoList;
