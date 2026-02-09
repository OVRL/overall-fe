import { ComponentType } from "react";

export interface ModalPropsMap {
  // 예시:
  // ALERT: { message: string };
  // CONFIRM: { title: string; onConfirm: () => void };
  DEFAULT_IMAGE_SELECT: {
    initialImage: string;
    onSave: (image: string) => void;
  };
  ADDRESS_SEARCH: {
    onComplete: (result: { address: string; code: string }) => void;
  };
  EDIT_PROFILE_IMAGE: {
    initialImage: string;
    onSave: (image: string) => void;
  };
}

export type ModalKey = keyof ModalPropsMap;

export type ModalComponentMap = {
  [K in ModalKey]: ComponentType<ModalPropsMap[K]>;
};

export type ModalInstance = {
  [K in ModalKey]: {
    id: string;
    key: K;
    props: ModalPropsMap[K];
  };
}[ModalKey];
