"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
    image?: string;
}

interface PlayerCardProps {
    player: Player;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 선수 상세 카드 컴포넌트 (HTML 스타일 기반)
 */
export default function PlayerCard({ player }: PlayerCardProps) {
    const [imageError, setImageError] = useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div className="bg-surface-tertiary rounded-2xl p-5">
            {/* 선수 헤더 */}
            <div className="flex gap-4 mb-5">
                {/* 선수 사진 */}
                <div className="relative w-24 h-32 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl overflow-hidden flex-shrink-0">
                    <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 rounded text-lg font-black z-10">
                        {player.overall}
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-full">
                        <Image
                            src={playerImage}
                            alt={player.name}
                            fill
                            className="object-contain object-bottom"
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>

                {/* 스탯 */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">출장</span>
                        <span className="text-white font-bold">25</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">오버롤</span>
                        <span className="text-white font-bold">{player.overall}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">골</span>
                        <span className="text-white font-bold">{player.shooting}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">어시</span>
                        <span className="text-white font-bold">{player.passing}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">기점</span>
                        <span className="text-white font-bold">{player.defending}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">클린시트</span>
                        <span className="text-white font-bold">{player.physical}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">주발</span>
                        <span className="text-white font-bold">오른발</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">슈팅</span>
                        <span className="text-white font-bold">50%</span>
                    </div>
                </div>
            </div>

            {/* 버튼 */}
            <button className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-lg transition-colors">
                선수 정보 더보기
            </button>
        </div>
    );
}
