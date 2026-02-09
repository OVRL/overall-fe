import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import Icon from "@/components/Icon";
import profile_guide from "@/public/icons/profile_guide.svg";
import coachmarkAll from "@/public/icons/coachmark_2.svg";
import getCroppedImg from "@/utils/canvasUtils";

interface ProfileImageCanvasProps {
  imageSrc: string;
}

export interface ProfileImageCanvasHandle {
  getCroppedImage: () => Promise<Blob | null>;
}

const ProfileImageCanvas = forwardRef<
  ProfileImageCanvasHandle,
  ProfileImageCanvasProps
>(({ imageSrc }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    getCroppedImage: async () => {
      if (!croppedAreaPixels) return null;
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        return croppedImage;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  }));

  return (
    <div className="w-full aspect-square bg-gray-900 rounded-[1.25rem] relative overflow-hidden">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        showGrid={false}
        cropSize={{ width: 200, height: 200 }}
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

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-50 aspect-square shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] rounded-[1.25rem]"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 text-white">
        <Icon
          src={profile_guide}
          alt="guide"
          width={158}
          height={183}
          className="opacity-50"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 text-white inline-flex items-center gap-0.5 w-50">
          <Icon src={coachmarkAll} alt="coachmark" width={48} height={48} />
          <span className="text-xs font-medium text-[#9CCFFF] text-nowrap">
            손가락 두개로 확대/축소 하세요.
          </span>
        </div>
      </div>
    </div>
  );
});

ProfileImageCanvas.displayName = "ProfileImageCanvas";

export default ProfileImageCanvas;
