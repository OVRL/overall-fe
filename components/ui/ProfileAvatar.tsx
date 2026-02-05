import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";

const avatarVariants = cva(
  "relative overflow-hidden rounded-[5px] bg-gray-200", // bg-gray-200 for placeholder/fallback visual
  {
    variants: {
      size: {
        xs: "w-8 h-12 md:w-12 md:h-16", // 32x48 / 48x64 (responsive)
        sm: "w-12 h-16 md:w-16 md:h-20", // 48x64 / 64x80 (responsive)
        36: "w-9 h-9", // 36px (square)
        48: "w-12 h-12", // 48px (square)
        56: "w-14 h-14", // 56px (square)
      },
    },
    defaultVariants: {
      size: 48,
    },
  },
);

interface ProfileAvatarProps extends VariantProps<typeof avatarVariants> {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const ProfileAvatar = ({ src, alt, size, className, onError }: ProfileAvatarProps) => {
  return (
    <div className={cn(avatarVariants({ size }), className)}>
      <ImgPlayer
        src={src}
        alt={alt}
        className="scale-[2] origin-top bg-transparent"
        onError={onError}
      />
    </div>
  );
};

export default ProfileAvatar;

