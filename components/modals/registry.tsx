import dynamic from "next/dynamic";
import { ModalComponentMap } from "./types";

const DefaultImageModal = dynamic(() => import("./DefaultImageModal"), {
  ssr: false,
});
const AddressSearchModal = dynamic(() => import("./AddressSearchModal"), {
  ssr: false,
});
const EditProfileImageModal = dynamic(() => import("./EditProfileImageModal"), {
  ssr: false,
});
const PlayerSearchModal = dynamic(
  () => import("./PlayerSearchModal/PlayerSearchModal"),
  {
    ssr: false,
  },
);
const RegisterGameModal = dynamic(() => import("./RegisterGameModal"), {
  ssr: false,
});

export const MODAL_REGISTRY: ModalComponentMap = {
  DEFAULT_IMAGE_SELECT: DefaultImageModal,
  ADDRESS_SEARCH: AddressSearchModal,
  EDIT_PROFILE_IMAGE: EditProfileImageModal,
  PLAYER_SEARCH: PlayerSearchModal,
  REGISTER_GAME: RegisterGameModal,
} as ModalComponentMap;
