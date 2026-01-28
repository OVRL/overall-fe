"use client";

import React from "react";
import Image from "next/image";

/**
 * 광고 아이템 데이터
 * (실제 이미지가 있으면 좋겠지만, 현재는 CSS/HTML로 Gatorade 스타일 모사)
 * 2개의 광고판이 좌/우에 위치함
 */
const ADS = [{ id: 1 }, { id: 2 }];

/**
 * Gatorade 스타일 광고 배너
 * 124px x 38px
 */
const AdBanner = () => {
  return (
    <div className="relative w-31 h-[38px] bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-between px-2 shrink-0">
      {/* Left: G Logo */}
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-lg italic leading-none">
          G
        </span>
      </div>

      {/* Center: Text */}
      <div className="flex flex-col items-start ml-1">
        <span className="text-[6px] text-gray-300 leading-tight">
          THE SPORTS DRINK
        </span>
        <span className="text-[5px] text-orange-500 font-bold tracking-wider">
          GAME CHANGER
        </span>
      </div>

      {/* Right: Bottles (Mock) */}
      <div className="flex gap-0.5 items-end h-full py-1">
        {/* Yellow Bottle */}
        <div className="w-1.5 h-5 bg-yellow-400 rounded-sm"></div>
        {/* Blue Bottle */}
        <div className="w-1.5 h-6 bg-blue-500 rounded-sm"></div>
      </div>

      {/* Red accent line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"></div>
    </div>
  );
};

/**
 * 광고 보드 컴포넌트
 * StartingXI 상단에 위치하여 배경처럼 보이게 함
 */
const AdvertisingBoard = () => {
  return (
    <div className="w-full h-full flex items-end justify-between px-[10%] pb-2">
      {/* 좌측 광고판 */}
      <AdBanner />

      {/* 우측 광고판 */}
      <AdBanner />
    </div>
  );
};

export default AdvertisingBoard;
