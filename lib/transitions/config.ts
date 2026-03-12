import { drill } from "@ssgoi/react/view-transitions";

export type PlatformType = "APP" | "MOBILE_WEB" | "PC_WEB";

export const getTransitionConfig = (platform: PlatformType) => {
  if (platform === "APP") {
    return {
      defaultTransition: drill({ direction: "enter" }),
      transitions: [],
    };
  }

  // PC_WEB의 경우 (애니메이션 없이, 혹은 다른 지정)
  return {
    transitions: [],
  };
};
