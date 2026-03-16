import PositionChip from "@/components/PositionChip";
import ImgPlayer from "@/components/ui/ImgPlayer";
import type { RosterMember } from "./useFindManyTeamMemberQuery";

// 생년월일 필드 미구축으로 목 데이터 사용
const MOCK_BIRTH_LABEL = "나이 만 30세";
const MOCK_PLAYER_IMAGE = "/images/player/img_player_2.webp";

function formatJoinedAt(joinedAt: unknown): string {
  if (joinedAt == null) return "-";
  if (typeof joinedAt !== "string") return "-";
  try {
    const d = new Date(joinedAt);
    if (Number.isNaN(d.getTime())) return "-";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}. ${m}. ${day}`;
  } catch {
    return "-";
  }
}

interface PlayerProfileHeaderProps {
  member: Readonly<RosterMember>;
}

const PlayerProfileHeader = ({ member }: PlayerProfileHeaderProps) => {
  const name = member.user?.name ?? "";
  const profileImg =
    member.profileImg ?? member.user?.profileImage ?? MOCK_PLAYER_IMAGE;

  return (
    <div className="relative w-full h-39.75">
      <div className="absolute top-5.5 left-5.5 w-28 h-34 flex flex-col z-10">
        <span
          className="h-8 w-9.75 truncate font-bold text-3xl leading-8 text-white mb-3"
          aria-label={`등번호 ${member.backNumber}`}
        >
          {member.backNumber ?? "-"}
        </span>
        <h3 className="w-23.5 h-6 truncate font-bold text-lg leading-6 mb-1 text-white">
          {name}
        </h3>
        <div className="inline-flex gap-1 mb-4">
          <PositionChip
            position={
              (member.position ?? "MF") as import("@/types/position").Position
            }
          />
        </div>
        <dl className="flex flex-col gap-1 text-gray-500 text-[0.6875rem]">
          <div className="flex gap-1">
            <dt className="sr-only">입단일</dt>
            <dd>입단 {formatJoinedAt(member.joinedAt)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">나이</dt>
            <dd>{MOCK_BIRTH_LABEL}</dd>
          </div>
        </dl>
      </div>
      <ImgPlayer
        src={profileImg}
        alt={`${name} 프로필 이미지`}
        className="size-45 absolute right-7.25 top-4 z-10"
      />
    </div>
  );
};

export default PlayerProfileHeader;
