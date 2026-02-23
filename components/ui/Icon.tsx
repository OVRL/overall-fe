import Image, { type StaticImageData, type ImageProps } from "next/image";

type IconProps = Omit<ImageProps, "src" | "alt"> & {
  src: StaticImageData;
  nofill?: boolean;
  alt?: string;
};

const EMPTY_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E`;

export default function Icon({
  src,
  nofill,
  width,
  height,
  alt,
  style,
  ...props
}: IconProps) {
  // nofill이 true면 원본 src 객체를 넘겨 Next.js Image의 고유 최적화(가로/세로 비율)를 활성화
  const mainSrc = nofill ? src : EMPTY_SVG;

  // 사용자가 명시하지 않았다면 src의 크기 지정
  const iconWidth = width ?? src.width;
  const iconHeight = height ?? src.height;
  const iconAlt = alt ?? "icon";

  const iconStyle = nofill
    ? { objectFit: "contain" as const, ...style }
    : {
        ...style,
        color: "inherit",
        backgroundColor: `currentcolor`,
        mask: `url("${src.src}") no-repeat center / contain`,
        WebkitMask: `url("${src.src}") no-repeat center / contain`,
      };

  return (
    <Image
      src={mainSrc}
      width={iconWidth}
      height={iconHeight}
      alt={iconAlt}
      style={iconStyle}
      {...props}
    />
  );
}
