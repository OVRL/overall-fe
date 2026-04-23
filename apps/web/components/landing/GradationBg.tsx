type Props = {
  width: number | string;
  align: "left" | "right";
  variant: "transparent-leading" | "transparent-trailing";
  angleDeg?: number;
  blackStopPercent?: number;
  transparentStopPercent?: number;
  className?: string;
};

const GradationBg = ({
  width,
  align,
  variant,
  angleDeg = 90,
  blackStopPercent = 80.46,
  transparentStopPercent = 92.37,
  className = "",
}: Props) => {
  const background =
    variant === "transparent-trailing"
      ? `linear-gradient(${angleDeg}deg, var(--color-black) ${blackStopPercent}%, transparent ${transparentStopPercent}%)`
      : `linear-gradient(${angleDeg}deg, transparent ${
          100 - transparentStopPercent
        }%, var(--color-black) ${100 - blackStopPercent}%)`;

  return (
    <div
      className={`pointer-events-none absolute top-0 bottom-0 z-1 ${className}`}
      style={{
        width,
        background,
      }}
    />
  );
};

export default GradationBg;
