import Image from "next/image";

interface TeamInfoProps {
  name: string;
  logo: string;
  logoColor: string;
  reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름]
}

const TeamInfo = ({
  name,
  logo,
  logoColor,
  reverse = false,
}: TeamInfoProps) => {
  return (
    <div
      className={`flex items-center gap-3 ${reverse ? "flex-row-reverse text-right" : "flex-row"}`}
    >
      <div
        className={`w-9 h-9 ${logoColor} rounded-full relative overflow-hidden shrink-0`}
      >
        <Image src={logo} alt={name} fill className="object-cover" />
      </div>

      <span
        className={`text-white font-medium text-[0.8125rem] whitespace-nowrap w-22.5 text-ellipsis`}
      >
        {name}
      </span>
    </div>
  );
};

export default TeamInfo;
