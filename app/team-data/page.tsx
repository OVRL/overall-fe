"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";

// ============================================================
// 타입 정의
// ============================================================
interface Player {
    id: number;
    name: string;
    team: string;
    value: string;
    image?: string;
}

interface RankingCardProps {
    title: string;
    players: Player[];
    onMoreClick?: () => void;
    onPlayerClick?: (playerName: string) => void;
}

// ============================================================
// 선수 기록 모달 컴포넌트 (FC 온라인 스타일)
// ============================================================
interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory: string;
    allData: Record<string, Player[]>;
}

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory: string;
    allData: Record<string, Player[]>;
    onPlayerClick?: (playerName: string) => void;
}

function StatsModal({ isOpen, onClose, initialCategory, allData, onPlayerClick }: StatsModalProps) {
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const categories = Object.keys(allData);
    const tabContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveCategory(initialCategory);
    }, [initialCategory]);

    if (!isOpen) return null;

    // TOP10 데이터 (동일 점수면 이름 ㄱㄴㄷ순 정렬)
    const currentPlayers = [...(allData[activeCategory] || [])];
    const top10Players = currentPlayers
        .sort((a, b) => {
            const numA = parseInt(a.value.replace(/[^0-9]/g, '')) || 0;
            const numB = parseInt(b.value.replace(/[^0-9]/g, '')) || 0;
            if (numB !== numA) return numB - numA;
            return a.name.localeCompare(b.name, 'ko');
        })
        .slice(0, 10);

    const scrollTabs = (direction: 'left' | 'right') => {
        if (tabContainerRef.current) {
            const scrollAmount = 150;
            tabContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-surface-secondary rounded-2xl w-[calc(100%-2rem)] md:w-[420px] max-h-[85vh] overflow-hidden shadow-2xl animate-slideUp border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                    <div className="w-6" />
                    <h2 className="text-lg font-bold text-white">선수 기록</h2>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* 카테고리 탭 (좌우 스크롤) */}
                <div className="relative border-b border-gray-700">
                    <button
                        onClick={() => scrollTabs('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface-tertiary rounded-full shadow flex items-center justify-center text-white hover:bg-gray-600"
                    >
                        ‹
                    </button>
                    <div
                        ref={tabContainerRef}
                        className="flex gap-6 px-10 py-3 overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap text-sm font-semibold transition-colors pb-1 ${activeCategory === category
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => scrollTabs('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface-tertiary rounded-full shadow flex items-center justify-center text-white hover:bg-gray-600"
                    >
                        ›
                    </button>
                </div>

                {/* 선수 목록 (TOP10) */}
                <div className="overflow-y-auto max-h-[60vh]">
                    {top10Players.map((player, index) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-4 px-5 py-4 border-b border-gray-700/50 hover:bg-surface-tertiary transition-colors cursor-pointer"
                            onClick={() => onPlayerClick?.(player.name)}
                        >
                            {/* 순위 */}
                            <div className={`w-6 text-center font-bold text-sm ${index < 3 ? "text-yellow-400" : "text-gray-600"}`}>
                                {index < 3 ? <span className="text-lg">{medals[index]}</span> : index + 1}
                            </div>

                            {/* 선수 이미지 */}
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={player.image || "/images/ovr.png"}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* 선수 정보 */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                                <p className="text-gray-500 text-xs">{player.team}</p>
                            </div>

                            {/* 스탯 값 */}
                            <span className="text-primary font-bold text-base">{player.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 선수 검색 결과 카드 모달
// ============================================================
interface PlayerCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player | null;
    seasonStats: Record<string, string>;
    cumulativeStats: Record<string, string>;
    singleRecordStats: Record<string, string>;
    initialTab?: string;
}

function PlayerCardModal({ isOpen, onClose, player, seasonStats, cumulativeStats, singleRecordStats, initialTab = "시즌 기록" }: PlayerCardModalProps) {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);
    const tabs = ["시즌 기록", "누적 기록", "단일 기록"];

    if (!isOpen || !player) return null;

    // 현재 탭에 맞는 스탯 선택
    const currentStats = activeTab === "시즌 기록"
        ? seasonStats
        : activeTab === "누적 기록"
            ? cumulativeStats
            : singleRecordStats;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-surface-secondary to-surface-tertiary rounded-2xl w-[calc(100%-2rem)] md:w-[420px] overflow-hidden shadow-2xl animate-slideUp border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                    <div className="w-6" />
                    <h2 className="text-lg font-bold text-white">선수 정보</h2>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* 선수 정보 */}
                <div className="p-6">
                    {/* 선수 프로필 */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                            <Image
                                src={player.image || "/images/ovr.png"}
                                alt={player.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{player.name}</h3>
                            <p className="text-gray-400">{player.team}</p>
                        </div>
                    </div>

                    {/* 탭 메뉴 */}
                    <div className="flex gap-2 mb-4 border-b border-gray-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab
                                    ? "text-primary border-b-2 border-primary -mb-[1px]"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* 스탯 그리드 */}
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(currentStats).map(([statName, statValue]) => (
                            <div
                                key={statName}
                                className="bg-surface-tertiary rounded-lg p-3 flex justify-between items-center"
                            >
                                <span className="text-gray-400 text-sm">{statName}</span>
                                <span className="text-primary font-bold">{statValue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 순위 카드 컴포넌트
// ============================================================
function RankingCard({ title, players, onMoreClick, onPlayerClick }: RankingCardProps) {
    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 md:p-5 min-w-[260px] md:min-w-[280px] flex-shrink-0">
            {/* 헤더 */}
            <h3 className="text-lg font-bold text-white text-center mb-4">{title}</h3>

            {/* 순위 리스트 */}
            <div className="flex flex-col gap-3">
                {players.map((player, index) => (
                    <div
                        key={player.id}
                        className="flex items-center gap-3 py-2 hover:bg-surface-tertiary rounded-lg transition-colors cursor-pointer px-2"
                        onClick={() => onPlayerClick?.(player.name)}
                    >
                        {/* 순위 */}
                        <div className={`flex items-center gap-1 font-black text-sm w-8 ${index < 3 ? "text-yellow-400" : "text-gray-600"}`}>
                            {index < 3 && <span className="text-lg">{medals[index]}</span>}
                            {index >= 3 && <span>{index + 1}</span>}
                        </div>

                        {/* 선수 이미지 */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={player.image || "/images/ovr.png"}
                                alt={player.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* 선수 정보 */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-white font-semibold text-sm truncate">{player.name}</span>
                            <span className="text-gray-500 text-xs">{player.team}</span>
                        </div>

                        {/* 스탯 값 */}
                        <span className="text-primary font-bold text-base flex-shrink-0">{player.value}</span>
                    </div>
                ))}
            </div>

            {/* 더보기 버튼 */}
            <button
                onClick={onMoreClick}
                className="w-full text-gray-500 text-sm hover:text-white transition-colors py-3 mt-2 border-t border-gray-800"
            >
                더보기
            </button>
        </div>
    );
}


// ============================================================
// 시즌 선택기 컴포넌트
// ============================================================
function SeasonSelector() {
    const [season, setSeason] = useState("2025-26");

    return (
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6 md:mb-8">
            <button className="w-10 h-10 bg-surface-secondary rounded-full flex items-center justify-center text-white hover:bg-surface-tertiary transition-colors">
                ‹
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-white">{season}</h1>
            <button className="w-10 h-10 bg-surface-secondary rounded-full flex items-center justify-center text-white hover:bg-surface-tertiary transition-colors">
                ›
            </button>
        </div>
    );
}

// ============================================================
// 검색 박스 컴포넌트
// ============================================================
function SearchBox() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex justify-end mb-6">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="선수 이름을 검색하세요"
                    className="bg-surface-secondary border border-gray-700 rounded-lg px-5 py-3 text-white text-sm w-72 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="bg-primary hover:bg-primary-hover text-black font-bold px-6 py-3 rounded-lg transition-colors">
                    검색
                </button>
            </div>
        </div>
    );
}

// ============================================================
// 탭 메뉴 컴포넌트
// ============================================================
function TabMenu() {
    const [activeTab, setActiveTab] = useState("팀 순위");
    const tabs = ["시즌 순위", "누적 기록", "단일 기록"];

    return (
        <div className="flex gap-2 border-b-2 border-gray-800 mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 font-semibold text-base transition-colors border-b-3 ${activeTab === tab
                        ? "text-primary border-b-2 border-primary -mb-[2px]"
                        : "text-gray-600 border-transparent hover:text-gray-400"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

// ============================================================
// 순위 카드 캐러셀 컴포넌트
// ============================================================
interface RankingCardsCarouselProps {
    statsData: Record<string, Player[]>;
    onCategoryClick?: (category: string) => void;
    onPlayerClick?: (playerName: string) => void;
}

function RankingCardsCarousel({ statsData, onCategoryClick, onPlayerClick }: RankingCardsCarouselProps) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // 드래그 스크롤 상태
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // 드래그 시작
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeftStart(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    // 드래그 중
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // 드래그 속도 조절
        scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
    };

    // 드래그 종료
    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.cursor = 'grab';
            }
        }
    };

    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener('scroll', updateScrollButtons);
        }
    }, []);

    return (
        <div className="relative">
            {/* 왼쪽 화살표 - primary 색상 (모바일에서 숨김) */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary hover:bg-primary-hover rounded-full items-center justify-center text-black shadow-lg transition-all"
                >
                    <span className="text-2xl font-bold">‹</span>
                </button>
            )}

            {/* 오른쪽 화살표 - primary 색상 (모바일에서 숨김) */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary hover:bg-primary-hover rounded-full items-center justify-center text-black shadow-lg transition-all"
                >
                    <span className="text-2xl font-bold">›</span>
                </button>
            )}

            {/* 스크롤 컨테이너 (드래그 가능) */}
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide px-2 select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                    {Object.entries(statsData).map(([title, players]) => (
                        <RankingCard
                            key={title}
                            title={title}
                            players={players.slice(0, 4)}
                            onMoreClick={() => onCategoryClick?.(title)}
                            onPlayerClick={onPlayerClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


// ============================================================
// 메인 페이지 컴포넌트
// ============================================================
export default function TeamDataPage() {
    const [activeTab, setActiveTab] = useState("시즌 기록");

    // 누적 기록 데이터 (2022-2025 합산) - 10명
    const cumulativeData = {
        출장수: [
            { id: 1, name: "박무드", team: "대한민국", value: "120경기", image: "/images/player/img_player-1.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "112경기", image: "/images/player/img_player-2.png" },
            { id: 3, name: "호남두호남두", team: "대한민국", value: "108경기", image: "/images/player/img_player-3.png" },
            { id: 4, name: "가갑밤베스", team: "대한민국", value: "98경기", image: "/images/player/img_player-4.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "95경기", image: "/images/player/img_player-5.png" },
            { id: 6, name: "렌디", team: "대한민국", value: "88경기", image: "/images/player/img_player-6.png" },
            { id: 7, name: "제스퍼", team: "대한민국", value: "82경기", image: "/images/player/img_player-7.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "75경기", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "68경기", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "62경기", image: "/images/player/img_player-10.png" },
        ],
        득점: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "87골", image: "/images/player/img_player-5.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "72골", image: "/images/player/img_player-1.png" },
            { id: 3, name: "알베스", team: "대한민국", value: "56골", image: "/images/player/img_player-2.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "45골", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "38골", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "32골", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "25골", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "18골", image: "/images/player/img_player-9.png" },
            { id: 9, name: "이준호", team: "대한민국", value: "12골", image: "/images/player/img_player-10.png" },
            { id: 10, name: "다라에밤베스", team: "대한민국", value: "8골", image: "/images/player/img_player-8.png" },
        ],
        도움: [
            { id: 1, name: "알베스", team: "대한민국", value: "52개", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "41개", image: "/images/player/img_player-1.png" },
            { id: 3, name: "제스퍼", team: "대한민국", value: "35개", image: "/images/player/img_player-7.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "28개", image: "/images/player/img_player-6.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "24개", image: "/images/player/img_player-5.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "20개", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "15개", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "12개", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "8개", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "5개", image: "/images/player/img_player-10.png" },
        ],
        공격포인트: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "139P", image: "/images/player/img_player-5.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "108P", image: "/images/player/img_player-2.png" },
            { id: 3, name: "박무드", team: "대한민국", value: "113P", image: "/images/player/img_player-1.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "73P", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "58P", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "47P", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "40P", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "30P", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "16P", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "17P", image: "/images/player/img_player-10.png" },
        ],
        클린시트: [
            { id: 1, name: "박무드", team: "대한민국", value: "48회", image: "/images/player/img_player-1.png" },
            { id: 2, name: "가갑밤베스", team: "대한민국", value: "38회", image: "/images/player/img_player-4.png" },
            { id: 3, name: "다라에밤베스", team: "대한민국", value: "32회", image: "/images/player/img_player-8.png" },
            { id: 4, name: "호남두호남두", team: "대한민국", value: "28회", image: "/images/player/img_player-3.png" },
            { id: 5, name: "알베스", team: "대한민국", value: "20회", image: "/images/player/img_player-2.png" },
            { id: 6, name: "김민수", team: "대한민국", value: "15회", image: "/images/player/img_player-9.png" },
            { id: 7, name: "이준호", team: "대한민국", value: "12회", image: "/images/player/img_player-10.png" },
            { id: 8, name: "렌디", team: "대한민국", value: "10회", image: "/images/player/img_player-6.png" },
            { id: 9, name: "제스퍼", team: "대한민국", value: "8회", image: "/images/player/img_player-7.png" },
            { id: 10, name: "수원알베스", team: "대한민국", value: "5회", image: "/images/player/img_player-5.png" },
        ],
        OVR: [
            { id: 1, name: "알베스", team: "대한민국", value: "92", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "89", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "87", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "85", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "84", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "82", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "80", image: "/images/player/img_player-4.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "78", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "76", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "74", image: "/images/player/img_player-10.png" },
        ],
        TOP3: [
            { id: 1, name: "알베스", team: "대한민국", value: "95회", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "88회", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "72회", image: "/images/player/img_player-5.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "58회", image: "/images/player/img_player-6.png" },
            { id: 5, name: "제스퍼", team: "대한민국", value: "45회", image: "/images/player/img_player-7.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "38회", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "28회", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "20회", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "15회", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "10회", image: "/images/player/img_player-10.png" },
        ],
        개인승점: [
            { id: 1, name: "알베스", team: "대한민국", value: "245점", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "228점", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "198점", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "175점", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "152점", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "128점", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "105점", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "82점", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "65점", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "48점", image: "/images/player/img_player-10.png" },
        ],
    };

    // 단일 기록 데이터 (최고 기록 + 년도) - 10명
    const singleRecordData = {
        출장수: [
            { id: 1, name: "박무드", team: "대한민국", value: "32경기 (2024년)", image: "/images/player/img_player-1.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "30경기 (2023년)", image: "/images/player/img_player-2.png" },
            { id: 3, name: "호남두호남두", team: "대한민국", value: "29경기 (2024년)", image: "/images/player/img_player-3.png" },
            { id: 4, name: "가갑밤베스", team: "대한민국", value: "28경기 (2025년)", image: "/images/player/img_player-4.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "27경기 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 6, name: "렌디", team: "대한민국", value: "26경기 (2023년)", image: "/images/player/img_player-6.png" },
            { id: 7, name: "제스퍼", team: "대한민국", value: "25경기 (2022년)", image: "/images/player/img_player-7.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "24경기 (2024년)", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "22경기 (2023년)", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "20경기 (2025년)", image: "/images/player/img_player-10.png" },
        ],
        득점: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "28골 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "24골 (2023년)", image: "/images/player/img_player-1.png" },
            { id: 3, name: "알베스", team: "대한민국", value: "18골 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "15골 (2022년)", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "12골 (2023년)", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "10골 (2024년)", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "8골 (2022년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "6골 (2025년)", image: "/images/player/img_player-9.png" },
            { id: 9, name: "이준호", team: "대한민국", value: "5골 (2023년)", image: "/images/player/img_player-10.png" },
            { id: 10, name: "다라에밤베스", team: "대한민국", value: "4골 (2024년)", image: "/images/player/img_player-8.png" },
        ],
        도움: [
            { id: 1, name: "알베스", team: "대한민국", value: "16개 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "14개 (2023년)", image: "/images/player/img_player-1.png" },
            { id: 3, name: "제스퍼", team: "대한민국", value: "12개 (2025년)", image: "/images/player/img_player-7.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "10개 (2023년)", image: "/images/player/img_player-6.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "8개 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "7개 (2022년)", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "5개 (2024년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "4개 (2023년)", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "3개 (2025년)", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "2개 (2022년)", image: "/images/player/img_player-10.png" },
        ],
        공격포인트: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "44P (2024년)", image: "/images/player/img_player-5.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "34P (2024년)", image: "/images/player/img_player-2.png" },
            { id: 3, name: "박무드", team: "대한민국", value: "38P (2023년)", image: "/images/player/img_player-1.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "25P (2022년)", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "19P (2023년)", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "17P (2024년)", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "13P (2022년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "10P (2025년)", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "7P (2023년)", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "7P (2024년)", image: "/images/player/img_player-10.png" },
        ],
        클린시트: [
            { id: 1, name: "박무드", team: "대한민국", value: "15회 (2024년)", image: "/images/player/img_player-1.png" },
            { id: 2, name: "가갑밤베스", team: "대한민국", value: "12회 (2023년)", image: "/images/player/img_player-4.png" },
            { id: 3, name: "다라에밤베스", team: "대한민국", value: "10회 (2024년)", image: "/images/player/img_player-8.png" },
            { id: 4, name: "호남두호남두", team: "대한민국", value: "9회 (2022년)", image: "/images/player/img_player-3.png" },
            { id: 5, name: "알베스", team: "대한민국", value: "7회 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 6, name: "김민수", team: "대한민국", value: "5회 (2023년)", image: "/images/player/img_player-9.png" },
            { id: 7, name: "이준호", team: "대한민국", value: "4회 (2025년)", image: "/images/player/img_player-10.png" },
            { id: 8, name: "렌디", team: "대한민국", value: "3회 (2022년)", image: "/images/player/img_player-6.png" },
            { id: 9, name: "제스퍼", team: "대한민국", value: "2회 (2024년)", image: "/images/player/img_player-7.png" },
            { id: 10, name: "수원알베스", team: "대한민국", value: "2회 (2023년)", image: "/images/player/img_player-5.png" },
        ],
        OVR: [
            { id: 1, name: "알베스", team: "대한민국", value: "94 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "91 (2023년)", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "89 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "87 (2025년)", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "86 (2024년)", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "84 (2023년)", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "82 (2022년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "80 (2024년)", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "78 (2023년)", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "76 (2025년)", image: "/images/player/img_player-10.png" },
        ],
        TOP3: [
            { id: 1, name: "알베스", team: "대한민국", value: "28회 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "25회 (2023년)", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "22회 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "18회 (2025년)", image: "/images/player/img_player-6.png" },
            { id: 5, name: "제스퍼", team: "대한민국", value: "15회 (2024년)", image: "/images/player/img_player-7.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "12회 (2023년)", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "10회 (2022년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "7회 (2024년)", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "5회 (2023년)", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "4회 (2025년)", image: "/images/player/img_player-10.png" },
        ],
        개인승점: [
            { id: 1, name: "알베스", team: "대한민국", value: "72점 (2024년)", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "68점 (2023년)", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "58점 (2024년)", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "52점 (2025년)", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "45점 (2024년)", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "38점 (2023년)", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "32점 (2022년)", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "25점 (2024년)", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "18점 (2023년)", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "15점 (2025년)", image: "/images/player/img_player-10.png" },
        ],
    };

    // 시즌 기록 데이터 (이번 시즌 2025-26 데이터 - 카테고리별) - 10명
    const seasonRecordData = {
        출장수: [
            { id: 1, name: "박무드", team: "대한민국", value: "28경기", image: "/images/player/img_player-1.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "26경기", image: "/images/player/img_player-2.png" },
            { id: 3, name: "호남두호남두", team: "대한민국", value: "25경기", image: "/images/player/img_player-3.png" },
            { id: 4, name: "가갑밤베스", team: "대한민국", value: "23경기", image: "/images/player/img_player-4.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "22경기", image: "/images/player/img_player-5.png" },
            { id: 6, name: "렌디", team: "대한민국", value: "21경기", image: "/images/player/img_player-6.png" },
            { id: 7, name: "제스퍼", team: "대한민국", value: "20경기", image: "/images/player/img_player-7.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "18경기", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "17경기", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "15경기", image: "/images/player/img_player-10.png" },
        ],
        득점: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "24골", image: "/images/player/img_player-5.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "18골", image: "/images/player/img_player-1.png" },
            { id: 3, name: "알베스", team: "대한민국", value: "15골", image: "/images/player/img_player-2.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "12골", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "10골", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "8골", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "6골", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "5골", image: "/images/player/img_player-9.png" },
            { id: 9, name: "이준호", team: "대한민국", value: "4골", image: "/images/player/img_player-10.png" },
            { id: 10, name: "다라에밤베스", team: "대한민국", value: "3골", image: "/images/player/img_player-8.png" },
        ],
        도움: [
            { id: 1, name: "알베스", team: "대한민국", value: "14개", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "11개", image: "/images/player/img_player-1.png" },
            { id: 3, name: "제스퍼", team: "대한민국", value: "9개", image: "/images/player/img_player-7.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "7개", image: "/images/player/img_player-6.png" },
            { id: 5, name: "수원알베스", team: "대한민국", value: "6개", image: "/images/player/img_player-5.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "5개", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "4개", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "3개", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "2개", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "1개", image: "/images/player/img_player-10.png" },
        ],
        공격포인트: [
            { id: 1, name: "수원알베스", team: "대한민국", value: "38P", image: "/images/player/img_player-5.png" },
            { id: 2, name: "알베스", team: "대한민국", value: "29P", image: "/images/player/img_player-2.png" },
            { id: 3, name: "박무드", team: "대한민국", value: "29P", image: "/images/player/img_player-1.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "19P", image: "/images/player/img_player-6.png" },
            { id: 5, name: "호남두호남두", team: "대한민국", value: "15P", image: "/images/player/img_player-3.png" },
            { id: 6, name: "제스퍼", team: "대한민국", value: "12P", image: "/images/player/img_player-7.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "10P", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "8P", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "5P", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "5P", image: "/images/player/img_player-10.png" },
        ],
        클린시트: [
            { id: 1, name: "박무드", team: "대한민국", value: "12회", image: "/images/player/img_player-1.png" },
            { id: 2, name: "가갑밤베스", team: "대한민국", value: "9회", image: "/images/player/img_player-4.png" },
            { id: 3, name: "다라에밤베스", team: "대한민국", value: "7회", image: "/images/player/img_player-8.png" },
            { id: 4, name: "호남두호남두", team: "대한민국", value: "5회", image: "/images/player/img_player-3.png" },
            { id: 5, name: "알베스", team: "대한민국", value: "4회", image: "/images/player/img_player-2.png" },
            { id: 6, name: "김민수", team: "대한민국", value: "3회", image: "/images/player/img_player-9.png" },
            { id: 7, name: "이준호", team: "대한민국", value: "2회", image: "/images/player/img_player-10.png" },
            { id: 8, name: "렌디", team: "대한민국", value: "2회", image: "/images/player/img_player-6.png" },
            { id: 9, name: "제스퍼", team: "대한민국", value: "1회", image: "/images/player/img_player-7.png" },
            { id: 10, name: "수원알베스", team: "대한민국", value: "1회", image: "/images/player/img_player-5.png" },
        ],
        TOP3: [
            { id: 1, name: "알베스", team: "대한민국", value: "22회", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "18회", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "15회", image: "/images/player/img_player-5.png" },
            { id: 4, name: "렌디", team: "대한민국", value: "12회", image: "/images/player/img_player-6.png" },
            { id: 5, name: "제스퍼", team: "대한민국", value: "10회", image: "/images/player/img_player-7.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "8회", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "6회", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "4회", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "3회", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "2회", image: "/images/player/img_player-10.png" },
        ],
        OVR: [
            { id: 1, name: "알베스", team: "대한민국", value: "92", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "89", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "87", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "85", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "84", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "82", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "80", image: "/images/player/img_player-4.png" },
            { id: 8, name: "다라에밤베스", team: "대한민국", value: "78", image: "/images/player/img_player-8.png" },
            { id: 9, name: "김민수", team: "대한민국", value: "76", image: "/images/player/img_player-9.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "74", image: "/images/player/img_player-10.png" },
        ],
        개인승점: [
            { id: 1, name: "알베스", team: "대한민국", value: "58점", image: "/images/player/img_player-2.png" },
            { id: 2, name: "박무드", team: "대한민국", value: "52점", image: "/images/player/img_player-1.png" },
            { id: 3, name: "수원알베스", team: "대한민국", value: "45점", image: "/images/player/img_player-5.png" },
            { id: 4, name: "제스퍼", team: "대한민국", value: "38점", image: "/images/player/img_player-7.png" },
            { id: 5, name: "렌디", team: "대한민국", value: "32점", image: "/images/player/img_player-6.png" },
            { id: 6, name: "호남두호남두", team: "대한민국", value: "28점", image: "/images/player/img_player-3.png" },
            { id: 7, name: "가갑밤베스", team: "대한민국", value: "24점", image: "/images/player/img_player-4.png" },
            { id: 8, name: "김민수", team: "대한민국", value: "18점", image: "/images/player/img_player-9.png" },
            { id: 9, name: "다라에밤베스", team: "대한민국", value: "15점", image: "/images/player/img_player-8.png" },
            { id: 10, name: "이준호", team: "대한민국", value: "12점", image: "/images/player/img_player-10.png" },
        ],
    };

    // 현재 탭에 맞는 데이터 선택
    const currentData = activeTab === "시즌 기록"
        ? seasonRecordData
        : activeTab === "누적 기록"
            ? cumulativeData
            : singleRecordData;
    const tabs = ["시즌 기록", "누적 기록", "단일 기록"];

    // 모달 상태 관리
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [modalCategory, setModalCategory] = useState("");
    const [isPlayerCardOpen, setIsPlayerCardOpen] = useState(false);
    const [searchedPlayer, setSearchedPlayer] = useState<Player | null>(null);
    const [searchedSeasonStats, setSearchedSeasonStats] = useState<Record<string, string>>({});
    const [searchedCumulativeStats, setSearchedCumulativeStats] = useState<Record<string, string>>({});
    const [searchedSingleRecordStats, setSearchedSingleRecordStats] = useState<Record<string, string>>({});

    // 더보기 클릭 핸들러
    const handleCategoryClick = (category: string) => {
        setModalCategory(category);
        setIsStatsModalOpen(true);
    };

    // 선수 선택/검색 핸들러
    const handlePlayerSelect = (playerName: string) => {
        // 모든 데이터에서 선수 찾기
        let foundPlayer: Player | null = null;
        const seasonStats: Record<string, string> = {};
        const cumulativeStats: Record<string, string> = {};
        const singleStats: Record<string, string> = {};

        // 시즌 기록에서 찾기
        Object.entries(seasonRecordData).forEach(([category, players]) => {
            const player = players.find(p => p.name.includes(playerName));
            if (player) {
                foundPlayer = player;
                seasonStats[category] = player.value;
            }
        });

        // 누적 기록에서 찾기
        Object.entries(cumulativeData).forEach(([category, players]) => {
            const player = players.find(p => p.name.includes(playerName));
            if (player) {
                if (!foundPlayer) foundPlayer = player;
                cumulativeStats[category] = player.value;
            }
        });

        // 단일 기록에서 찾기
        Object.entries(singleRecordData).forEach(([category, players]) => {
            const player = players.find(p => p.name.includes(playerName));
            if (player) {
                if (!foundPlayer) foundPlayer = player;
                singleStats[category] = player.value;
            }
        });

        if (foundPlayer) {
            setSearchedPlayer(foundPlayer);
            setSearchedSeasonStats(seasonStats);
            setSearchedCumulativeStats(cumulativeStats);
            setSearchedSingleRecordStats(singleStats);
            setIsPlayerCardOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-surface-primary">
            <Header showTeamSelector selectedTeam="바르셀로나 FC" />

            <main className="max-w-[1400px] mx-auto p-4 md:p-8">
                {/* 시즌 선택기 */}
                <SeasonSelector />

                {/* 검색 박스 */}
                <SearchBoxWithHandler onSearch={handlePlayerSelect} />

                {/* 탭 메뉴 - 반응형 */}
                <div
                    className="flex gap-1 md:gap-2 border-b-2 border-gray-800 mb-6 md:mb-8 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 md:px-8 py-3 md:py-4 font-semibold text-sm md:text-base transition-colors border-b-3 ${activeTab === tab
                                ? "text-primary border-b-2 border-primary -mb-[2px]"
                                : "text-gray-600 border-transparent hover:text-gray-400"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 순위 카드 - 가로 스크롤 (화살표 네비게이션) */}
                <RankingCardsCarousel
                    statsData={currentData}
                    onCategoryClick={handleCategoryClick}
                    onPlayerClick={handlePlayerSelect}
                />
            </main>

            {/* 선수 기록 모달 (더보기) */}
            <StatsModal
                isOpen={isStatsModalOpen}
                onClose={() => setIsStatsModalOpen(false)}
                initialCategory={modalCategory}
                allData={currentData}
                onPlayerClick={handlePlayerSelect}
            />

            {/* 선수 카드 모달 (검색) */}
            <PlayerCardModal
                isOpen={isPlayerCardOpen}
                onClose={() => setIsPlayerCardOpen(false)}
                player={searchedPlayer}
                seasonStats={searchedSeasonStats}
                cumulativeStats={searchedCumulativeStats}
                singleRecordStats={searchedSingleRecordStats}
                initialTab={activeTab === "팀 순위" ? "시즌 기록" : activeTab}
            />

            {/* 애니메이션 스타일 */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

// ============================================================
// 검색 박스 컴포넌트 (핸들러 포함)
// ============================================================
interface SearchBoxWithHandlerProps {
    onSearch: (playerName: string) => void;
}

function SearchBoxWithHandler({ onSearch }: SearchBoxWithHandlerProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="flex justify-center md:justify-end mb-4 md:mb-6">
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="선수 이름을 검색하세요"
                    className="bg-surface-secondary border border-gray-700 rounded-lg px-3 md:px-5 py-2.5 md:py-3 text-white text-sm flex-1 md:w-72 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-primary hover:bg-primary-hover text-black font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors whitespace-nowrap"
                >
                    검색
                </button>
            </div>
        </div>
    );
}
