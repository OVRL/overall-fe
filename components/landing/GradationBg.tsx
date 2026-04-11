type Props = {
  width: number;
  /** 뷰포트 기준: 왼쪽 끝(`left-0`) 또는 오른쪽 끝(`right-0`)에 붙임 */
  align: "left" | "right";
  /**
   * `transparent-trailing`: 왼쪽→오른쪽으로 검정 → 투명 (오른쪽 끝으로 갈수록 배경이 비침)
   * `transparent-leading`: 왼쪽→오른쪽으로 투명 → 검정 (왼쪽 끝으로 갈수록 배경이 비침)
   */
  variant: "transparent-leading" | "transparent-trailing";
  /** 그라데이션 각도(deg). 기본 90(왼쪽→오른쪽) */
  angleDeg?: number;
  /** 검정이 유지되다가 서서히 풀리기 시작하는 지점(%) — trailing 기준 */
  blackStopPercent?: number;
  /** 완전 투명 구간이 시작하는 지점(%) — trailing 기준 */
  transparentStopPercent?: number;
};

const GradationBg = ({
  width,
  align,
  variant,
  angleDeg = 90,
  blackStopPercent = 80.46,
  transparentStopPercent = 92.37,
}: Props) => {
  const background =
    variant === "transparent-trailing"
      ? `linear-gradient(${angleDeg}deg, var(--color-black) ${blackStopPercent}%, transparent ${transparentStopPercent}%)`
      : `linear-gradient(${angleDeg}deg, transparent ${
          100 - transparentStopPercent
        }%, var(--color-black) ${100 - blackStopPercent}%)`;

  return (
    <div
      className={`pointer-events-none absolute top-0 bottom-0 z-1 ${
        align === "right" ? "left-95" : "left-58"
      }`}
      style={{
        width,
        background,
      }}
    />
  );
};

export default GradationBg;
