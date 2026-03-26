import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TimelineEventRow } from "../TimelineEventRow";
import type { MatchTimelineEvent } from "../types";

describe("TimelineEventRow", () => {
  it("득점 이벤트에서 득점·도움·기점을 표시해야 한다", () => {
    const event: MatchTimelineEvent = {
      id: "g1",
      kind: "goal",
      quarter: 1,
      scorerName: "홍길동",
      assistName: "김철수",
      buildUpName: "이영희",
    };
    render(<TimelineEventRow event={event} />);

    expect(screen.getByText("득점")).toBeInTheDocument();
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("도움")).toBeInTheDocument();
    expect(screen.getByText("김철수")).toBeInTheDocument();
    expect(screen.getByText("기점")).toBeInTheDocument();
    expect(screen.getByText("이영희")).toBeInTheDocument();
  });

  it("득점에서 assist·buildUp이 없으면 보조 행을 숨겨야 한다", () => {
    const event: MatchTimelineEvent = {
      id: "g2",
      kind: "goal",
      quarter: 2,
      scorerName: "단독",
    };
    render(<TimelineEventRow event={event} />);

    expect(screen.getByText("득점")).toBeInTheDocument();
    expect(screen.getByText("단독")).toBeInTheDocument();
    expect(screen.queryByText("도움")).not.toBeInTheDocument();
    expect(screen.queryByText("기점")).not.toBeInTheDocument();
  });

  it("실점 이벤트에서 상대 라벨을 표시해야 한다", () => {
    const event: MatchTimelineEvent = {
      id: "c1",
      kind: "conceded",
      quarter: 3,
      opponentLabel: "메시",
    };
    render(<TimelineEventRow event={event} />);

    expect(screen.getByText("실점")).toBeInTheDocument();
    expect(screen.getByText("메시")).toBeInTheDocument();
  });

  it("이름이 없으면 대시 플레이스홀더를 쓴다", () => {
    const goal: MatchTimelineEvent = {
      id: "g3",
      kind: "goal",
      quarter: 1,
    };
    const { rerender } = render(<TimelineEventRow event={goal} />);
    expect(screen.getByText("—")).toBeInTheDocument();

    const conceded: MatchTimelineEvent = {
      id: "c2",
      kind: "conceded",
      quarter: 1,
    };
    rerender(<TimelineEventRow event={conceded} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });
});
