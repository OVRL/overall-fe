import { StaticImageData } from "next/image";
import Icon from "@/components/ui/Icon";

type Props = {
  text: string;
  icon: StaticImageData;
};

const RemoveBackgroundProfileGuide = ({ text, icon }: Props) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 text-white inline-flex items-center gap-0.5 w-50">
      <Icon src={icon} alt="coachmark" width={48} height={48} />
      <span className="text-xs font-medium text-[#9CCFFF] text-nowrap">
        {text}
      </span>
    </div>
  );
};

export default RemoveBackgroundProfileGuide;
