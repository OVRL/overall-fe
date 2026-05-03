import Image, { type StaticImageData, type ImageProps } from "next/image";

type IconProps = Omit<ImageProps, "src" | "alt"> & {
  src: StaticImageData;
  nofill?: boolean;
  alt?: string;
};

export default function Icon({
  src,
  nofill,
  width,
  height,
  alt,
  style,
  ...props
}: IconProps) {
  const iconWidth = width ?? src.width;
  const iconHeight = height ?? src.height;
  const iconAlt = alt ?? "icon";

  if (nofill) {
    // width/height가 명시되면 그 크기로 렌더, 없을 때만 auto로 본래 크기 사용
    const sizeStyle =
      width != null && height != null
        ? { width: iconWidth, height: iconHeight }
        : { width: "auto", height: "auto" };
    return (
      <Image
        src={src}
        width={iconWidth}
        height={iconHeight}
        alt={iconAlt}
        style={{
          objectFit: "contain",
          ...sizeStyle,
          ...(width != null && height == null ? { height: "auto" } : {}),
          ...(width == null && height != null ? { width: "auto" } : {}),
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={iconAlt}
      style={{
        display: "inline-block",
        width: iconWidth,
        height: iconHeight,
        backgroundColor: "currentColor",
        mask: `url("${src.src}") no-repeat center / contain`,
        WebkitMask: `url("${src.src}") no-repeat center / contain`,
        ...style,
      }}
      className={props.className}
    />
  );
}
