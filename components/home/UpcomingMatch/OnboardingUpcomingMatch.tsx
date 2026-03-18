import Image from "next/image";
import directorImage from "@/public/images/director.webp";
import Button from "@/components/ui/Button";
const OnboardingUpcomingMatch = () => {
  return (
    <div className="flex items-center justify-center gap-2 relative">
      <div className="flex flex-col gap-1 relative">
        <p className="text-gray-500 text-xs font-medium text-center">
          팀원에게 초대 코드를 공유하세요
        </p>
        <p className="text-[#f7f8f8] font-medium text-center">
          팀 운영을 위해 선수를 영입하세요.
        </p>
        <Image
          src={directorImage}
          height={66}
          className="absolute -right-17 top-1/2 -translate-y-1/2"
          alt="팔장끼고 눈 감고 있는 감독 이미지"
        />
      </div>

      <Button
        variant="primary"
        size="m"
        className="size-fit right-0 top-1/2 -translate-y-1/2 absolute p-3"
      >
        팀 코드 복사
      </Button>
    </div>
  );
};

export default OnboardingUpcomingMatch;
