import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";
import { cn } from "@/lib/utils";
import { positionTextVariants } from "@/constants/positionVariants";
import { POSITION_CATEGORY_MAP } from "@/constants/position";
import useProfileImageCollect from "../../_hooks/useProfileImageCollect";
import { OnboardingStepProps } from "@/types/onboarding";

const ProfileImageCollect = (props: OnboardingStepProps) => {
  const { profileImage, setProfileImage, specificPosition, handleNext } =
    useProfileImageCollect(props);

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
          onFileSelect={(file) => setProfileImage(URL.createObjectURL(file))}
          previewHeight="calc(100dvh - 26.5625rem)"
          currentImage={profileImage}
          onDefaultImageSelect={(image) => setProfileImage(image)}
        />
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleNext}
        disabled={!profileImage}
        className={cn(!profileImage && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default ProfileImageCollect;
