import { render, screen, act, fireEvent } from "@testing-library/react";
import { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import {
  createMockEnvironment,
  MockPayloadGenerator,
} from "relay-test-utils";
import type { OperationDescriptor } from "relay-runtime";
import "@testing-library/jest-dom";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { AttendanceVoteActionFooterSlot } from "../AttendanceVoteActionFooterSlot";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

const minimalMatch = { id: "1" } as MatchNode;

function renderFooter(options: {
  userId?: number | null;
  voteClosed?: boolean;
  matchGraphqlId?: string;
}) {
  const environment = createMockEnvironment();
  const ui = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<div>로딩</div>}>
        <AttendanceVoteActionFooterSlot
          matchGraphqlId={options.matchGraphqlId ?? "1"}
          teamId={10}
          userId={options.userId ?? 99}
          match={minimalMatch}
          voteClosed={options.voteClosed ?? false}
        />
      </Suspense>
    </RelayEnvironmentProvider>
  );
  const result = render(ui);
  return { ...result, environment };
}

describe("AttendanceVoteActionFooterSlot", () => {
  it("경기 ID를 파싱할 수 없으면 안내 문구만 보여준다", () => {
    render(
      <AttendanceVoteActionFooterSlot
        matchGraphqlId="@@@not-parseable@@@"
        teamId={10}
        userId={1}
        match={minimalMatch}
        voteClosed={false}
      />,
    );

    expect(
      screen.getByText("경기 ID를 확인할 수 없어 투표할 수 없습니다."),
    ).toBeInTheDocument();
  });

  it("쿼리 대기 중 Suspense 폴백(투표 영역)이 보인다", () => {
    renderFooter({});
    expect(
      screen.getByRole("status", { name: "투표 영역 불러오는 중" }),
    ).toBeInTheDocument();
  });

  it("내 행이 없으면 불참·참석 버튼을 보여준다", async () => {
    const { environment } = renderFooter({ userId: 99 });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  id: "MatchAttendance:1",
                  memberType: "MEMBER",
                  userId: 1,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    id: "User:1",
                    name: "다른사람",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    expect(await screen.findByRole("button", { name: "불참" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "참석" })).toBeInTheDocument();
  });

  it("내가 이미 투표한 행이 있으면 다시 투표하기만 보여준다", async () => {
    const { environment } = renderFooter({ userId: 42 });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  id: "42",
                  memberType: "MEMBER",
                  userId: 42,
                  attendanceStatus: "ATTEND",
                  user: {
                    __typename: "UserModel",
                    id: "User:42",
                    name: "나",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    expect(
      await screen.findByRole("button", { name: "다시 투표하기" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "참석" })).not.toBeInTheDocument();
  });

  it("다시 투표하기를 누르면 불참·참석 버튼으로 바뀐다", async () => {
    const { environment } = renderFooter({ userId: 42 });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(
        (operation: OperationDescriptor) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              findMatchAttendance: [
                {
                  __typename: "MatchAttendanceModel",
                  id: "42",
                  memberType: "MEMBER",
                  userId: 42,
                  attendanceStatus: "ABSENT",
                  user: {
                    __typename: "UserModel",
                    id: "User:42",
                    name: "나",
                    profileImage: null,
                  },
                },
              ],
            }),
          }),
      );
    });

    const revote = await screen.findByRole("button", { name: "다시 투표하기" });
    fireEvent.click(revote);

    expect(screen.getByRole("button", { name: "불참" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "참석" })).toBeInTheDocument();
  });
});
