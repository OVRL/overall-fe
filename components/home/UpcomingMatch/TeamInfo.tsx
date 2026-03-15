import Image from "next/image";

/** 엠블럼 URL이 없거나 잘못된 경우 사용하는 기본 엠블럼 (교체 시 이 경로만 변경) */
const DEFAULT_EMBLEM_SRC = "/icons/teamemblum_default.svg";

/** 로컬 경로(/ 로 시작)이고 비어 있지 않으면 사용, 아니면 기본 엠블럼 사용 */
function getEmblemSrc(logo: string): string {
  if (logo?.trim().startsWith("/")) return logo.trim();
  return DEFAULT_EMBLEM_SRC;
}

interface TeamInfoProps {
  name: string;
  logo: string;
  reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름]
}

const TeamInfo = ({ name, logo, reverse = false }: TeamInfoProps) => {
  const emblemSrc = getEmblemSrc(logo);

  return (
    <div
      className={`flex items-center gap-3 ${
        reverse ? "flex-row-reverse text-right" : "flex-row"
      }`}
    >
      <div
        className={`border-2 border-surface-card rounded-full relative overflow-hidden shrink-0 size-10`}
      >
        <Image
          src={emblemSrc}
          alt={name}
          fill
          sizes="2.25rem"
          className="object-cover"
          quality={100}
        />
      </div>

      <span
        className={`text-white font-medium text-[0.8125rem] whitespace-nowrap w-22.5 truncate`}
      >
        {name}
      </span>
    </div>
  );
};

export default TeamInfo;
