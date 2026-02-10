import dynamic from "next/dynamic";
import { ModalComponentMap } from "./types";

const DefaultImageModal = dynamic(() => import("./DefaultImageModal"), {
  ssr: false,
});
const AddressSearchModal = dynamic(() => import("./AddressSearchModal"), {
  ssr: false,
});
const EditProfileImageModal = dynamic(
  () => import("./EditProfileImageModal/EditProfileImageModal"),
  {
    ssr: false,
  },
);

export const MODAL_REGISTRY: ModalComponentMap = {
  DEFAULT_IMAGE_SELECT: DefaultImageModal,
  ADDRESS_SEARCH: AddressSearchModal,
  EDIT_PROFILE_IMAGE: EditProfileImageModal,
} as ModalComponentMap;
