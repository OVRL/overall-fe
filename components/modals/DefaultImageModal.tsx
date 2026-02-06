import { Button } from "../ui/Button";
import Image from "next/image";
import ModalLayout from "./ModalLayout";

const DefaultImageModal = () => {
  const defaultImages = [
    "/images/player/img_player-1.png",
    "/images/player/img_player-2.png",
    "/images/player/img_player-3.png",
    "/images/player/img_player-4.png",
    "/images/player/img_player-5.png",
    "/images/player/img_player-6.png",
    "/images/player/img_player-7.png",
    "/images/player/img_player-8.png",
    "/images/player/img_player-9.png",
    "/images/player/img_player-10.png",
    "/images/player/img_player-11.png",
    "/images/player/img_player-12.png",
  ];
  return (
    <ModalLayout title="선수 추가">
      <div className="flex-1 flex flex-col gap-y-12">
        <div className="flex gap-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {defaultImages.map((image) => (
            <div
              key={image}
              className="relative shrink-0 bg-gray-900 rounded-xl"
            >
              <Image src={image} alt="player" width={80} height={80} />
            </div>
          ))}
        </div>
        <Button variant="primary" size="xl">
          저장
        </Button>
      </div>
    </ModalLayout>
  );
};

export default DefaultImageModal;
