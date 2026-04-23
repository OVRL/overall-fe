import Image from "next/image";
import restImage from "@/public/images/rest_image.webp";
const NoUpcomingMatch = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-gray-500 text-xs font-medium text-center">
          다가오는 경기가 없습니다.
        </p>
        <p className="text-[#f7f8f8] font-medium text-center">
          때로는 휴식도 필요하죠!
        </p>
      </div>
      <Image src={restImage} height={66} alt="휴식하는 선수 이미지" />
    </div>
  );
};

export default NoUpcomingMatch;
