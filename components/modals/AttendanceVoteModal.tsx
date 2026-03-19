"use client";

import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useUserId } from "@/hooks/useUserId";
import useModal from "@/hooks/useModal";
import ModalLayout from "./ModalLayout";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import chevronRight from "@/public/icons/chevron_right.svg";
import { useAttendanceVoteMatch } from "./AttendanceVoteModal/useAttendanceVoteMatch";
import { useAttendanceVoteActions } from "./AttendanceVoteModal/useAttendanceVoteActions";
import { getMatchDisplay } from "./AttendanceVoteModal/getMatchDisplay";
import {
  MatchOpponentSection,
  MatchScheduleSection,
  MatchVenueSection,
  MatchUniformSection,
  MatchMemoSection,
} from "./AttendanceVoteModal/sections";

const MODAL_TITLE = "참석 투표하기";
const WRAPPER_CLASS_BASE = "md:w-110 gap-y-3 h-145.5";
const WRAPPER_CLASS_SCROLL =
  "md:w-110 gap-y-3 h-145.5 min-h-0 flex flex-col max-h-[90vh]";

/** 팀이 선택되지 않았을 때 표시. SRP: "팀 없음" 빈 상태 UI만 담당 */
function AttendanceVoteModalNoTeam() {
  const { hideModal } = useModal();
  return (
    <ModalLayout title={MODAL_TITLE} wrapperClassName={WRAPPER_CLASS_BASE}>
      <div className="flex flex-col gap-3 py-4">
        <p className="text-Label-Tertiary text-sm">
          선택된 팀이 없습니다. 팀을 선택한 뒤 다시 시도해 주세요.
        </p>
        <Button variant="primary" size="m" onClick={hideModal}>
          닫기
        </Button>
      </div>
    </ModalLayout>
  );
}

function AttendanceVoteModalNoMatch() {
  const { hideModal } = useModal();
  return (
    <ModalLayout title={MODAL_TITLE} wrapperClassName={WRAPPER_CLASS_BASE}>
      <div className="flex flex-col gap-3 py-4">
        <p className="text-Label-Tertiary text-sm">다가오는 경기가 없습니다.</p>
        <Button variant="primary" size="m" onClick={hideModal}>
          닫기
        </Button>
      </div>
    </ModalLayout>
  );
}

function AttendanceVoteModalWithData({
  createdTeamId,
}: {
  createdTeamId: number;
}) {
  const { hideModal } = useModal();
  const userId = useUserId();
  const { match } = useAttendanceVoteMatch(createdTeamId);
  const { handleCopyAddress, handleAttend, isInFlight } =
    useAttendanceVoteActions(match, createdTeamId, userId, hideModal);

  if (match == null) {
    return <AttendanceVoteModalNoMatch />;
  }

  const display = getMatchDisplay(match);

  return (
    <ModalLayout title={MODAL_TITLE} wrapperClassName={WRAPPER_CLASS_SCROLL}>
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        <MatchOpponentSection
          display={{
            isInternal: display.isInternal,
            opponentLabel: display.opponentLabel,
            emblemSrc: display.emblemSrc,
            showRecord: display.showRecord,
          }}
        />
        <MatchScheduleSection formattedDate={display.formattedDate} />
        <MatchVenueSection
          venue={display.venue}
          hasValidCoordinates={display.hasValidCoordinates}
          onCopyAddress={handleCopyAddress}
        />
        <MatchUniformSection match={match} />
        <MatchMemoSection description={display.description} />
      </div>
      <div className="flex flex-col shrink-0 pt-2">
        <div className="flex gap-3 h-14 mb-3">
          <Button
            variant="ghost"
            size="xl"
            className="flex-1"
            onClick={hideModal}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            size="xl"
            className="flex-1 bg-red-500 text-Label-Primary"
            onClick={handleAttend}
            disabled={isInFlight}
          >
            {isInFlight ? "처리 중..." : "참석"}
          </Button>
        </div>
        <div className="flex justify-end">
          <span className="text-[#F7F8F8] text-sm font-semibold flex items-center">
            10명 참석, 6명 불참 <Icon src={chevronRight} />
          </span>
        </div>
      </div>
    </ModalLayout>
  );
}

const AttendanceVoteModal = () => {
  const { selectedTeamIdNum } = useSelectedTeamId();
  if (selectedTeamIdNum == null) return <AttendanceVoteModalNoTeam />;
  return <AttendanceVoteModalWithData createdTeamId={selectedTeamIdNum} />;
};

export default AttendanceVoteModal;
