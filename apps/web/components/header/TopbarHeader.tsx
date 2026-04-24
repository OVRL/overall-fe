"use client";

import { useBridge } from "@/hooks/bridge/useBridge";
import { useNativeTopBarSync } from "@/hooks/bridge/useNativeTopBarSync";
import Icon from "@/components/ui/Icon";
import type { WithCenter, WithoutCenter } from "./headerTypes";

export function TopbarHeader(props: WithCenter | WithoutCenter) {
  const bridge = useBridge();
  const { isNativeApp } = bridge;
  const {
    className,
    leftAction,
    rightAction,
    rightLabel,
    onRightClick,
    transparent,
    title,
    logo,
  } = props;

  const titleText =
    "title" in props && typeof props.title === "string" ? props.title : null;

  const rightIsLabel = rightLabel != null && onRightClick != null;
  const rightMode = rightIsLabel ? ("label" as const) : ("none" as const);

  /** 우측 아이콘만 있는 경우(브리지 페이로드에 아이콘 미포함)는 웹 탑바 유지 */
  const nativeTopBarUnsupported =
    isNativeApp && rightAction != null && !rightIsLabel;

  const nativeTopBarConfig =
    isNativeApp && !nativeTopBarUnsupported
      ? {
          transparent,
          title: titleText,
          centerMatchLineupLogo: false,
          showLeft: Boolean(leftAction),
          onLeftPress: leftAction?.onClick,
          rightMode,
          rightLabel: rightLabel ?? null,
          onRightPress: rightIsLabel ? onRightClick : undefined,
          rightDisabled: false,
        }
      : null;

  useNativeTopBarSync(nativeTopBarConfig, bridge);

  if (isNativeApp && nativeTopBarConfig != null) {
    return null;
  }

  return (
    <header
      className={`
        sticky top-0 z-50 flex w-full items-center justify-between p-4
        transition-colors duration-200
        ${transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md"}
        ${className ?? ""}
      `}
    >
      <div className="flex flex-1 items-center justify-start">
        {leftAction && (
          <button
            onClick={leftAction.onClick}
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all cursor-pointer"
            aria-label={leftAction.alt}
          >
            <Icon
              src={leftAction.icon}
              alt={leftAction.alt}
              width={24}
              height={24}
              nofill={leftAction.nofill}
            />
          </button>
        )}
      </div>

      <div className="flex flex-auto items-center justify-center shrink-0">
        {logo ? (
          <div className="flex items-center justify-center">{logo}</div>
        ) : title ? (
          <h2 className="text-xl font-bold truncate max-w-50 text-center text-white">
            {title}
          </h2>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {rightLabel != null && onRightClick != null ? (
          <button
            type="button"
            onClick={onRightClick}
            className="flex items-center justify-center px-3 py-3 text-body-m text-white hover:opacity-80 active:scale-95 transition-all cursor-pointer"
            aria-label={rightLabel}
          >
            {rightLabel}
          </button>
        ) : rightAction ? (
          <button
            onClick={rightAction.onClick}
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all cursor-pointer"
            aria-label={rightAction.alt}
          >
            <Icon
              src={rightAction.icon}
              alt={rightAction.alt}
              width={24}
              height={24}
              nofill={rightAction.nofill}
            />
          </button>
        ) : null}
      </div>
    </header>
  );
}
