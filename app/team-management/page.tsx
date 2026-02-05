"use client";

import Header from "@/components/layout/Header";
import Link from "next/link";

interface ManagementCard {
    title: string;
    description: string;
    href: string;
    icon: string;
}

const managementCards: ManagementCard[] = [
    {
        title: "선수 관리",
        description: "선수 등록, 수정, 삭제 및 선수 정보 관리",
        href: "/manage/players",
        icon: "👥",
    },
    {
        title: "경기 관리",
        description: "경기 일정 등록 및 경기 결과 관리",
        href: "/manage/matches",
        icon: "⚽",
    },
    {
        title: "통계 관리",
        description: "팀 및 선수 통계 데이터 관리",
        href: "/manage/stats",
        icon: "📊",
    },
    {
        title: "설정",
        description: "팀 설정 및 시스템 환경 설정",
        href: "/manage/settings",
        icon: "⚙️",
    },
];

export default function TeamManagementPage() {
    return (
        <div className="min-h-screen bg-surface-primary">
            <Header showTeamSelector selectedTeam="바르셀로나 FC" />

            <main className="max-w-350 mx-auto p-8">
                {/* 페이지 헤더 */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        팀 관리
                    </h1>
                    <p className="text-gray-400">
                        팀의 선수, 경기, 통계 등을 관리할 수 있습니다.
                    </p>
                </div>

                {/* 관리 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {managementCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="group bg-surface-secondary border border-gray-800 rounded-2xl p-6 hover:border-primary/50 hover:bg-surface-secondary/80 transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{card.icon}</div>
                            <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                {card.title}
                            </h2>
                            <p className="text-sm text-gray-400">{card.description}</p>
                        </Link>
                    ))}
                </div>

                {/* 빠른 액션 섹션 */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-white mb-4">빠른 액션</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/manage/players"
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm"
                        >
                            + 새 선수 등록
                        </Link>
                        <Link
                            href="/manage/matches"
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm"
                        >
                            + 새 경기 등록
                        </Link>
                        <Link
                            href="/formation"
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm"
                        >
                            포메이션 설정
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
