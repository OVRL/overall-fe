import { useImperativeHandle, Ref } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import useProfileImageCanvas from "./hooks/useProfileImageCanvas";
import ProfileImageGuideOverlay from "./ProfileImageGuideOverlay";

interface ProfileImageCanvasProps {
  imageSrc: string;
  previousImageSrc?: string | null;
  isBackgroundRemoved?: boolean;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  ref?: Ref<ProfileImageCanvasHandle>;
}

export interface ProfileImageCanvasHandle {
  getCroppedImage: () => Promise<Blob | null>;
}

const ProfileImageCanvas = ({
  imageSrc,
  previousImageSrc,
  isBackgroundRemoved = false,
  isAnimating = false,
  onAnimationComplete,
  ref,
}: ProfileImageCanvasProps) => {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    getCroppedImage,
    isLoaded,
    handleMediaLoaded,
  } = useProfileImageCanvas({
    imageSrc,
    isAnimating,
    onAnimationComplete,
  });

  useImperativeHandle(ref, () => ({
    getCroppedImage,
  }));

  return (
    <div className="w-full aspect-square bg-gray-900 rounded-[1.25rem] relative overflow-hidden">
      {/* 전환을 위한 이전 이미지 레이어 */}
      {previousImageSrc && isAnimating && (
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 opacity-0 flex items-center justify-center"
          style={{ opacity: isLoaded ? 0 : 1 }}
        >
          <Image
            src={previousImageSrc}
            className="w-50 aspect-square object-contain rounded-[1.25rem]"
            alt="previous"
            width={200}
            height={200}
            unoptimized
          />
        </div>
      )}

      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${isAnimating && !isLoaded ? "opacity-0" : "opacity-100"}`}
      >
        {isBackgroundRemoved ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={imageSrc}
              className="w-50 aspect-square object-contain rounded-[1.25rem]"
              alt="cropped"
              onLoad={handleMediaLoaded}
              width={200}
              height={200}
              unoptimized
            />
          </div>
        ) : (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onMediaLoaded={handleMediaLoaded}
            showGrid={false}
            cropSize={{ width: 200, height: 200 }}
            restrictPosition={false}
            objectFit="contain"
            zoomSpeed={0.1}
            style={{
              containerStyle: {
                backgroundColor: "#1a1a1a",
                borderRadius: "1.25rem",
              },
              cropAreaStyle: {
                opacity: 0,
              },
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="w-50 aspect-square shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] rounded-[1.25rem]"></div>
      </div>

      <ProfileImageGuideOverlay isBackgroundRemoved={isBackgroundRemoved} />
    </div>
  );
};

ProfileImageCanvas.displayName = "ProfileImageCanvas";

export default ProfileImageCanvas;
