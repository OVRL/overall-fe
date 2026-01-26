"use client";

import Image from "next/image";

interface TeamSelectorProps {
    selectedTeam: string;
    onClick?: () => void;
}

/**
 * 팀 선택기 컴포넌트
 */
const TeamSelector = ({
    selectedTeam,
    onClick
}: TeamSelectorProps) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 lg:gap-2 bg-primary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors"
    >
        <div className="w-4 lg:w-5 h-4 lg:h-5 bg-[#004d98] rounded-full relative overflow-hidden">
            <Image
                src="/images/ovr.png"
                alt="Team"
                fill
                className="object-cover"
            />
        </div>
        <span className="text-black text-xs lg:text-sm font-medium truncate max-w-[80px] lg:max-w-none">{selectedTeam}</span>
        <span className="text-black text-xs">▼</span>
    </button>
);

export default TeamSelector;
