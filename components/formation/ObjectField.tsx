import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

// 원본 SVG를 기준으로 표준 필드 크기 정의
const FIELD_WIDTH = 1280;
const FIELD_HEIGHT = 785;

export interface FieldCrop {
  /** 시작점 x 좌표 (0.0 = 왼쪽 끝 ~ 1.0 = 오른쪽 끝) */
  x: number;
  /** 시작점 y 좌표 (0.0 = 위쪽 끝 ~ 1.0 = 아래쪽 끝) */
  y: number;
  /** 너비 비율 (0.0 ~ 1.0) */
  width: number;
  /** 높이 비율 (0.0 ~ 1.0) */
  height: number;
}

interface ObjectFieldProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  /**
   * 미리 정의된 뷰 타입
   * - full: 전체 필드
   * - half: 하단 절반 (약 50%)
   * - narrow: 중앙 세로 영역 (약 52% 너비)
   *
   * 'crop'이 제공되면 'type'은 무시됩니다.
   */
  type?: "full" | "half" | "narrow";

  /**
   * 커스텀 크롭 정의 (0.0 ~ 1.0).
   * 'type'을 덮어씁니다.
   * @example { x: 0, y: 0, width: 1, height: 0.5 } // 상단 절반
   */
  crop?: FieldCrop;

  /**
   * 뷰에 맞춰 컨테이너의 가로세로 비율(aspect-ratio)을 자동으로 조절합니다.
   * 기본값은 true입니다. 이를 비활성화하면 CSS로 처리하지 않을 경우 왜곡이 발생할 수 있습니다.
   */
  autoAspect?: boolean;

  /**
   * 접근성 라벨. 기본값은 "Soccer Field"입니다.
   */
  "aria-label"?: string;

  /**
   * 이미지가 컨테이너에 맞춰 크기가 조정되는 방식입니다.
   * - contain: 가로세로 비율을 유지하며, 배경이 보일 수 있음 (SVG 기본값: xMidYMid meet)
   * - cover: 가로세로 비율을 유지하며, 영역에 맞게 자름 (SVG 기본값: xMidYMid slice)
   * - fill: 영역에 꽉 채우며, 왜곡될 수 있음 (SVG 기본값: none)
   * @default "contain"
   */
  objectFit?: "contain" | "cover" | "fill";
}

/**
 * ObjectField (축구 경기장 시각화)
 *
 * 동적 크롭, CSS 변수를 통한 테마 설정, 접근성을 지원합니다.
 *
 * CSS 변수를 통해 커스텀 가능:
 * - --field-bg: 배경색 (기본: #1A1A1A)
 * - --field-grass-primary: 잔디 메인 색상 (기본: #204527)
 * - --field-grass-secondary: 잔디 패턴(가로 줄무늬) 색상 (기본: #24532D)
 * - --field-line: 라인 색상 (기본: #A6A5A5)
 * - --field-accent: 센터 스팟 및 포인트 색상 (기본: #D9D9D9)
 * - --field-base: 필드 하단 입체면 색상 (기본: #092C0F)
 */
const ObjectField = ({
  className,
  style,
  type = "full",
  crop,
  autoAspect = true,
  "aria-label": ariaLabel = "Soccer Field",
  objectFit = "contain",
  ...props
}: ObjectFieldProps) => {
  // crop 또는 type을 기반으로 ViewBox 계산
  const { viewBoxStr, aspectRatio } = useMemo(() => {
    let x = 0,
      y = 0,
      w = FIELD_WIDTH,
      h = FIELD_HEIGHT;

    if (crop) {
      x = crop.x * FIELD_WIDTH;
      y = crop.y * FIELD_HEIGHT;
      w = crop.width * FIELD_WIDTH;
      h = crop.height * FIELD_HEIGHT;
    } else {
      switch (type) {
        case "half": // 하단 절반
          // y는 중앙 부근에서 시작 -> 392.5
          y = 392.5;
          h = 392.5;
          break;
        case "narrow": // 중앙 세로 영역 (52% 너비)
          // 1280 * 0.52 ~= 666
          // x = (1280 - 666) / 2 = 307
          x = 307;
          w = 666;
          break;
        case "full":
        default:
          break;
      }
    }

    return {
      viewBoxStr: `${x} ${y} ${w} ${h}`,
      aspectRatio: w / h,
    };
  }, [type, crop]);

  // objectFit을 SVG preserveAspectRatio로 매핑
  const preserveAspectRatio = useMemo(() => {
    switch (objectFit) {
      case "cover":
        return "xMidYMid slice";
      case "fill":
        return "none";
      case "contain":
      default:
        return "xMidYMid meet";
    }
  }, [objectFit]);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        ...style,
        ...(autoAspect ? { aspectRatio: `${aspectRatio}` } : {}),
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={viewBoxStr}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block" // block은 추가적인 라인 높이 공간을 제거합니다.
        preserveAspectRatio={preserveAspectRatio}
        aria-hidden="true" // 스크린 리더로부터 상세 SVG 정보를 숨깁니다 (컨테이너에 라벨이 있음)
        {...props}
      >
        {/* 배경 및 마스크 */}
        <rect
          width="1280"
          height="785"
          fill="var(--field-bg, #1A1A1A)"
          className="hidden"
        />
        <path
          d="M11 732L1271.12 732L1261.12 761H21L11 732Z"
          fill="var(--field-base, #092C0F)"
        />
        <mask
          id="mask0_204_1015"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="11"
          y="0"
          width="1260"
          height="734"
        >
          <path d="M120.127 0H1160.96L1271 734H11L120.127 0Z" fill="white" />
        </mask>

        <g mask="url(#mask0_204_1015)">
          {/* 필드 메인 녹색 */}
          <path
            d="M97.7177 8H1182.33L1297 734H-16L97.7177 8Z"
            fill="var(--field-grass-primary, #204527)"
          />

          {/* 가로 구역 (보조 녹색) */}
          <rect
            x="1"
            y="460"
            width="1270"
            height="147"
            fill="var(--field-grass-secondary, #24532D)"
          />
          <rect
            x="1"
            y="235"
            width="1270"
            height="122"
            fill="var(--field-grass-secondary, #24532D)"
          />
          <rect
            x="1"
            width="1270"
            height="132"
            fill="var(--field-grass-secondary, #24532D)"
          />

          {/* 필드 라인 */}
          <g stroke="var(--field-line, #A6A5A5)" strokeWidth="3.81629">
            {/* Center Circle Arc */}
            <path d="M775 532C775 488.922 714.782 454 640.5 454C566.218 454 506 488.922 506 532" />

            {/* Center Box area */}
            <path d="M926.01 530.908L959.718 718.092H321.277L354.53 530.908H926.01Z" />

            {/* Outer Box Lines */}
            <path d="M1142.7 -56.0918L1248.81 718.092H32.1846L137.416 -56.0918H1142.7Z" />

            {/* Penalty Box Arc? */}
            <path d="M748.318 642.908L755.89 718.092H525.106L532.516 642.908H748.318Z" />

            {/* Top Circle/Arc */}
            <path d="M641 -96.0918C718.741 -96.0918 781.092 -44.4515 781.092 18.5C781.092 81.4515 718.741 133.092 641 133.092C563.259 133.092 500.908 81.4515 500.908 18.5C500.908 -44.4515 563.259 -96.0918 641 -96.0918Z" />

            {/* Half Line */}
            <line x1="126" y1="31.0919" x2="1154" y2="31.092" />
          </g>

          {/* 볼 또는 센터 스팟 */}
          <ellipse
            cx="640"
            cy="588.5"
            rx="8"
            ry="8.5"
            fill="var(--field-accent, #D9D9D9)"
          />
        </g>
      </svg>
    </div>
  );
};

export default ObjectField;
