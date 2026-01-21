import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "default" | "full";
    children: React.ReactNode;
}

export default function Button({
    variant = "primary",
    size = "default",
    className = "",
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        "flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
        default: "px-6 py-3 rounded-xl text-[15px]",
        full: "w-full py-4 rounded-xl text-[16px]",
    };

    const variantStyles = {
        primary: "bg-[#D2FF00] hover:bg-[#c2eb00] text-black shadow-lg shadow-[#D2FF00]/20",
        secondary: "bg-white hover:bg-gray-100 text-black border border-gray-200",
        ghost: "bg-transparent hover:bg-white/10 text-white",
    };

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
