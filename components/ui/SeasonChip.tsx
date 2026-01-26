import React from "react";

export type SeasonType = "general" | "worldBest";

interface SeasonChipProps {
    season?: number | string;
    type?: SeasonType;
    className?: string;
}

/**
 * SeasonChip Component
 * Displays a season badge (e.g., "26") with specific styling for General and World Best types.
 */
export default function SeasonChip({
    season = 26,
    type = "general",
    className = "",
}: SeasonChipProps) {
    const baseStyles = "flex items-center justify-center text-white shrink-0";

    const typeStyles = {
        general:
            "w-[1.3125rem] h-[0.875rem] rounded-[0.1875rem] bg-[linear-gradient(109deg,#C4C4C4_0%,#5E5E5E_104.56%)] text-[0.6875rem] font-bold font-pretendard shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.40)]",
        worldBest:
            "w-[1.3125rem] h-[0.875rem] rounded-[0.25rem] bg-[linear-gradient(95deg,#D1C6BC_0%,#D4D4D4_24.04%,#ABA29A_37.02%,#F0DFCE_52.4%,#8F8881_64.42%,#FFECDA_76.44%,#78726C_79.81%,#D0C5BA_87.5%,#6B6560_100%)] text-[0.625rem] font-normal font-['Puradak_Gentle_Gothic_OTF'] shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.40)] [-webkit-text-stroke:0.03125rem_#565170]",
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type]} ${className}`}>
            {season}
        </div>
    );
}
