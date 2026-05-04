import { EmblemImage } from "@/components/ui/EmblemImage";
import { cn } from "@/lib/utils";

type Props = {
  name?: string;
  imageUrl?: string;
  selected?: boolean;
  onClick?: () => void;
};

const TeamButton = ({
  name = "리버풀",
  imageUrl,
  selected = false,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center h-17 gap-2 rounded-[0.875rem] pl-4 border-2 pr-6 transition-colors",
        selected
          ? "border-Fill_AccentPrimary/30 bg-gray-1200"
          : "border-transparent bg-gray-1200",
      )}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <EmblemImage src={imageUrl} alt={`${name} 로고`} sizes="40px" />
      </div>
      <p
        className={cn(
          "text-base font-semibold leading-normal whitespace-nowrap truncate",
          selected ? "text-white" : "text-gray-500",
        )}
      >
        {name}
      </p>
    </button>
  );
};

export default TeamButton;
