import { useState } from "react";
import { OnboardingStepProps } from "@/types/onboarding";
import { Position } from "@/types/position";

const useProfileImageCollect = ({
  data,
  onDataChange,
  onNext,
}: OnboardingStepProps) => {
  const [profileImage, setProfileImage] = useState(
    data.profileImage || "/images/player/img_player-3.png",
  );
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>(
    data.profileImageFile,
  );

  const specificPosition = (data.mainPosition as Position) || "FW";

  const handleNext = () => {
    onDataChange((prev) => ({ ...prev, profileImage, profileImageFile }));
    onNext();
  };

  return {
    profileImage,
    setProfileImage,
    profileImageFile,
    setProfileImageFile,
    specificPosition,
    handleNext,
  };
};

export default useProfileImageCollect;
