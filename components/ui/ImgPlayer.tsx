import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImgPlayerProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const ImgPlayer = ({ src, alt, className, onError }: ImgPlayerProps) => {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image src={src} alt={alt} fill className="object-cover" onError={onError} />
    </div>
  );
};

export default ImgPlayer;

