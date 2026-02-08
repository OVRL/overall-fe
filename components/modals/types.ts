import { ComponentType } from "react";

export interface ModalPropsMap {
  // 예시:
  // ALERT: { message: string };
  // CONFIRM: { title: string; onConfirm: () => void };
  DEFAULT_IMAGE_SELECT: undefined;
}

export type ModalKey = keyof ModalPropsMap;

export type ModalComponentMap = {
  [K in ModalKey]: ComponentType<ModalPropsMap[K]>;
};
