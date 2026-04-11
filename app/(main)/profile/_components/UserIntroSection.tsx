import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Icon from "@/components/ui/Icon";
import ImgPlayer from "@/components/ui/ImgPlayer";
import editIcon from "@/public/icons/edit.svg";
import { formatRegionSearchDisplay } from "@/lib/region/formatRegionSearchDisplay";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

function formatJoinedAtLabel(value: unknown): string {
  if (value == null) return "—";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "yyyy.MM.dd", { locale: ko });
}

type UserIntroSectionProps = {
  member: ProfileTeamMemberRow | null;
};

const UserIntroSection = ({ member }: UserIntroSectionProps) => {
  const displayName = member?.user?.name?.trim() || "—";
  const activityRegionLabel =
    formatRegionSearchDisplay(member?.user?.region) || "—";
  const joinedLabel = formatJoinedAtLabel(member?.joinedAt);

  const editButtonClassName =
    "group shrink-0 py-2 px-3 flex gap-2 rounded-lg bg-gray-1000 text-Fill_Tertiary items-center cursor-pointer transition-colors duration-200 hover:bg-surface-elevated hover:text-Label-Secondary";

  return (
    <section className="flex w-full justify-center">
      <div className="relative flex w-full max-w-full flex-col items-center gap-6 rounded-t-2xl bg-surface-secondary p-6 max-md:-mx-4 max-md:w-[calc(100%+2rem)] md:h-50 md:w-auto md:max-w-none md:flex-row md:items-stretch md:gap-6 md:rounded-none md:bg-transparent md:p-0">
        <ImgPlayer
          src={member?.profileImg}
          alt={displayName === "—" ? "프로필" : displayName}
          sizes="(max-width: 48rem) 150px, 200px"
          className="size-37.5 shrink-0  md:size-auto md:h-full md:max-h-none md:aspect-square"
        />

        <div className="flex min-w-0 flex-col gap-3 text-sm font-medium w-90.5 text-Label-Tertiary md:w-107">
          <div className="flex w-full justify-center md:justify-between md:gap-2">
            <h2 className="max-md:pr-14 text-center text-2xl font-bold text-white md:pr-0 md:text-left md:text-[1.75rem]">
              {displayName}
            </h2>
            <button
              type="button"
              className={`${editButtonClassName} absolute top-6 right-6 z-10 md:static md:z-auto`}
            >
              <Icon
                src={editIcon}
                alt="수정"
                className="text-gray-500 transition-colors group-hover:text-Label-Tertiary"
                width={20}
                height={20}
              />
              편집
            </button>
          </div>

          <p className="text-center md:text-left">가입일: {joinedLabel}</p>
          <p className="text-center md:text-left">
            활동지역: {activityRegionLabel}
          </p>
          <p className="text-center text-Label-Secondary md:text-left">
            축구를 사랑하는 공격수입니다. 팀워크를 중시하며 골을 넣는 것을
            즐깁니다. 함께 성장하는 팀을 만들어가고 싶습니다! ⚽️
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserIntroSection;
