import { Player } from "@/types/player";
import Icon from "@/components/ui/Icon";
import bestXI from "@/public/icons/bestXI.svg";
import FormationField from "./FormationField";
import ManagerInfo from "./ManagerInfo";
import AdBoard from "./AdBoard";

interface StartingXIProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onPlayerSelect?: (player: Player) => void;
}

/**
 * 포메이션 컴포넌트
 */
const StartingXI = ({ players }: StartingXIProps) => {
  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 flex-1 border border-border-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <Icon src={bestXI} alt="Best XI" width={95} height={34} nofill />
      </div>

      <div>
        <div className="relative h-9.5">
          <AdBoard
            imageUrl="/images/logo_OVR_head.png"
            linkUrl="#"
            altText="OVR Ad Banner"
            className="w-31 absolute left-1/5"
          />
          <AdBoard
            linkUrl="#"
            altText="OVR Ad Banner"
            className="w-31 absolute left-3/5"
          />
        </div>
        <FormationField
          players={players}
          className="aspect-3/4 md:aspect-video"
        />
      </div>
      <ManagerInfo />
    </div>
  );
};

export default StartingXI;
