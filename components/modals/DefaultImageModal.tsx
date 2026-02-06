import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/Button";
import Image from "next/image";
import ModalLayout from "./ModalLayout";
import { cn } from "@/lib/utils";
import useModal from "@/hooks/useModal";

interface DefaultImageModalProps {
  initialImage: string;
  onSave: (image: string) => void;
}

const DefaultImageModal = ({
  initialImage,
  onSave,
}: DefaultImageModalProps) => {
  const { hideModal } = useModal();
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedImageRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedImageRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = selectedImageRef.current;

      const containerWidth = container.offsetWidth;
      const elementWidth = element.offsetWidth;
      const elementLeft = element.offsetLeft;

      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <ModalLayout title="선수 추가">
      <div className="flex-1 flex flex-col gap-y-12">
        <div
          ref={scrollContainerRef}
          className="flex gap-x-3 overflow-x-auto pb-2 min-w-0"
        >
          {defaultImages.map((image) => (
            <div
              key={image}
              ref={image === selectedImage ? selectedImageRef : null}
              className={cn(
                "relative shrink-0 bg-gray-900 rounded-xl cursor-pointer border-2 transition-all",
                image === selectedImage
                  ? "border-green-600"
                  : "border-transparent",
              )}
              onClick={() => setSelectedImage(image)}
            >
              <Image src={image} alt="player" width={80} height={80} />
            </div>
          ))}
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={() => {
            onSave(selectedImage);
            hideModal();
          }}
        >
          저장
        </Button>
      </div>
    </ModalLayout>
  );
};

export default DefaultImageModal;
