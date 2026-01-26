import React from "react";

interface SeasonChipProps {
    season?: number | string;
    type?: "general" | "worldBest";
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
            "w-[21px] h-[14px] rounded-[3px] bg-[linear-gradient(109deg,#C4C4C4_0%,#5E5E5E_104.56%)] text-[11px] font-bold font-pretendard shadow-[0_4px_4px_rgba(0,0,0,0.40)]",
        worldBest:
            "w-[21px] h-[14px] rounded-[4px] bg-[linear-gradient(95deg,#D1C6BC_0%,#D4D4D4_24.04%,#ABA29A_37.02%,#F0DFCE_52.4%,#8F8881_64.42%,#FFECDA_76.44%,#78726C_79.81%,#D0C5BA_87.5%,#6B6560_100%)] text-[10px] font-normal font-['Puradak_Gentle_Gothic_OTF'] shadow-[0_4px_4px_rgba(0,0,0,0.40)] [-webkit-text-stroke:0.5px_#565170]",
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type]} ${className}`}>
            {season}
        </div>
    );
}
