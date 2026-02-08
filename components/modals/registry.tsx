import { ModalComponentMap } from "./types";
import DefaultImageModal from "./DefaultImageModal";

export const MODAL_REGISTRY: ModalComponentMap = {
  DEFAULT_IMAGE_SELECT: DefaultImageModal,
} as ModalComponentMap;
