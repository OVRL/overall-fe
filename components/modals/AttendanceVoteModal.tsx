"use client";

import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useUserId } from "@/hooks/useUserId";
import useModal from "@/hooks/useModal";
import ModalLayout from "./ModalLayout";
import Button from "../ui/Button";
import { useAttendanceVoteMatch } from "./AttendanceVoteModal/useAttendanceVoteMatch";
import { useAttendanceVoteActions } from "./AttendanceVoteModal/useAttendanceVoteActions";
import { AttendanceVoteChoiceButtons } from "./AttendanceVoteModal/AttendanceVoteChoiceButtons";
import { getMatchDisplay } from "./AttendanceVoteModal/getMatchDisplay";
import { MatchAttendanceSummarySlot } from "./AttendanceVoteModal/MatchAttendanceSummarySlot";
import { isVoteDeadlinePassed } from "@/utils/match/isVoteDeadlinePassed";
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
  const {
    handleCopyAddress,
    handleAttend,
    handleAbsent,
    isInFlight,
    pendingVoteChoice,
  } = useAttendanceVoteActions(match, createdTeamId, userId, hideModal);

  if (match == null) {
    return <AttendanceVoteModalNoMatch />;
  }

  const display = getMatchDisplay(match);
  const voteClosed = isVoteDeadlinePassed(match.voteDeadline);

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
        <AttendanceVoteChoiceButtons
          voteClosed={voteClosed}
          isInFlight={isInFlight}
          pendingVoteChoice={pendingVoteChoice}
          onAbsent={handleAbsent}
          onAttend={handleAttend}
        />
        <div className="flex justify-end">
          <MatchAttendanceSummarySlot
            matchGraphqlId={match.id}
            teamId={createdTeamId}
            currentUserId={userId}
          />
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
