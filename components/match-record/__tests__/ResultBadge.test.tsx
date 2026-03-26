import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResultBadge } from "../ResultBadge";

describe("ResultBadge", () => {
  it.each([
    ["win" as const, "승", "승리"],
    ["draw" as const, "무", "무승부"],
    ["loss" as const, "패", "패배"],
  ])("result=%s일 때 표시 라벨과 접근성 라벨이 맞아야 한다", (result, label, sr) => {
    render(<ResultBadge result={result} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByLabelText(sr)).toBeInTheDocument();
  });

  it("className이 병합되어야 한다", () => {
    render(<ResultBadge result="win" className="custom-badge" />);
    expect(screen.getByLabelText("승리")).toHaveClass("custom-badge");
  });
});
