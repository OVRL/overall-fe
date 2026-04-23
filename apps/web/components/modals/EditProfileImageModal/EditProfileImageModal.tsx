import { Button } from "../../ui/Button";
import ModalLayout from "../ModalLayout";
import ProfileImageCanvas from "./ProfileImageCanvas";
import useEditProfileImage from "./hooks/useEditProfileImage";

interface EditProfileImageModalProps {
  initialImage: string;
  onSave: (image: string, file: File) => void;
}

const getButtonText = (
  isMutationInFlight: boolean,
  isBackgroundRemoved: boolean,
) => {
  if (isMutationInFlight) return "제거 중...";
  return isBackgroundRemoved ? "되돌리기" : "배경 제거";
};

const EditProfileImageModal = ({
  initialImage,
  onSave,
}: EditProfileImageModalProps) => {
  const {
    currentImage,
    canvasRef,
    fileInputRef,
    handleFileChange,
    handleSave,
    handleRemoveBackground,
    handleFileClick,
    handleAnimationComplete,
    isMutationInFlight,
    isBackgroundRemoved,
    previousImage,
    isAnimating,
    handleUndoBackgroundRemoval,
  } = useEditProfileImage({ initialImage, onSave });

  return (
    <ModalLayout title="프로필 이미지 편집">
      <div className="flex-1 flex flex-col gap-y-12 justify-center items-center">
        <div className="flex flex-col gap-3.25 items-center w-75.5">
          <ProfileImageCanvas
            key={currentImage} // 이미지가 변경될 때 상태 초기화
            ref={canvasRef}
            imageSrc={currentImage}
            previousImageSrc={previousImage}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
            isBackgroundRemoved={isBackgroundRemoved}
          />
          <p className="text-[0.8125rem] font-medium text-Fill_Secondary text-center">
            프로필 이미지를 얼굴영역에 맞게
            <br /> 사이즈를 조정 후 배경 제거를 진행 해주세요.
          </p>
          <div className="flex justify-between gap-2 w-full">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button variant="line" size="m" onClick={handleFileClick}>
              사진 변경
            </Button>
            <Button
              variant="line"
              size="m"
              onClick={
                isBackgroundRemoved
                  ? handleUndoBackgroundRemoval
                  : handleRemoveBackground
              }
              disabled={isMutationInFlight}
            >
              {getButtonText(isMutationInFlight, isBackgroundRemoved)}
            </Button>
          </div>
        </div>
        <div className="w-75.5">
          <p className="mb-4 text-Label-Tertiary text-sm">
            배경 제거 버튼을 눌러 배경을 제거해주세요.
          </p>
          <Button variant="primary" size="xl" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default EditProfileImageModal;
