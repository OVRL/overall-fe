import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MomVoteMockMatchInfoCard } from "../MomVoteMockMatchInfoCard";

describe("MomVoteMockMatchInfoCard", () => {
  it("목 데이터 날짜·상대·스코어·결과·투표마감 문구를 표시한다", () => {
    render(<MomVoteMockMatchInfoCard result="win" />);

    expect(screen.getByText("2026. 2. 25.")).toBeInTheDocument();
    expect(screen.getByText("vs 레알 마드리드")).toBeInTheDocument();
    expect(screen.getByText("4 - 1")).toBeInTheDocument();
    expect(screen.getByText("승")).toBeInTheDocument();
    expect(screen.getByText("투표마감")).toBeInTheDocument();
    expect(screen.getByText("2026. 2. 25 18:00 종료")).toBeInTheDocument();
  });
});
