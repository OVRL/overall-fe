import { EmblemImage } from "@/components/ui/EmblemImage";

interface TeamInfoProps {
  name: string;
  logo: string;
  reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름]
}

const TeamInfo = ({ name, logo, reverse = false }: TeamInfoProps) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        reverse ? "flex-row-reverse text-right" : "flex-row"
      }`}
    >
      <div
        className={`border-2 border-surface-card rounded-full relative overflow-hidden shrink-0 size-10`}
      >
        <EmblemImage
          src={logo}
          alt={name}
          sizes="2.5rem"
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
