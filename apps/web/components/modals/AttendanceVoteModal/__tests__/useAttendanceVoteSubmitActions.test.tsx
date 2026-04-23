import { render, screen, fireEvent } from "@testing-library/react";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment } from "relay-test-utils";
import * as RelayRuntime from "relay-runtime";
import "@testing-library/jest-dom";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import type { MatchAttendanceRow } from "../findMyCommittedMatchAttendanceRow";
import { useAttendanceVoteSubmitActions } from "../useAttendanceVoteSubmitActions";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

const mockExecuteCreate = jest.fn();
const mockExecuteUpdate = jest.fn();

jest.mock("../useCreateMatchAttendanceMutation", () => ({
  useCreateMatchAttendanceMutation: () => ({
    executeMutation: (...args: unknown[]) => mockExecuteCreate(...args),
    isInFlight: false,
  }),
}));

jest.mock("../useUpdateMatchAttendanceMutation", () => ({
  useUpdateMatchAttendanceMutation: () => ({
    executeMutation: (...args: unknown[]) => mockExecuteUpdate(...args),
    isInFlight: false,
  }),
}));

jest.mock("@/lib/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const myCommittedRow = {
  id: 100,
  userId: 42,
  attendanceStatus: "ATTEND" as const,
  user: null,
} as MatchAttendanceRow;

function SubmitHarness({
  myCommittedRow: row,
  wantsRevote,
  onRevoteComplete,
}: {
  myCommittedRow: MatchAttendanceRow | null;
  wantsRevote: boolean;
  onRevoteComplete: () => void;
}) {
  const match = { id: 99 } as MatchNode;
  const { handleAttend } = useAttendanceVoteSubmitActions(match, 10, 42, {
    myCommittedRow: row,
    wantsRevote,
    onRevoteComplete,
  });
  return (
    <button type="button" onClick={handleAttend}>
      참석 제출
    </button>
  );
}

describe("useAttendanceVoteSubmitActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(RelayRuntime, "fetchQuery").mockReturnValue({
      subscribe(observer: { next: (v: unknown) => void }) {
        observer.next({});
        return { unsubscribe: () => {} };
      },
    } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderWithRelay(ui: React.ReactElement) {
    return render(
      <RelayEnvironmentProvider environment={createMockEnvironment()}>
        {ui}
      </RelayEnvironmentProvider>,
    );
  }

  it("확정 투표 행이 없으면 참석 클릭 시 createMatchAttendance를 호출한다", () => {
    mockExecuteCreate.mockImplementation((cfg: { onCompleted?: (r: unknown) => void }) => {
      cfg.onCompleted?.({
        createMatchAttendance: {
          id: 1,
          matchId: 99,
          teamId: 10,
          userId: 42,
          attendanceStatus: "ATTEND",
        },
      });
    });

    renderWithRelay(
      <SubmitHarness
        myCommittedRow={null}
        wantsRevote={false}
        onRevoteComplete={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "참석 제출" }));

    expect(mockExecuteCreate).toHaveBeenCalledTimes(1);
    expect(mockExecuteCreate.mock.calls[0][0].variables.input).toMatchObject({
      matchId: 99,
      teamId: 10,
      attendanceStatus: "ATTEND",
    });
    expect(mockExecuteUpdate).not.toHaveBeenCalled();
  });

  it("이미 투표했고 재투표 모드가 아니면 뮤테이션을 호출하지 않는다", () => {
    renderWithRelay(
      <SubmitHarness
        myCommittedRow={myCommittedRow}
        wantsRevote={false}
        onRevoteComplete={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "참석 제출" }));

    expect(mockExecuteCreate).not.toHaveBeenCalled();
    expect(mockExecuteUpdate).not.toHaveBeenCalled();
  });

  it("재투표 모드이면 참석 클릭 시 updateMatchAttendance를 호출하고 완료 시 onRevoteComplete를 호출한다", () => {
    const onRevoteComplete = jest.fn();
    mockExecuteUpdate.mockImplementation((cfg: { onCompleted?: (r: unknown) => void }) => {
      cfg.onCompleted?.({
        updateMatchAttendance: {
          id: 1,
          matchId: 99,
          teamId: 10,
          userId: 42,
          attendanceStatus: "ATTEND",
        },
      });
    });

    renderWithRelay(
      <SubmitHarness
        myCommittedRow={myCommittedRow}
        wantsRevote
        onRevoteComplete={onRevoteComplete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "참석 제출" }));

    expect(mockExecuteUpdate).toHaveBeenCalledTimes(1);
    expect(mockExecuteUpdate.mock.calls[0][0].variables.input).toMatchObject({
      id: 100,
      teamId: 10,
      attendanceStatus: "ATTEND",
    });
    expect(onRevoteComplete).toHaveBeenCalledTimes(1);
    expect(mockExecuteCreate).not.toHaveBeenCalled();
  });
});
