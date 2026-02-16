import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";
import { cn } from "@/lib/utils";
import { positionTextVariants } from "@/constants/positionVariants";
import { POSITION_CATEGORY_MAP } from "@/constants/position";
import useProfileImageCollect from "../../_hooks/useProfileImageCollect";
import { OnboardingStepProps } from "@/types/onboarding";

const ProfileImageCollect = (props: OnboardingStepProps) => {
  const {
    profileImage,
    setProfileImage,
    profileImageFile,
    setProfileImageFile,
    specificPosition,
    handleNext,
  } = useProfileImageCollect(props);

  const handleFileSelect = (file: File) => {
    setProfileImage(URL.createObjectURL(file));
    setProfileImageFile(file);
  };

  const handleDefaultImageSelect = async (imageSrc: string) => {
    setProfileImage(imageSrc);
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "default_profile.webp", {
        type: "image/webp",
      });
      setProfileImageFile(file);
    } catch (error) {
      console.error("Failed to convert default image to file:", error);
      // Fallback: If fetch fails, we might just set null or handle error.
      // For now, let's assume valid static assets.
    }
  };

  return (
    <section className="flex flex-col gap-y-10 h-full pb-12">
      <div className="flex-1">
        <OnboardingTitle>
          <span
            className={cn(
              positionTextVariants({
                intent: POSITION_CATEGORY_MAP[specificPosition],
              }),
            )}
          >
            {props.data.mainPosition}
          </span>
          {props.data.name} 선수!
          <br />
          프로필 이미지를 등록해주세요.
        </OnboardingTitle>

        <ImageUploader
          onFileSelect={handleFileSelect}
          previewHeight="calc(100dvh - 26.5625rem)"
          currentImage={profileImage}
          onDefaultImageSelect={handleDefaultImageSelect}
        />
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleNext}
        disabled={!profileImageFile}
        className={cn(!profileImageFile && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default ProfileImageCollect;
