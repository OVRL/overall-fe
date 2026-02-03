import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";
import { cn } from "@/lib/utils";

import { OnboardingStepProps } from "@/types/onboarding";

const ProfileImageCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [profileImage, setProfileImage] = useState(data.profileImage || "");

  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, profileImage }));
    onNext();
  };

  return (
    <section className="flex flex-col gap-y-10 h-full pb-12">
      <div className="flex-1">
        <OnboardingTitle>
          문자로 받은
          <br />
          프로필 이미지를 등록해주세요.
        </OnboardingTitle>

        <ImageUploader
          onFileSelect={(file) => setProfileImage(URL.createObjectURL(file))}
        />
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!profileImage}
        className={cn(!profileImage && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default ProfileImageCollect;
