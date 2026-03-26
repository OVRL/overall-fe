import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameTimeline } from "../GameTimeline";
import type { MatchTimelineEvent } from "../types";

describe("GameTimeline", () => {
  it("이벤트가 없으면 안내 문구를 status로 보여야 한다", () => {
    render(<GameTimeline events={[]} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("등록된 이벤트가 없습니다.");
  });

  it("이벤트마다 쿼터 버튼 라벨과 타임라인 행을 렌더링해야 한다", () => {
    const events: MatchTimelineEvent[] = [
      {
        id: "e1",
        kind: "goal",
        quarter: 1,
        scorerName: "A",
      },
      {
        id: "e2",
        kind: "conceded",
        quarter: 4,
        opponentLabel: "B",
      },
    ];
    render(<GameTimeline events={events} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    // QuarterButton은 aria-hidden이라 역할 쿼리 대신 텍스트로 확인
    expect(screen.getByText("1Q")).toBeInTheDocument();
    expect(screen.getByText("4Q")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
