import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";

export interface PlayerNameCellProps {
  name: string;
  image?: string | null;
  imageFallbackUrl?: string;
  playerId: number;
}

const PlayerNameCell = ({
  name,
  image,
  imageFallbackUrl,
  playerId,
}: PlayerNameCellProps) => (
  <div className={cn("flex items-center gap-3.75 justify-start w-full")}>
    <ProfileAvatar
      src={image}
      fallbackSrc={
        imageFallbackUrl ?? getPlayerPlaceholderSrc(`m:${playerId}`)
      }
      alt={name}
      size={36}
    />
    <span className={cn("w-18.75 text-sm text-Label-Tertiary")}>{name}</span>
  </div>
);

export default PlayerNameCell;
