import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface StepSuccessProps {
    onHome: () => void;
}

const StepSuccess = ({ onHome }: StepSuccessProps) => {
    return (
        <div className="flex flex-col h-full items-center justify-center relative">
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-12 text-center animate-slide-in-up">
                    회원 가입을 축하합니다.
                </h2>

                {/* Visual - Using placeholder or available asset. 
                User asked to analyze attached images. I will use a celebratory visual.
                Since I don't have the 3D chars, I'll use the OVR logo or a placeholder div 
                that represents the 'Team' or 'Community'. 
            */}
                <div className="relative w-64 h-64 mb-8 animate-zoom-in delay-100">
                    {/* Fallback visual: Since we don't have the 3D team image, 
                    we'll render a nice placeholder or the logo with effects. 
                    If 'bg_zlatan.webp' is available, maybe a crop of that?
                    Let's use a nice composition of the logo for now. 
                */}
                    <div className="absolute inset-0 bg-gradient-radial from-[#D2F700]/20 to-transparent blur-2xl opacity-50" />
                    <Image
                        src="/images/logo_OVR_head.png"
                        alt="Success"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(210,247,0,0.5)]"
                    />
                </div>

                {/* Confetti / Decoration (CSS based simple particles could go here) */}
            </div>

            <div className="w-full mt-auto pb-8 z-10">
                <Button
                    size="xl"
                    onClick={onHome}
                    className="bg-[#88cc00] hover:bg-[#99dd00] text-black font-bold border-none" // Matching the Lime/Green button
                >
                    홈으로
                </Button>
            </div>
        </div>
    );
};

export default StepSuccess;
