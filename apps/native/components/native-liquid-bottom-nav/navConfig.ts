/**
 * Figma보낸 SVG를 `@/assets/native-bottom-nav/` 에 두고 파일명을 맞춘다.
 */
const ICON_HOME = require("@/assets/native-bottom-nav/nb-home.svg") as number;
const ICON_PLAYER_RECORDS =
  require("@/assets/native-bottom-nav/nb-player-records.svg") as number;
const ICON_MATCH_RECORDS =
  require("@/assets/native-bottom-nav/nb-match-records.svg") as number;
const ICON_PROFILE =
  require("@/assets/native-bottom-nav/nb-profile.svg") as number;

export const ICON_PLUS =
  require("@/assets/native-bottom-nav/nb-plus.svg") as number;

export type NativeBottomNavTabId = "home" | "player" | "match" | "profile";

export type NavItemConfig = {
  id: NativeBottomNavTabId;
  label: string;
  href: string;
  icon: number;
};

export const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", label: "홈", href: "/", icon: ICON_HOME },
  {
    id: "player",
    label: "선수 기록",
    href: "/team-data",
    icon: ICON_PLAYER_RECORDS,
  },
  {
    id: "match",
    label: "경기 기록",
    href: "/match-record",
    icon: ICON_MATCH_RECORDS,
  },
  { id: "profile", label: "내 정보", href: "/profile", icon: ICON_PROFILE },
];
