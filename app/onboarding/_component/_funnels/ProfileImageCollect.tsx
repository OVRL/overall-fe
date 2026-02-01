import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";
import { cn } from "@/lib/utils";

const ProfileImageCollect = () => {
  const [profileImage, setProfileImage] = useState("");

  const handleClick = () => {};

  return (
    <section className="flex flex-col gap-y-10 h-full">
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
