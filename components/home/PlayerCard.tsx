"use client";

import React from "react";
import Image from "next/image";
import Button from "../ui/Button";
import MainProfileCard from "../ui/MainProfileCard";
import { Position } from "@/types/position";

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
    season?: string;
    seasonType?: "general" | "worldBest";
}

interface PlayerCardProps {
    player: Player;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 선수 아바타 컴포넌트 (사진 및 OVR 배지)
 */


/**
 * 선수 스탯 정보 그리드
 */


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


    return (
        <div className="mt-4 md:mt-0">
            {/* 선수 헤더 */}
            <div className="flex gap-3 md:gap-4 mb-4 md:mb-5">
                <div className="relative w-24 h-31.5 md:w-28 md:h-38 shrink-0 flex justify-center">
                    <div className="origin-top scale-75 md:scale-[0.85]">
                        <MainProfileCard
                            imgUrl={player.image || "/images/ovr.png"}
                            playerName={player.name}
                            mainPosition={player.position as Position}
                            backNumber={player.number}
                            className="shadow-lg"
                        />
                    </div>
                </div>
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
