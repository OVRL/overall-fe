"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface AdBoardProps {
  className?: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
}

/**
 * 광고 배너 컴포넌트 (BM)
 * SVG 기반의 3D 형태 보드
 */
const AdBoard = ({
  className,
  imageUrl,
  linkUrl,
  altText = "Advertisement",
}: AdBoardProps) => {
  const maskId = useId();

  const Content = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 124 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      {/* Left Side Depth */}
      <path d="M6 5L0 38H6V5Z" fill="#D6D6D5" />

      {/* Right Side Depth */}
      <path d="M118 5L124 38H118V5Z" fill="#D6D6D5" />

      {/* Definitions for Masking */}
      <defs>
        <clipPath id={maskId}>
          <path d="M6 6C6 2.68629 8.68629 0 12 0H112C115.314 0 118 2.68629 118 6V38H6V6Z" />
        </clipPath>
      </defs>

      {/* Main Face Background */}
      <path
        d="M6 6C6 2.68629 8.68629 0 12 0H112C115.314 0 118 2.68629 118 6V38H6V6Z"
        fill="#F1F1F1"
      />

      {/* Ad Image Overlay */}
      {imageUrl && (
        <image
          href={imageUrl}
          x="6"
          y="0"
          width="112"
          height="38"
          clipPath={`url(#${maskId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
    </svg>
  );

  if (linkUrl) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block hover:scale-105 transition-transform duration-200 cursor-pointer",
          className,
        )}
        aria-label={altText}
      >
        {Content}
      </a>
    );
  }

  return <div className={cn("block", className)}>{Content}</div>;
};

export default AdBoard;
