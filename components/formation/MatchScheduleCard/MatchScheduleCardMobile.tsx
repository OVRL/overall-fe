import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import calendar from "@/public/icons/calendar.svg";
import Dropdown from "@/components/ui/Dropdown";

const MatchScheduleCardMobile = () => {
  return (
    <div className="flex flex-col gap-6 md:hidden">
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-6 items-center w-full">
          <div className="h-8.5 w-48 relative shrink-0">
            <Image
              src="/images/title_matchlineup.webp"
              alt="Match Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-3 items-center w-[184px]">
            <Button variant="primary" size="m">
              매칭
            </Button>
            <Button variant="line" size="m">
              내전
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center w-full justify-center">
        <div className="flex gap-2.5 items-center min-w-0 shrink-0">
          <div className="w-5 h-5 shrink-0 relative text-Fill_Tertiary">
            <Icon src={calendar} width={24} height={24} />
          </div>
          <span className="font-semibold text-[#f7f8f8] text-base leading-6 whitespace-nowrap">
            경기 일정
          </span>
        </div>

        <Dropdown />
      </div>
    </div>
  );
};

export default MatchScheduleCardMobile;
