import Image from "next/image";

export type IconName =
    | "add"
    | "arrow_back"
    | "arrow_forward"
    | "check"
    | "close"
    | "menu"
    | "checkboxOff"
    | "checkboxOn"
    | "close2"
    | "errorNoti"
    | "favorite"
    | "radioOff"
    | "radioOn"
    | "profile";

interface IconProps {
    name: IconName;
    size?: number;
    className?: string;
    onClick?: () => void;
}

const ICON_MAP: Record<IconName, string> = {
    add: "/images/Property 1=add.webp",
    arrow_back: "/images/Property 1=arrow_back.webp",
    arrow_forward: "/images/Property 1=arrow_forward.webp",
    check: "/images/Property 1=check.webp",
    close: "/images/Property 1=close.webp",
    menu: "/images/Property 1=menu.webp",
    checkboxOff: "/images/checkboxOff.webp",
    checkboxOn: "/images/checkboxOn.webp",
    close2: "/images/close2.webp",
    errorNoti: "/images/errorNoti.webp",
    favorite: "/images/favorite.webp",
    radioOff: "/images/radioOff.webp",
    radioOn: "/images/radioOn.webp",
    profile: "/images/profile.webp",
};

export default function Icon({ name, size = 24, className = "", onClick }: IconProps) {
    const src = ICON_MAP[name];

    if (!src) {
        console.warn(`Icon "${name}" not found.`);
        return null; // Handle missing icon gracefully
    }

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className} ${onClick ? 'cursor-pointer' : ''}`}
            style={{ width: size, height: size }}
            onClick={onClick}
        >
            <Image
                src={src}
                alt={name}
                fill
                className="object-contain" // Icons usually need to be contained
            />
        </div>
    );
}
