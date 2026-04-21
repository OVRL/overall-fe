import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MomVoteMatchInfoCard } from "../MomVoteMockMatchInfoCard";

describe("MomVoteMatchInfoCard", () => {
  it("실제 경기 정보(날짜·상대·스코어·결과·투표마감)를 props 기반으로 표시한다", () => {
    render(
      <MomVoteMatchInfoCard
        matchDate="2026-02-25T00:00:00.000Z"
        startTime="18:00"
        opponentName="레알 마드리드"
        description={JSON.stringify({ score: { home: 4, away: 1 } })}
        voteDeadline="2026-02-25T18:00:00.000Z"
      />,
    );

    expect(screen.getByText(/레알 마드리드/)).toBeInTheDocument();
    expect(screen.getByText("4 - 1")).toBeInTheDocument();
    expect(screen.getByText("승")).toBeInTheDocument();
    expect(screen.getByText("투표마감")).toBeInTheDocument();
  });
});
