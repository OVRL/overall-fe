import Image, { type StaticImageData, type ImageProps } from 'next/image';

type IconProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: StaticImageData;
  nofill?: boolean;
  alt?: string;
};

const EMPTY_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E`;

export default function Icon({ src, nofill, width, height, alt, style, ...props }: IconProps) {
  const mainSrc = nofill ? src.src : EMPTY_SVG;
  width ??= src.width;
  height ??= src.height;
  alt ??= 'icon';
  style = nofill
    ? style
    : {
        ...style,
        color: 'inherit',
        backgroundColor: `currentcolor`,
        mask: `url("${src.src}") no-repeat center / contain`,
      };

  return <Image src={mainSrc} width={width} height={height} alt={alt} style={style} {...props} />;
}
