import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QuarterScoreGrid } from "../QuarterScoreGrid";
import type { QuarterScore } from "../types";

const fourQuarters: [QuarterScore, QuarterScore, QuarterScore, QuarterScore] =
  [
    { home: 2, away: 1 },
    { home: 0, away: 0 },
    { home: 1, away: 3 },
    { home: 4, away: 4 },
  ];

describe("QuarterScoreGrid", () => {
  it("제목과 1~4쿼터 라벨·스코어를 렌더링해야 한다", () => {
    render(<QuarterScoreGrid quarters={fourQuarters} />);

    expect(screen.getByRole("heading", { name: "쿼터별 스코어" })).toBeInTheDocument();
    expect(screen.getByText("1쿼터")).toBeInTheDocument();
    expect(screen.getByText("2쿼터")).toBeInTheDocument();
    expect(screen.getByText("3쿼터")).toBeInTheDocument();
    expect(screen.getByText("4쿼터")).toBeInTheDocument();
    expect(screen.getByText("2 - 1")).toBeInTheDocument();
    expect(screen.getByText("0 - 0")).toBeInTheDocument();
    expect(screen.getByText("1 - 3")).toBeInTheDocument();
    expect(screen.getByText("4 - 4")).toBeInTheDocument();
  });

  it("className이 그리드 루트에 적용되어야 한다", () => {
    const { container } = render(
      <QuarterScoreGrid quarters={fourQuarters} className="grid-extra" />,
    );
    const grid = container.querySelector(".grid-extra");
    expect(grid).toBeInTheDocument();
  });
});
