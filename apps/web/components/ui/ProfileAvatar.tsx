import { cva, type VariantProps } from "class-variance-authority";
import { cn, MOCK_IMAGE_SRC } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";

const avatarVariants = cva(
  "relative overflow-hidden bg-gray-200 bg-transparent",
  {
    variants: {
      size: {
        xs: "w-8 h-12 md:w-12 md:h-16",
        sm: "w-12 h-16 md:w-16 md:h-20",
        36: "w-9 h-9",
        48: "w-12 h-12",
        56: "w-14 h-14",
        72: "w-18 h-18",
      },
    },
    defaultVariants: {
      size: 48,
    },
  },
);

interface ProfileAvatarProps extends VariantProps<typeof avatarVariants> {
  /** 원본 이미지 URL */
  src?: string | null;
  /** 무효·로드 실패 시 (기본: MOCK_IMAGE_SRC) */
  fallbackSrc?: string;
  alt: string;
  className?: string;
  onError?: () => void;
  priority?: boolean;
}

const ProfileAvatar = ({
  src,
  fallbackSrc = MOCK_IMAGE_SRC,
  alt,
  size,
  className,
  onError,
  priority,
}: ProfileAvatarProps) => {
  return (
    <div className={cn(avatarVariants({ size }), className)}>
      <ImgPlayer
        src={src}
        fallbackSrc={fallbackSrc}
        alt={alt}
        className="scale-[2] origin-top bg-transparent"
        onError={onError}
        priority={priority}
      />
    </div>
  );
};

export default ProfileAvatar;
