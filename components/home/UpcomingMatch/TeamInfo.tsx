import Image from "next/image";
import { getValidImageSrc, MOCK_EMBLEM_SRC } from "@/lib/utils";

interface TeamInfoProps {
  name: string;
  logo: string;
  reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름]
}

const TeamInfo = ({ name, logo, reverse = false }: TeamInfoProps) => {
  const emblemSrc = getValidImageSrc(logo, MOCK_EMBLEM_SRC);

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
