import Icon from "@/components/ui/Icon";
import profile_guide from "@/public/icons/profile_guide.svg";
import coachmarkAll from "@/public/icons/coachmark_2.svg";
import coachmarkAll2 from "@/public/icons/coachmark_1.svg";
import RemoveBackgroundProfileGuide from "./RemoveBackgroundProfileGuide";

interface ProfileImageGuideOverlayProps {
  isBackgroundRemoved: boolean;
}

const ProfileImageGuideOverlay = ({
  isBackgroundRemoved,
}: ProfileImageGuideOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 text-white">
      {!isBackgroundRemoved && (
        <Icon
          src={profile_guide}
          alt="guide"
          width={158}
          height={183}
          className="opacity-50"
        />
      )}
      <RemoveBackgroundProfileGuide
        text={
          isBackgroundRemoved
            ? "좌/우로 이미지를 움직이세요."
            : "손가락 두개로 확대/축소 하세요."
        }
        icon={isBackgroundRemoved ? coachmarkAll2 : coachmarkAll}
      />
    </div>
  );
};

export default ProfileImageGuideOverlay;
