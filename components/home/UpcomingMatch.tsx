"use client";

import React from "react";
import Image from "next/image";

/**
 * 다가오는 경기 카드 컴포넌트 (HTML 스타일 기반)
 */
export default function UpcomingMatch() {
    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 lg:p-6 mb-4 lg:mb-5 border border-primary/30 lg:border-transparent">
            {/* 전체 레이아웃 컨테이너 */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                {/* 1. 좌측: 타이틀 (모바일/PC 공통 위치) & 모바일 컨텐츠 */}
                <div className="text-center lg:text-left lg:flex-1">
                    {/* 타이틀 */}
                    <div className="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 text-sm lg:text-lg mb-2 lg:mb-0 text-primary">
                        {/* SVG 아이콘 교체 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6.66663 1.66666V4.99999" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.3334 1.66666V4.99999" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.5 8.33334H17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-bold whitespace-nowrap">다가오는 경기</span>
                    </div>

                    {/* 모바일 전용 컨텐츠 (날짜 + 팀 정보) - PC에서는 숨김 */}
                    <div className="lg:hidden">
                        {/* 날짜 */}
                        <div className="text-gray-500 text-xs mb-3 mt-2">01.25 (토) 15:00</div>

                        {/* 팀 정보 (기존 모바일 코드 유지) */}
                        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                            <span className="text-white font-medium text-[11px] xs:text-sm whitespace-nowrap">바르셀로나 FC</span>
                            <div className="w-6 h-6 bg-[#004d98] rounded-full relative overflow-hidden flex-shrink-0">
                                <Image
                                    src="/images/ovr.png"
                                    alt="바르셀로나 FC"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-gray-500 text-xs mx-0.5">VS</span>
                            <div className="w-6 h-6 bg-[#c41e3a] rounded-full relative overflow-hidden flex-shrink-0">
                                <Image
                                    src="/images/ovr.png"
                                    alt="리버풀"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-white font-medium text-[11px] xs:text-sm whitespace-nowrap">리버풀</span>
                        </div>
                    </div>
                </div>

                {/* 2. 중앙: PC 전용 매치 정보 (날짜 위, 팀 아래) */}
                <div className="hidden lg:flex flex-col items-center justify-center flex-[2]">
                    {/* 날짜 위로 분리 */}
                    <div className="text-gray-500 text-sm mb-2">01.25 (토) 15:00</div>

                    {/* 팀 정보 아래로 */}
                    <div className="flex items-center gap-4">
                        <span className="text-white font-medium text-base whitespace-nowrap">바르셀로나 FC</span>
                        <div className="w-10 h-10 bg-[#004d98] rounded-full relative overflow-hidden flex-shrink-0">
                            <Image
                                src="/images/ovr.png"
                                alt="바르셀로나 FC"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-gray-500 text-lg font-bold">VS</span>
                        <div className="w-10 h-10 bg-[#c41e3a] rounded-full relative overflow-hidden flex-shrink-0">
                            <Image
                                src="/images/ovr.png"
                                alt="리버풀"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-white font-medium text-base whitespace-nowrap">리버풀</span>
                    </div>
                </div>

                {/* 3. 우측: 버튼 (모바일/PC 공통이지만 너비/정렬 조정) */}
                <div className="w-full lg:w-auto lg:flex-1 lg:flex lg:justify-end">
                    <button className="bg-primary hover:bg-primary-hover text-black font-bold py-2.5 lg:py-3 px-6 lg:px-8 rounded-lg transition-colors w-full lg:w-auto text-sm lg:text-base whitespace-nowrap">
                        포메이션 확인
                    </button>
                </div>
            </div>
        </div>
    );
}
