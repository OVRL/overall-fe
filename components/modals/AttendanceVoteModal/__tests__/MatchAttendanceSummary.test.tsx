import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import {
  createMockEnvironment,
  MockPayloadGenerator,
} from "relay-test-utils";
import type { OperationDescriptor } from "relay-runtime";
import "@testing-library/jest-dom";
import { MatchAttendanceSummary } from "../MatchAttendanceSummary";

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn(() => false),
}));

const mockUseMediaQuery = jest.requireMock("@/hooks/useMediaQuery")
  .useMediaQuery as jest.Mock;

jest.mock("@/components/ui/ProfileAvatar", () => {
  return function MockProfileAvatar() {
    /* alt는 접근성용이므로 텍스트 노드로 넣지 않음 (쿼리 중복 방지) */
    return <div data-testid="profile-avatar" />;
  };
});

jest.mock("@/components/ui/Icon", () => {
  return function MockIcon() {
    return <span data-testid="chevron-right-mock" />;
  };
});

function renderSummary(props: {
  matchId?: number;
  teamId?: number;
  currentUserId?: number | null;
}) {
  const environment = createMockEnvironment();
  const ui = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<div>로딩</div>}>
        <MatchAttendanceSummary
          matchId={props.matchId ?? 1}
          teamId={props.teamId ?? 10}
          currentUserId={props.currentUserId ?? null}
        />
      </Suspense>
    </RelayEnvironmentProvider>
  );
  const result = render(ui);
  return { ...result, environment };
}

describe("MatchAttendanceSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
  });

  it("쿼리 완료 전에는 Suspense fallback이 보인다", () => {
    renderSummary({});
    expect(screen.getByText("로딩")).toBeInTheDocument();
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

    expect(await screen.findByText("2명 참석")).toBeInTheDocument();
    expect(screen.getByText("1명 불참")).toBeInTheDocument();
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

    expect(await screen.findByText("1명 참석")).toBeInTheDocument();
    expect(screen.getByText("0명 불참")).toBeInTheDocument();
  });

  it("터치 모드에서 참석 트리거를 누르면 명단과 본인 뱃지가 보인다", async () => {
    const { environment } = renderSummary({ currentUserId: 7 });

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

    expect(await screen.findByText("2명 참석")).toBeInTheDocument();

    const attendTrigger = screen.getByRole("button", {
      name: /2명 참석, 명단 보기/,
    });
    fireEvent.click(attendTrigger);

    expect(await screen.findByText("나유저")).toBeInTheDocument();
    expect(screen.getByText("타인")).toBeInTheDocument();
    expect(screen.getByLabelText("나")).toBeInTheDocument();
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

      expect(await screen.findByText("1명 참석")).toBeInTheDocument();

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
