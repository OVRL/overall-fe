import { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { StaticImageData } from "next/image";

interface ActionButton {
  icon: StaticImageData;
  onClick: () => void;
  alt: string;
  nofill?: boolean;
}

type BaseHeaderProps = {
  className?: string;
  transparent?: boolean;
};

type LeftActionProp = {
  leftAction?: ActionButton;
};

type RightActionProp = {
  rightAction?: ActionButton;
};

/** 오른쪽에 텍스트 버튼을 쓸 때 (rightAction 대신 사용) */
type RightLabelProp = {
  rightLabel?: string;
  onRightClick?: () => void;
};

type WithCenter = BaseHeaderProps & {
  title?: string;
  logo?: ReactNode;
} & (
    | { title: string; logo?: ReactNode }
    | { title?: string; logo: ReactNode }
  ) &
  LeftActionProp &
  RightActionProp &
  RightLabelProp;

type WithoutCenter = BaseHeaderProps & {
  title?: never;
  logo?: never;
} & {
  leftAction?: ActionButton;
  rightAction?: ActionButton;
} & RightLabelProp;

export type HeaderProps = WithCenter | WithoutCenter;

export const Header = (props: HeaderProps) => {
  const {
    className,
    leftAction,
    rightAction,
    rightLabel,
    onRightClick,
    transparent,
  } = props;

  const title = props.title;
  const logo = props.logo;

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
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all"
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
          <h1 className="text-xl font-bold truncate max-w-50 text-center text-white">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {rightLabel != null && onRightClick != null ? (
          <button
            type="button"
            onClick={onRightClick}
            className="flex items-center justify-center px-3 py-3 text-body-m text-white hover:opacity-80 active:scale-95 transition-all"
            aria-label={rightLabel}
          >
            {rightLabel}
          </button>
        ) : rightAction ? (
          <button
            onClick={rightAction.onClick}
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all"
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
};

export default Header;
