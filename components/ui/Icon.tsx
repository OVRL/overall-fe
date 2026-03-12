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
    return (
      <Image
        src={src}
        width={iconWidth}
        height={iconHeight}
        alt={iconAlt}
        style={{ objectFit: "contain", width: "auto", height: "auto", ...style }}
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
