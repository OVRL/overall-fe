import React from "react";
import Image from "next/image";

interface SignupLayoutProps {
    children: React.ReactNode;
    step: number;
    totalSteps: number;
    title: string;
    subtitle?: string;
    onBack?: () => void;
    hideLogo?: boolean;
}

const SignupLayout = ({
    children,
    step,
    totalSteps,
    title, // Note: We might override the title rendering to match the "축구를..." separate from form title
    subtitle,
    onBack,
    hideLogo = false,
}: SignupLayoutProps) => {
    const progressPercentage = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-black flex flex-col p-4 md:p-0 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/object_field.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-30 select-none"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black select-none" />
            </div>

            <div className="relative z-10 w-full max-w-[30rem] mx-auto min-h-screen md:min-h-0 md:h-auto flex flex-col md:my-auto">
                {/* Header Section */}
                <div className="pt-2 pb-6 flex flex-col items-start gap-6">
                    {/* Back Button */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-white hover:text-gray-300 transition-colors p-[4px] -ml-[4px]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* Logo & Slogan */}
                    {!hideLogo && (
                        <div className="space-y-4 animate-slide-in-up">
                            <div className="relative w-[3.75rem] h-[1.5rem]">
                                <Image
                                    src="/images/logo_OVR_head.png"
                                    alt="OVR"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-white whitespace-pre-line leading-[1.35] tracking-tight">
                                축구를 더 즐겁게<br />기록하세요.
                            </h1>
                        </div>
                    )}
                </div>

                {/* Progress Bar (User requested to keep "top indicator") */}
                {/* We place it slightly below header or integrated? Reference doesn't show it clearly, but user asked to keep it.
            Placing it subtly above content. */}
                {totalSteps > 1 && !hideLogo && (
                    <div className="w-full h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-[#D2F700] transition-all duration-300 ease-out" // Using the Volt Green/Yellow from images
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}

                {/* Form Content */}
                <div className="flex-1 flex flex-col animate-fade-in-up delay-100">
                    {/* Step specific Title/Subtitle if needed, otherwise rely on the main slogan */}
                    {(title && title !== "축구를 더 즐겁게\n기록하세요.") && (
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-white mb-1">{title}</h2>
                            {subtitle && <p className="text-Label-Tertiary text-xs">{subtitle}</p>}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
};

export default SignupLayout;
