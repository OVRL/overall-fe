import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";

export interface PlayerNameCellProps {
  name: string;
  image?: string;
}

const PlayerNameCell = ({ name, image }: PlayerNameCellProps) => (
  <div className={cn("flex items-center gap-3.75 justify-start w-full")}>
    <ProfileAvatar src={image || "/images/ovr.png"} alt={name} size={36} />
    <span className={cn("w-18.75 text-sm text-Label-Tertiary")}>{name}</span>
  </div>
);

export default PlayerNameCell;
