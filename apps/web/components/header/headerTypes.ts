import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { TEAM_MANAGEMENT_MENU_HREF } from "@/lib/navigation/filterMenuItemsByTeamRole";

export interface MenuItem {
  label: string;
  href: string;
}

export const defaultMenuItems: MenuItem[] = [
  { label: "팀 관리", href: TEAM_MANAGEMENT_MENU_HREF },
  { label: "선수 기록", href: "/team-data" },
  { label: "경기 기록", href: "/match-record" },
];

export interface ActionButton {
  icon: StaticImageData;
  onClick: () => void;
  alt: string;
  nofill?: boolean;
}

type BaseHeaderProps = {
  className?: string;
  transparent?: boolean;
};

export type GlobalHeaderProps = BaseHeaderProps & {
  variant: "global";
  menuItems?: MenuItem[];
  showHamburger?: boolean;
  /**
   * 인앱 WebView: `(main)/layout`에서 `headers().get("user-agent")`로 `Overall_RN` 여부를 판별해 넘긴다.
   * true이면 로고·웹 행 UI는 **HTML에 포함하지 않고**, Relay·모바일 드롭다운만 유지한다(네이티브 상단은 RN).
   * WebView 식별용 **전용 쿠키는 쓰지 않는다**(모노레포 표준: UA + 브리지).
   */
  hideWebGlobalChrome?: boolean;
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

export type WithCenter = BaseHeaderProps & {
  variant?: "topbar";
  title?: string;
  logo?: ReactNode;
} & (
    | { title: string; logo?: ReactNode }
    | { title?: string; logo: ReactNode }
  ) &
  LeftActionProp &
  RightActionProp &
  RightLabelProp;

export type WithoutCenter = BaseHeaderProps & {
  variant?: "topbar";
  title?: never;
  logo?: never;
} & {
  leftAction?: ActionButton;
  rightAction?: ActionButton;
} & RightLabelProp;

export type HeaderProps = GlobalHeaderProps | WithCenter | WithoutCenter;
