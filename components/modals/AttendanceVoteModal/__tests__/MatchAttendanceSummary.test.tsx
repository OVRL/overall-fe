import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import {
  createMockEnvironment,
  MockPayloadGenerator,
} from "relay-test-utils";
import type { OperationDescriptor } from "relay-runtime";
import "@testing-library/jest-dom";
import { MatchAttendanceSummarySlot } from "../MatchAttendanceSummarySlot";

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn(() => false),
}));

const mockUseMediaQuery = jest.requireMock("@/hooks/useMediaQuery")
  .useMediaQuery as jest.Mock;

function renderSummary(props: { matchGraphqlId?: string; teamId?: number }) {
  const environment = createMockEnvironment();
  const ui = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<div>로딩</div>}>
        <MatchAttendanceSummarySlot
          matchGraphqlId={props.matchGraphqlId ?? "1"}
          teamId={props.teamId ?? 10}
        />
      </Suspense>
    </RelayEnvironmentProvider>
  );
  const result = render(ui);
  return { ...result, environment };
}

describe("MatchAttendanceSummarySlot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
  });

  it("쿼리 완료 전에는 Suspense fallback(스켈레톤)이 보인다", () => {
    renderSummary({});
    expect(
      screen.getByRole("status", { name: "참석 현황 불러오는 중" }),
    ).toBeInTheDocument();
  });

  it("findMatchAttendance 결과로 참석·불참 인원 수를 표시한다", async () => {
    const { environment } = renderSummary({});

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  userId: 1,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "A",
                    profileImage: null,
                  },
                },
                {
                  __typename: "MatchAttendanceModel",
                  userId: 2,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "B",
                    profileImage: null,
                  },
                },
                {
                  __typename: "MatchAttendanceModel",
                  userId: 3,
                  attendanceStatus: "ABSENT",
                  user: {
                    __typename: "UserModel",
                    name: "C",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    expect(
      await screen.findByRole("button", { name: /2명 참석, 명단 보기/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /1명 불참, 명단 보기/ }),
    ).toBeInTheDocument();
  });

  it("같은 팀 용병은 참석 인원·명단에 포함하고 다른 팀 용병은 제외한다", async () => {
    const { environment } = renderSummary({ teamId: 10 });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  userId: 1,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "팀원",
                    profileImage: null,
                  },
                },
              ],
              matchMercenaries: [
                {
                  __typename: "MatchMercenaryModel",
                  id: "100",
                  name: "용병A",
                  matchId: 1,
                  teamId: 10,
                },
                {
                  __typename: "MatchMercenaryModel",
                  id: "101",
                  name: "용병B",
                  matchId: 1,
                  teamId: 99,
                },
              ],
            }),
          }),
      );
    });

    expect(
      await screen.findByRole("button", { name: /2명 참석, 명단 보기/ }),
    ).toBeInTheDocument();

    const attendTrigger = screen.getByRole("button", {
      name: /2명 참석, 명단 보기/,
    });
    fireEvent.click(attendTrigger);

    expect(await screen.findByText("팀원")).toBeInTheDocument();
    expect(screen.getByText("용병A")).toBeInTheDocument();
    expect(screen.queryByText("용병B")).not.toBeInTheDocument();
  });

  it("attendanceStatus가 없는 행은 참석·불참 집계에서 제외한다", async () => {
    const { environment } = renderSummary({});

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  userId: 1,
                  attendanceStatus: null,
                  user: {
                    __typename: "UserModel",
                    name: "미정",
                    profileImage: null,
                  },
                },
                {
                  __typename: "MatchAttendanceModel",
                  userId: 2,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "참석자",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    expect(
      await screen.findByRole("button", { name: /1명 참석, 명단 보기/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /0명 불참, 명단 보기/ }),
    ).toBeInTheDocument();
  });

  it("터치 모드에서 참석 트리거를 누르면 명단이 보인다", async () => {
    const { environment } = renderSummary({});

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  userId: 7,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "나유저",
                    profileImage: null,
                  },
                },
                {
                  __typename: "MatchAttendanceModel",
                  userId: 8,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    name: "타인",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    expect(
      await screen.findByRole("button", { name: /2명 참석, 명단 보기/ }),
    ).toBeInTheDocument();

    const attendTrigger = screen.getByRole("button", {
      name: /2명 참석, 명단 보기/,
    });
    fireEvent.click(attendTrigger);

    expect(await screen.findByText("나유저")).toBeInTheDocument();
    expect(screen.getByText("타인")).toBeInTheDocument();
  });

  it("호버 모드에서는 마우스 진입 후 짧은 지연으로 팝오버가 닫힌다", async () => {
    jest.useFakeTimers();
    try {
      mockUseMediaQuery.mockReturnValue(true);

      const { environment } = renderSummary({});

      await act(async () => {
        environment.mock.resolveMostRecentOperation(
          (operation: OperationDescriptor) =>
            MockPayloadGenerator.generate(operation, {
              Query: () => ({
                findMatchAttendance: [
                  {
                    __typename: "MatchAttendanceModel",
                    userId: 1,
                    attendanceStatus: "ATTEND",
                    user: {
                      __typename: "UserModel",
                      name: "호버유저",
                      profileImage: null,
                    },
                  },
                ],
              }),
            }),
        );
      });

      expect(
        await screen.findByRole("button", { name: /1명 참석, 명단 보기/ }),
      ).toBeInTheDocument();

      const attendTrigger = screen.getByRole("button", {
        name: /1명 참석, 명단 보기/,
      });

      fireEvent.mouseEnter(attendTrigger);
      expect(await screen.findByText("호버유저")).toBeInTheDocument();

      fireEvent.mouseLeave(attendTrigger);

      await act(async () => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(attendTrigger).toHaveAttribute("aria-expanded", "false");
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
