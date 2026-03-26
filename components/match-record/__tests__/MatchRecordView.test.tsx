import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatchRecordView from "../MatchRecordView";

describe("MatchRecordView", () => {
  it("헤더와 목록을 렌더링하고 목업 데이터가 보여야 한다", () => {
    render(<MatchRecordView />);

    expect(
      screen.getByRole("heading", { level: 1, name: "경기 기록" }),
    ).toBeInTheDocument();
    // MOCK 첫 행 상대팀명 (전체 필터 시 목록에 포함)
    expect(screen.getAllByText(/바르셀로나/).length).toBeGreaterThan(0);
  });
});
