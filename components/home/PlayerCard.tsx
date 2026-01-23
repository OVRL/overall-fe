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
 * 선수 아바타 컴포넌트 (사진 및 OVR 배지)
 */
const PlayerAvatar = ({
    player,
    imageError,
    setImageError
}: {
    player: Player;
    imageError: boolean;
    setImageError: (error: boolean) => void;
}) => {
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div className="relative w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl overflow-hidden flex-shrink-0">
            <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 bg-primary text-black px-1.5 md:px-2 py-0.5 md:py-1 rounded text-base md:text-lg font-black z-10">
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
    );
};

/**
 * 선수 스탯 정보 그리드
 */
import Button from "../ui/Button";

/**
 * 선수 스탯 정보 그리드
 */
const PlayerStats = ({ player }: { player: Player }) => {
    return (
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dl className="flex justify-between">
                <dt className="text-gray-500">출장</dt>
                <dd className="text-white font-bold">25</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">오버롤</dt>
                <dd className="text-white font-bold">{player.overall}</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">골</dt>
                <dd className="text-white font-bold">{player.shooting}</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">어시</dt>
                <dd className="text-white font-bold">{player.passing}</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">기점</dt>
                <dd className="text-white font-bold">{player.defending}</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">클린시트</dt>
                <dd className="text-white font-bold">{player.physical}</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">주발</dt>
                <dd className="text-white font-bold">오른발</dd>
            </dl>
            <dl className="flex justify-between">
                <dt className="text-gray-500">슈팅</dt>
                <dd className="text-white font-bold">50%</dd>
            </dl>
        </div>
    );
};

/**
 * 선수 상세 카드 컴포넌트
 */
const PlayerCard = ({ player }: PlayerCardProps) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="bg-surface-tertiary rounded-2xl p-4 md:p-5 mt-4 md:mt-0">
            {/* 선수 헤더 */}
            <div className="flex gap-3 md:gap-4 mb-4 md:mb-5">
                <PlayerAvatar
                    player={player}
                    imageError={imageError}
                    setImageError={setImageError}
                />
                <PlayerStats player={player} />
            </div>

            {/* 버튼 */}
            <Button
                variant="ghost"
                className="w-full h-[41px] flex justify-center items-center gap-[10px] p-[12px] rounded-[10px] border border-[#252525] text-white text-sm font-bold transition-colors hover:bg-[#252525]"
            >
                선수 정보 더보기
            </Button>
        </div>
    );
};

export default PlayerCard;
