import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchAccordionList } from "../MatchAccordionList";
import { MOCK_MATCH_RECORDS } from "../mockMatchRecords";

describe("MatchAccordionList", () => {
  it("records가 비어 있으면 안내 문구만 보여야 한다", () => {
    render(<MatchAccordionList records={[]} />);
    expect(
      screen.getByText("표시할 경기 기록이 없습니다."),
    ).toBeInTheDocument();
  });

  it("각 record에 대해 아코디언 아이템을 렌더링해야 한다", () => {
    const subset = MOCK_MATCH_RECORDS.slice(0, 2);
    render(<MatchAccordionList records={subset} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText(`vs ${subset[0].opponentName}`)).toBeInTheDocument();
    expect(screen.getByText(`vs ${subset[1].opponentName}`)).toBeInTheDocument();
  });
});
