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

  const specificPosition = (data.mainPosition as Position) || "FW";

  const handleNext = () => {
    onDataChange((prev) => ({ ...prev, profileImage }));
    onNext();
  };

  return {
    profileImage,
    setProfileImage,
    specificPosition,
    handleNext,
  };
};

export default useProfileImageCollect;
