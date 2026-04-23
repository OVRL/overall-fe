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
    "/images/player/img_player_1.webp",
    "/images/player/img_player_2.webp",
    "/images/player/img_player_3.webp",
    "/images/player/img_player_4.webp",
    "/images/player/img_player_5.webp",
    "/images/player/img_player_6.webp",
    "/images/player/img_player_7.webp",
    "/images/player/img_player_8.webp",
    "/images/player/img_player_9.webp",
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
