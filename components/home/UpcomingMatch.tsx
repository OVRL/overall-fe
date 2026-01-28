"use client";

import React from "react";
import Image from "next/image";

/**
 * 다가오는 경기 컴포넌트 헤더 (타이틀)
 */
const MatchTitle = () => (
  <div className="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 text-sm lg:text-lg mb-2 lg:mb-0 text-primary">
    {/* SVG 아이콘 교체 */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M6.66663 1.66666V4.99999"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3334 1.66666V4.99999"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 8.33334H17.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-bold whitespace-nowrap">다가오는 경기</span>
  </div>
);

/**
 * 모바일용 매치 정보 (날짜 + 가로형 팀 정보)
 */
interface TeamInfoProps {
  name: string;
  logo: string;
  logoColor: string;
  reverse?: boolean; // true면 [이름] [로고] 순서, false면 [로고] [이름] (기본값 false로 하되 데스크탑/모바일 배치에 맞춰 조정)
  mobileLayout?: boolean; // 모바일 뷰 전용 스타일 적용 여부
}

const TeamInfo = ({
  name,
  logo,
  logoColor,
  reverse = false,
  mobileLayout = false,
}: TeamInfoProps) => {
  return (
    <div
      className={`flex items-center gap-1.5 lg:gap-4 ${reverse ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* 로고 */}
      <div
        className={`${mobileLayout ? "w-6 h-6" : "w-10 h-10"} ${logoColor} rounded-full relative overflow-hidden flex-shrink-0`}
      >
        <Image src={logo} alt={name} fill className="object-cover" />
      </div>
      {/* 이름 */}
      <span
        className={`text-white font-medium ${mobileLayout ? "text-[11px] xs:text-sm" : "text-base"} whitespace-nowrap`}
      >
        {name}
      </span>
    </div>
  );
};

/**
 * 모바일용 매치 정보 (날짜 + 가로형 팀 정보)
 */
const MatchInfoMobile = () => (
  <div className="lg:hidden">
    {/* 날짜 */}
    <div className="text-gray-500 text-xs mb-3 mt-2">01.25 (토) 15:00</div>

    {/* 팀 정보 */}
    <div className="flex items-center justify-center gap-1.5 flex-nowrap">
      <TeamInfo
        name="바르셀로나 FC"
        logo="/images/ovr.png"
        logoColor="bg-[#004d98]"
        reverse={true}
        mobileLayout={true}
      />
      <span className="text-gray-500 text-xs mx-0.5">VS</span>
      <TeamInfo
        name="리버풀"
        logo="/images/ovr.png"
        logoColor="bg-[#c41e3a]"
        reverse={false}
        mobileLayout={true}
      />
    </div>
  </div>
);

/**
 * PC용 매치 정보 (날짜 위, 팀 아래 세로 배치)
 */
const MatchInfoDesktop = () => (
  <div className="hidden lg:flex flex-col items-center justify-center flex-[2]">
    {/* 날짜 위로 분리 */}
    <div className="text-gray-500 text-sm mb-2">01.25 (토) 15:00</div>

    {/* 팀 정보 아래로 */}
    <div className="flex items-center gap-4">
      <TeamInfo
        name="바르셀로나 FC"
        logo="/images/ovr.png"
        logoColor="bg-[#004d98]"
        reverse={true}
        mobileLayout={false}
      />
      <span className="text-gray-500 text-lg font-bold">VS</span>
      <TeamInfo
        name="리버풀"
        logo="/images/ovr.png"
        logoColor="bg-[#c41e3a]"
        reverse={false}
        mobileLayout={false}
      />
    </div>
  </div>
);

/**
 * 좌측 섹션 (타이틀 + 모바일 정보)
 */
const MatchHeaderSection = () => (
  <div className="text-center lg:text-left lg:flex-1">
    <MatchTitle />
    <MatchInfoMobile />
  </div>
);

/**
 * 우측 액션 버튼
 */
const MatchAction = () => (
  <div className="w-full lg:w-auto lg:flex-1 lg:flex lg:justify-end">
    <button className="bg-primary hover:bg-primary-hover text-black font-bold py-2.5 lg:py-3 px-6 lg:px-8 rounded-lg transition-colors w-full lg:w-auto text-sm lg:text-base whitespace-nowrap">
      포메이션 확인
    </button>
  </div>
);

/**
 * 다가오는 경기 카드 컴포넌트
 */
const UpcomingMatch = () => {
  return (
    <div className="bg-surface-secondary rounded-[1.25rem] p-4 lg:p-6 mb-4 lg:mb-5 border border-primary/30 lg:border-transparent">
      {/* Unchanged logic, just confirming LG breakpoint usage matches request */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <MatchHeaderSection />
        <MatchInfoDesktop />
        <MatchAction />
      </div>
    </div>
  );
};

export default UpcomingMatch;
