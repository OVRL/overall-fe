import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImgPlayerProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  /** fill 사용 시 필수. 뷰포트별 예상 크기 (성능 최적화) */
  sizes?: string;
  /** LCP 이미지일 때 true (above the fold) */
  priority?: boolean;
}

const ImgPlayer = ({ src, alt, className, onError, sizes = "(max-width: 640px) 80px, (max-width: 1024px) 120px, 160px", priority }: ImgPlayerProps) => {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        quality={100}
        onError={onError}
        {...(priority && { priority: true })}
      />
    </div>
  );
};

export default ImgPlayer;
