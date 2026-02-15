import React from "react";
import Image from "next/image";

interface MatchScheduleCardMobileProps {
  matchDate: string;
}

const MatchScheduleCardMobile: React.FC<MatchScheduleCardMobileProps> = ({
  matchDate,
}) => {
  return (
    <div className="flex flex-col gap-6 md:hidden">
      {/* Header: Title + Toggle Buttons */}
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Title Image (Placeholder for 'A' logo) */}
          <div className="h-[34px] w-[192px] relative shrink-0">
            <Image
              src="/images/logo_OVR_head.png"
              alt="Match Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Toggle Buttons (Match / In-House) */}
          <div className="flex gap-3 items-center w-[184px]">
            <button className="flex-1 bg-[#b8ff12] hover:bg-[#a3e610] text-black font-medium text-sm py-3 rounded-lg transition-colors">
              매칭
            </button>
            <button className="flex-1 border border-[#3e3e3e] text-[#d6d6d5] hover:bg-[#3e3e3e] font-medium text-sm py-3 rounded-lg transition-colors">
              내전
            </button>
          </div>
        </div>
      </div>

      {/* Content: Schedule List */}
      <div className="flex gap-3 items-center w-full">
        {/* Icon + Label */}
        <div className="flex gap-2.5 items-center min-w-0 shrink-0">
          <div className="w-5 h-5 shrink-0 relative">
            <Image
              src="/images/Property 1=add.webp" // Arbitrary icon for now, user said "any"
              alt="Calendar Icon"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-white text-base leading-6 whitespace-nowrap">
            경기 일정
          </span>
        </div>

        {/* Date Dropdown/Display */}
        <div className="flex-1 bg-[#f1f1f1] h-12 rounded-lg flex items-center justify-between px-4 relative">
          <span className="text-[#252525] text-sm">{matchDate}</span>
          <div className="w-6 h-6 shrink-0 relative">
            <Image
              src="/images/Property 1=arrow_forward.webp" // Arbitrary arrow
              alt="Dropdown Icon"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScheduleCardMobile;
