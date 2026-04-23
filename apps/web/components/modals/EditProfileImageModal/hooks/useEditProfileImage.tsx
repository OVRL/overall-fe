import { useRef, useState } from "react";
import { ProfileImageCanvasHandle } from "@/components/modals/EditProfileImageModal/ProfileImageCanvas";
import { useRemoveBackgroundMutation } from "./useRemoveBackgroundMutation";
import { createImage } from "@/utils/canvasUtils";

interface UseEditProfileImageProps {
  initialImage: string;
  onSave: (image: string, file: File) => void;
}

const useEditProfileImage = ({
  initialImage,
  onSave,
}: UseEditProfileImageProps) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [originalCroppedImage, setOriginalCroppedImage] = useState<
    string | null
  >(null);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);

  const canvasRef = useRef<ProfileImageCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [commit, isMutationInFlight] = useRemoveBackgroundMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
      setPreviousImage(null);
      setOriginalCroppedImage(null); // 원본 이미지 초기화
      setIsAnimating(false);
      setIsBackgroundRemoved(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (isBackgroundRemoved) {
      try {
        const image = await createImage(currentImage);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(image, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp"),
        );
        if (!blob) throw new Error("Could not create blob");

        const file = new File([blob], "profile_image_bg_removed.webp", {
          type: "image/webp",
        });
        onSave(currentImage, file);
      } catch (error) {
        console.error("Failed to convert image to file:", error);
        alert("이미지 저장 중 오류가 발생했습니다.");
      }
      return;
    }

    if (canvasRef.current) {
      const croppedBlob = await canvasRef.current.getCroppedImage();
      if (croppedBlob) {
        const croppedUrl = URL.createObjectURL(croppedBlob);
        const file = new File([croppedBlob], "profile_image_cropped.webp", {
          type: "image/webp",
        });
        onSave(croppedUrl, file);
      }
    }
  };

  const handleRemoveBackground = async () => {
    if (!canvasRef.current) return;

    const croppedBlob = await canvasRef.current.getCroppedImage();
    if (!croppedBlob) return;

    const file = new File([croppedBlob], "profile_image.webp", {
      type: "image/webp",
    });

    // 애니메이션을 위해 현재 크롭된 이미지를 이전 이미지로 저장
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setPreviousImage(croppedUrl);

    // 크롭된 버전이 아닌, 되돌리기를 위해 전체 원본 소스 이미지 URL 저장
    setOriginalCroppedImage(currentImage);
    setIsAnimating(true);

    commit({
      variables: {
        image: file, // 타입 체크를 위해 파일을 유지하지만, JSON 변수에서는 {}로 직렬화됨
      },
      uploadables: {
        image: file,
      },
      onCompleted(response) {
        setCurrentImage(response.removeBackground.image);
        setIsBackgroundRemoved(true);
      },
      onError(error) {
        console.error(error);
        alert("배경 제거 중 오류가 발생했습니다.");
        setIsAnimating(false);
        setPreviousImage(null);
        setOriginalCroppedImage(null); // 에러 발생 시 초기화
      },
    });
  };

  const handleUndoBackgroundRemoval = () => {
    if (originalCroppedImage) {
      setCurrentImage(originalCroppedImage);
      setIsBackgroundRemoved(false);
      setOriginalCroppedImage(null); // 되돌리기 후 저장된 원본 삭제
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setPreviousImage(null);
  };

  return {
    currentImage,
    previousImage,
    isAnimating,
    canvasRef,
    fileInputRef,
    handleFileChange,
    handleSave,
    handleRemoveBackground,
    handleUndoBackgroundRemoval, // 새로운 핸들러 내보내기
    handleFileClick,
    handleAnimationComplete,
    isMutationInFlight,
    isBackgroundRemoved,
  };
};

export default useEditProfileImage;
