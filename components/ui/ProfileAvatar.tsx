import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";

const avatarVariants = cva(
  "relative overflow-hidden rounded-[5px] bg-gray-200", // bg-gray-200 for placeholder/fallback visual
  {
    variants: {
      size: {
        36: "w-9 h-9", // 36px
        48: "w-12 h-12", // 48px
        56: "w-14 h-14", // 56px
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
}

const ProfileAvatar = ({ src, alt, size, className }: ProfileAvatarProps) => {
  return (
    <div className={cn(avatarVariants({ size }), className)}>
      <ImgPlayer
        src={src}
        alt={alt}
        className="scale-[2] origin-top bg-transparent"
      />
    </div>
  );
};

export default ProfileAvatar;
