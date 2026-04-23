import Cropper from "react-easy-crop";
import { Button } from "../../ui/Button";
import ModalLayout from "../ModalLayout";
import useEditEmblemImage from "./hooks/useEditEmblemImage";
import coachmarkAll from "@/public/icons/coachmark_2.svg";
import RemoveBackgroundProfileGuide from "../EditProfileImageModal/RemoveBackgroundProfileGuide";

interface EditEmblemImageModalProps {
  initialImage: string;
  onSave: (image: string, file: File) => void;
}

const EditEmblemImageModal = ({
  initialImage,
  onSave,
}: EditEmblemImageModalProps) => {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    currentImage,
    fileInputRef,
    handleFileClick,
    handleFileChange,
    onCropComplete,
    handleSave,
  } = useEditEmblemImage({ initialImage, onSave });

  return (
    <ModalLayout title="클럽 엠블럼 등록">
      <div className="flex-1 flex flex-col gap-y-12 justify-center items-center py-6">
        <div className="flex flex-col gap-3 items-center w-75.5">
          <div className="relative w-full aspect-square bg-gray-900 overflow-hidden rounded-md">
            <Cropper
              image={currentImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropSize={{ width: 200, height: 200 }}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={false}
              restrictPosition={false}
              objectFit="contain"
              style={{
                containerStyle: {
                  backgroundColor: "#1a1a1a",
                },
                cropAreaStyle: {
                  opacity: 0,
                },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-50 aspect-square shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] rounded-[1.25rem]"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-40">
              <RemoveBackgroundProfileGuide
                text={"손가락 두개로 확대/축소 하세요."}
                icon={coachmarkAll}
              />
            </div>
          </div>
          <p className="text-[0.8125rem] font-medium text-Fill_Secondary text-center mt-2">
            클럽 엠블럼을 가이드 영역에 맞게
            <br /> 사이즈를 조정해주세요.
          </p>
          <div className="flex justify-center gap-2 w-full mt-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              variant="line"
              size="m"
              onClick={handleFileClick}
              className="w-full text-white font-medium"
            >
              이미지 변경
            </Button>
          </div>
        </div>
        <div className="w-full">
          <Button
            variant="primary"
            size="xl"
            onClick={handleSave}
            className="w-full"
          >
            저장
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default EditEmblemImageModal;
