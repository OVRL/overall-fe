"use client";

import React from "react";
import Image from "next/image";

/**
 * 다가오는 경기 카드 컴포넌트 (HTML 스타일 기반)
 */
export default function UpcomingMatch() {
    return (
        <div className="bg-[#141414] rounded-[20px] p-6 mb-5">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 text-lg mb-3">
                        <span>📅</span>
                        <span className="text-primary font-bold">다가오는 경기</span>
                    </div>

                    {/* 팀 정보 */}
                    <div className="flex items-center gap-4">
                        <span className="text-white font-medium">바르셀로나 FC</span>
                        <div className="w-10 h-10 bg-[#004d98] rounded-full relative overflow-hidden">
                            <Image
                                src="/images/ovr.png"
                                alt="바르셀로나 FC"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-gray-500 text-sm">01.25 (토) 15:00</span>
                        <span className="text-gray-500">VS</span>
                        <div className="w-10 h-10 bg-[#c41e3a] rounded-full relative overflow-hidden">
                            <Image
                                src="/images/ovr.png"
                                alt="리버풀"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-white font-medium">리버풀</span>
                    </div>
                </div>

                {/* 버튼 */}
                <button className="bg-primary hover:bg-primary-hover text-black font-bold py-3 px-8 rounded-lg transition-colors">
                    포메이션 확인
                </button>
            </div>
        </div>
    );
}
