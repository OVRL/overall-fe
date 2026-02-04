import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImgPlayerProps {
  src: string;
  alt: string;
  className?: string;
}

const ImgPlayer = ({ src, alt, className }: ImgPlayerProps) => {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
};

export default ImgPlayer;
