import { useRef, useState } from "react";
import { ProfileImageCanvasHandle } from "@/components/modals/EditProfileImageModal/ProfileImageCanvas";

interface UseEditProfileImageProps {
  initialImage: string;
  onSave: (image: string) => void;
}

const useEditProfileImage = ({
  initialImage,
  onSave,
}: UseEditProfileImageProps) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const canvasRef = useRef<ProfileImageCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (canvasRef.current) {
      const croppedBlob = await canvasRef.current.getCroppedImage();
      if (croppedBlob) {
        const croppedUrl = URL.createObjectURL(croppedBlob);
        onSave(croppedUrl);
      }
    }
  };

  const handleRemoveBackground = async () => {
    // Mock API call - In reality, we would send 'currentImage' (or original file) to backend
    // and receive a new image blob with background removed.
    console.log("Removing background for:", currentImage);
    // Simulating asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Here we would set the new image.
    // setCurrentImage(newBlobUrl); // This will be used when real API is ready
    alert(
      "배경 제거 기능은 서버 연동이 필요합니다. 현재는 UI 동작만 자리를 잡았습니다.",
    );
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return {
    currentImage,
    canvasRef,
    fileInputRef,
    handleFileChange,
    handleSave,
    handleRemoveBackground,
    handleFileClick,
  };
};

export default useEditProfileImage;
