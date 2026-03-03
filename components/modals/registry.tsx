import dynamic from "next/dynamic";
import { ModalComponentMap } from "./types";
import ModalLoadingFallback from "./ModalLoadingFallback";

const DefaultImageModal = dynamic(() => import("./DefaultImageModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const AddressSearchModal = dynamic(() => import("./AddressSearchModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const DetailAddressSearchModal = dynamic(
  () => import("./DetailAddressSearchModal/DetailAddressSearchModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const EditProfileImageModal = dynamic(() => import("./EditProfileImageModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const PlayerSearchModal = dynamic(
  () => import("./PlayerSearchModal/PlayerSearchModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const RegisterGameModal = dynamic(() => import("./RegisterGameModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});

export const MODAL_REGISTRY: ModalComponentMap = {
  DEFAULT_IMAGE_SELECT: DefaultImageModal,
  ADDRESS_SEARCH: AddressSearchModal,
  DETAIL_ADDRESS_SEARCH: DetailAddressSearchModal,
  EDIT_PROFILE_IMAGE: EditProfileImageModal,
  PLAYER_SEARCH: PlayerSearchModal,
  REGISTER_GAME: RegisterGameModal,
} as ModalComponentMap;
