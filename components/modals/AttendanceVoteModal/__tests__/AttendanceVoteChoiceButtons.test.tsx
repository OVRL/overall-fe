import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AttendanceVoteChoiceButtons } from "../AttendanceVoteChoiceButtons";

describe("AttendanceVoteChoiceButtons", () => {
  const defaultHandlers = {
    onRequestRevote: jest.fn(),
    onAbsent: jest.fn(),
    onAttend: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("미투표·재투표 모드에서는 불참·참석 버튼을 보여준다", () => {
    render(
      <AttendanceVoteChoiceButtons
        voteClosed={false}
        isInFlight={false}
        pendingVoteChoice={null}
        showRevoteEntry={false}
        {...defaultHandlers}
      />,
    );

    expect(screen.getByRole("button", { name: "불참" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "참석" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "다시 투표하기" }),
    ).not.toBeInTheDocument();
  });

  it("이미 투표했을 때 다시 투표하기 단일 버튼만 보여준다", () => {
    render(
      <AttendanceVoteChoiceButtons
        voteClosed={false}
        isInFlight={false}
        pendingVoteChoice={null}
        showRevoteEntry
        {...defaultHandlers}
      />,
    );

    expect(
      screen.getByRole("button", { name: "다시 투표하기" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "불참" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "참석" })).not.toBeInTheDocument();
  });

  it("다시 투표하기 클릭 시 onRequestRevote를 호출한다", () => {
    render(
      <AttendanceVoteChoiceButtons
        voteClosed={false}
        isInFlight={false}
        pendingVoteChoice={null}
        showRevoteEntry
        {...defaultHandlers}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "다시 투표하기" }));
    expect(defaultHandlers.onRequestRevote).toHaveBeenCalledTimes(1);
  });

  it("투표 마감 시 안내 문구를 보여주고 버튼을 비활성화한다", () => {
    render(
      <AttendanceVoteChoiceButtons
        voteClosed
        isInFlight={false}
        pendingVoteChoice={null}
        showRevoteEntry={false}
        {...defaultHandlers}
      />,
    );

    expect(
      screen.getByText(
        "투표 마감 시간이 지나 참석·불참 투표를 할 수 없습니다.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "불참" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "참석" })).toBeDisabled();
  });

  it("요청 진행 중(isInFlight)에는 버튼을 비활성화한다", () => {
    render(
      <AttendanceVoteChoiceButtons
        voteClosed={false}
        isInFlight
        pendingVoteChoice={null}
        showRevoteEntry
        {...defaultHandlers}
      />,
    );

    expect(screen.getByRole("button", { name: "다시 투표하기" })).toBeDisabled();
  });
});
