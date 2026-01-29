"use client";

import React from "react";
import Image from "next/image";
import FormationTabs from "./FormationTabs";

/**
 * 헤더 컴포넌트
 */
interface FormationHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const FormationHeader = ({ activeTab, setActiveTab }: FormationHeaderProps) => (
    <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="relative w-35 h-7.5 md:w-50 md:h-10">
            <Image
                src="/images/object_title_starting11.png"
                alt="STARTING XI"
                fill
                className="object-contain object-left"
            />
        </div>
        <FormationTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
);

export default FormationHeader;
