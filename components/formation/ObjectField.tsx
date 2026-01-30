import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

// Define standard field dimensions based on original SVG
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
   * Pre-defined view types
   * - full: Entire field
   * - half: Bottom half (approx 50%)
   * - narrow: Center vertical strip (approx 52% width)
   * 
   * If 'crop' is provided, 'type' is ignored.
   */
  type?: 'full' | 'half' | 'narrow';
  
  /**
   * Custom crop definition (0.0 ~ 1.0).
   * Overrides 'type'.
   * @example { x: 0, y: 0, width: 1, height: 0.5 } // Top half
   */
  crop?: FieldCrop;

  /**
   * Automatically adjust aspect-ratio of the container to match the view.
   * Defaults to true. Disabling this might lead to distortion if not handled by CSS.
   */
  autoAspect?: boolean;

  /**
   * Accessibility label. Defaults to "Soccer Field".
   */
  "aria-label"?: string;

  /**
   * How the image should resize to fit its container.
   * - contain: Preserve aspect ratio, may show background (SVG default: xMidYMid meet)
   * - cover: Preserve aspect ratio, clip to fit (SVG default: xMidYMid slice)
   * - fill: Stretch to fit, may distort (SVG default: none)
   * @default "contain"
   */
  objectFit?: 'contain' | 'cover' | 'fill';
}

/**
 * ObjectField (Soccer Field Visualization)
 * 
 * Supports dynamic cropping, theming via CSS variables, and accessibility.
 * 
 * Customizable via CSS Variables:
 * - --field-bg: 배경색 (기본: #1A1A1A)
 * - --field-grass-primary: 잔디 메인 색상 (기본: #204527)
 * - --field-grass-secondary: 잔디 패턴(가로 줄무늬) 색상 (기본: #24532D)
 * - --field-line: 라인 색상 (기본: #A6A5A5)
 * - --field-accent: 센터 스팟 및 포인트 색상 (기본: #D9D9D9)
 */
const ObjectField = ({ 
  className, 
  style, 
  type = 'full', 
  crop,
  autoAspect = true,
  "aria-label": ariaLabel = "Soccer Field",
  objectFit = "contain",
  ...props 
}: ObjectFieldProps) => {

  // Calculate ViewBox based on crop or type
  const { viewBoxStr, aspectRatio } = useMemo(() => {
    let x = 0, y = 0, w = FIELD_WIDTH, h = FIELD_HEIGHT;

    if (crop) {
      x = crop.x * FIELD_WIDTH;
      y = crop.y * FIELD_HEIGHT;
      w = crop.width * FIELD_WIDTH;
      h = crop.height * FIELD_HEIGHT;
    } else {
      switch (type) {
        case 'half': // Bottom half
          // y starts at center (approx) -> 392.5
          y = 392.5; 
          h = 392.5;
          break;
        case 'narrow': // Center vertical strip (52% width)
          // 1280 * 0.52 ~= 666
          // x = (1280 - 666) / 2 = 307
          x = 307;
          w = 666;
          break;
        case 'full':
        default:
          break;
      }
    }

    return {
      viewBoxStr: `${x} ${y} ${w} ${h}`,
      aspectRatio: w / h
    };
  }, [type, crop]);

  // Map objectFit to SVG preserveAspectRatio
  const preserveAspectRatio = useMemo(() => {
    switch (objectFit) {
      case 'cover': return "xMidYMid slice";
      case 'fill': return "none";
      case 'contain':
      default: return "xMidYMid meet";
    }
  }, [objectFit]);

  return (
    <div 
      className={cn("relative w-full", className)}
      style={{
        ...style,
        ...(autoAspect ? { aspectRatio: `${aspectRatio}` } : {})
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={viewBoxStr}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block" // block removes extra line-height space
        preserveAspectRatio={preserveAspectRatio}
        aria-hidden="true" // Hide raw SVG details from screen readers, container has label
        {...props}
      >
        {/* Background & Mask */}
        <rect width="1280" height="785" fill="var(--field-bg, #1A1A1A)" className="hidden" />
        <path d="M11 734H1271.12L1261.12 759.596H21L11 734Z" fill="#092C0F" />
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
          {/* Main Field Green */}
          <path d="M97.7177 8H1182.33L1297 734H-16L97.7177 8Z" fill="var(--field-grass-primary, #204527)" />
          
          {/* Horizontal Zones (Secondary Green) */}
          <rect x="1" y="460" width="1270" height="147" fill="var(--field-grass-secondary, #24532D)" />
          <rect x="1" y="235" width="1270" height="122" fill="var(--field-grass-secondary, #24532D)" />
          <rect x="1" width="1270" height="132" fill="var(--field-grass-secondary, #24532D)" />
          
          {/* Field Lines */}
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
          
          {/* Ball or Center Spot */}
          <ellipse cx="640" cy="588.5" rx="8" ry="8.5" fill="var(--field-accent, #D9D9D9)" />
        </g>
      </svg>
    </div>
  );
};

export default ObjectField;
