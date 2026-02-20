import { cn } from "@/lib/utils";
import PlayerCard from "../ui/PlayerCard";
import Icon from "../ui/Icon";
import selectedCircle from "@/public/icons/active_circle.svg";

type Props = {
  imgUrl: string;
  playerName: string;
  playerSeason?: string;
  isSelected?: boolean;
  onDelete?: () => void;
  className?: string;
};

const FormationPlayerImageThumbnail = ({
  imgUrl,
  playerName,
  playerSeason,
  isSelected = false,
  onDelete,
  className,
}: Props) => {
  return (
    <div className={cn("relative text-Fill_AccentPrimary", className)}>
      <PlayerCard
        imgUrl={imgUrl}
        playerName={playerName}
        playerSeason={playerSeason}
        onDelete={onDelete}
        className={cn("bg-transparent", className)}
        type="XS"
      />

      {isSelected && (
        <Icon
          src={selectedCircle}
          alt="selected circle"
          aria-hidden={true}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 -z-10"
        />
      )}
    </div>
  );
};

export default FormationPlayerImageThumbnail;
