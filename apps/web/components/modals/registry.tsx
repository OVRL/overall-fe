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
const GlobalConfirmModal = dynamic(() => import("./GlobalConfirmModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const GlobalAlertModal = dynamic(() => import("./GlobalAlertModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const EditGameModal = dynamic(() => import("./EditGameModal/EditGameModal"), {
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
const EditEmblemImageModal = dynamic(() => import("./EditEmblemImageModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const MatchAttendancePlayerModal = dynamic(
  () => import("./MatchAttendancePlayerModal/MatchAttendancePlayerModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const TeamSearchModal = dynamic(
  () => import("./TeamSearchModal/TeamSearchModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const RegisterGameModal = dynamic(() => import("./RegisterGameModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const TeamDataPlayerDetailModal = dynamic(
  () => import("./team-data/PlayerDetailModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const TeamDataStatRankingModal = dynamic(
  () => import("./team-data/StatRankingModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const AttendanceVoteModal = dynamic(() => import("./AttendanceVoteModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const TeamCreatedModal = dynamic(() => import("./TeamCreatedModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const FormationVenueMapModal = dynamic(
  () => import("./FormationVenueMapModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const PlayerSearchModal = dynamic(
  () => import("./team-management/PlayerSearchModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const FormationChangeLineupModal = dynamic(
  () => import("./FormationChangeLineupModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const FormationMobileTeamDraftModal = dynamic(
  () => import("./FormationMobileTeamDraftModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const FormationCheckLineupModal = dynamic(
  () => import("./FormationCheckLineupModal/FormationCheckLineupModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const EditProfileModal = dynamic(
  () => import("./EditProfileModal/EditProfileModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const ProfileSubPositionPickerModal = dynamic(
  () => import("./EditProfileModal/ProfileSubPositionPickerModal"),
  {
    ssr: false,
    loading: () => <ModalLoadingFallback />,
  },
);
const MomVoteModal = dynamic(() => import("./MomVoteModal/MomVoteModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});
const TeamInfoModal = dynamic(() => import("./TeamInfoModal/TeamInfoModal"), {
  ssr: false,
  loading: () => <ModalLoadingFallback />,
});

export const MODAL_REGISTRY: ModalComponentMap = {
  DEFAULT_IMAGE_SELECT: DefaultImageModal,
  ADDRESS_SEARCH: AddressSearchModal,
  DETAIL_ADDRESS_SEARCH: DetailAddressSearchModal,
  EDIT_PROFILE_IMAGE: EditProfileImageModal,
  EDIT_EMBLEM_IMAGE: EditEmblemImageModal,
  FORMATION_MATCH_ATTENDANCE_PLAYER: MatchAttendancePlayerModal,
  TEAM_SEARCH: TeamSearchModal,
  REGISTER_GAME: RegisterGameModal,
  TEAM_DATA_PLAYER_DETAIL: TeamDataPlayerDetailModal,
  TEAM_DATA_STAT_RANKING: TeamDataStatRankingModal,
  ATTENDANCE_VOTE: AttendanceVoteModal,
  MOM_VOTE: MomVoteModal,
  TEAM_CREATED: TeamCreatedModal,
  FORMATION_VENUE_MAP: FormationVenueMapModal,
  ALERT: GlobalAlertModal,
  CONFIRM: GlobalConfirmModal,
  EDIT_GAME: EditGameModal,
  PLAYER_SEARCH: PlayerSearchModal,
  FORMATION_CHANGE_LINEUP: FormationChangeLineupModal,
  FORMATION_MOBILE_TEAM_DRAFT: FormationMobileTeamDraftModal,
  FORMATION_CHECK_LINEUP: FormationCheckLineupModal,
  EDIT_PROFILE: EditProfileModal,
  PROFILE_EDIT_SUB_POSITIONS: ProfileSubPositionPickerModal,
  TEAM_INFO: TeamInfoModal,
} as ModalComponentMap;
