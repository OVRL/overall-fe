"use client";

export type {
  MenuItem,
  ActionButton,
  WithCenter,
  WithoutCenter,
  HeaderProps,
} from "./header/headerTypes";

import type { HeaderProps } from "./header/headerTypes";
import { GlobalHeader } from "./header/GlobalHeader";
import { TopbarHeader } from "./header/TopbarHeader";

export const Header = (props: HeaderProps) => {
  if (props.variant === "global") {
    return <GlobalHeader {...props} />;
  }
  return <TopbarHeader {...props} />;
};

export default Header;
