import React from "react";

const Icon = ({
  src,
  alt = "icon",
  ...props
}: {
  src: string | { src: string };
  alt?: string;
} & React.ComponentProps<"img">) => {
  const imageSrc = typeof src === "string" ? src : src.src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageSrc} alt={alt} data-testid={`icon-${alt}`} {...props} />
  );
};

export default Icon;
