import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamInfoModalJoinFooter } from "../TeamInfoModalJoinFooter";
import "@testing-library/jest-dom";

const mockHideModal = jest.fn();
const mockRequestJoin = jest.fn();
const mockCancelJoin = jest.fn();

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({ hideModal: mockHideModal }),
}));

jest.mock("../hooks/useRequestJoinTeamMutation", () => ({
  useRequestJoinTeamMutation: () => ({
    executeMutation: mockRequestJoin,
    isInFlight: false,
  }),
}));

jest.mock("../hooks/useCancelJoinRequestMutation", () => ({
  useCancelJoinRequestMutation: () => ({
    executeMutation: mockCancelJoin,
    isInFlight: false,
  }),
}));

describe("TeamInfoModalJoinFooter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestJoin.mockImplementation(
      (opts: { onCompleted?: (r: unknown) => void }) => {
        opts.onCompleted?.({
          requestJoinTeam: { id: 100 },
        });
      },
    );
    mockCancelJoin.mockImplementation(
      (opts: { onCompleted?: (r: unknown) => void }) => {
        opts.onCompleted?.({ cancelJoinRequest: true });
      },
    );
  });

  it("initialPendingJoinRequestId가 없으면 가입 신청·취소 버튼", () => {
    render(<TeamInfoModalJoinFooter inviteCode="CODE1" />);
    expect(screen.getByRole("button", { name: "가입 신청" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
    expect(screen.queryByText("승인 대기중")).not.toBeInTheDocument();
  });

  it("initialPendingJoinRequestId가 있으면 승인 대기중·가입 취소", () => {
    render(
      <TeamInfoModalJoinFooter inviteCode="CODE1" initialPendingJoinRequestId={42} />,
    );
    expect(screen.getByText("승인 대기중")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "가입 취소" })).toBeInTheDocument();
  });

  it("가입 신청 성공 시 승인 대기 UI로 전환", async () => {
    render(<TeamInfoModalJoinFooter inviteCode="INV" />);
    fireEvent.click(screen.getByRole("button", { name: "가입 신청" }));
    await waitFor(() => {
      expect(screen.getByText("승인 대기중")).toBeInTheDocument();
    });
    expect(mockRequestJoin).toHaveBeenCalled();
  });

  it("가입 취소 클릭 시 취소 뮤테이션 호출", async () => {
    render(
      <TeamInfoModalJoinFooter inviteCode="INV" initialPendingJoinRequestId={42} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "가입 취소" }));
    await waitFor(() => {
      expect(mockCancelJoin).toHaveBeenCalled();
    });
  });
});
