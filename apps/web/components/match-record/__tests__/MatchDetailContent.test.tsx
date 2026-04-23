import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchDetailContent } from "../MatchDetailContent";
import { MOCK_MATCH_RECORDS } from "../mockMatchRecords";

const record = MOCK_MATCH_RECORDS[0];

describe("MatchDetailContent", () => {
  it("쿼터 그리드와 타임라인 섹션을 포함해야 한다", () => {
    render(<MatchDetailContent record={record} />);

    expect(screen.getByRole("heading", { name: "쿼터별 스코어" })).toBeInTheDocument();
    const timeline = screen.getByRole("region", {
      name: "경기 이벤트 타임라인",
    });
    expect(timeline).toBeInTheDocument();
    // 목업에 득점 이벤트가 2건 있어 라벨이 복수
    expect(screen.getAllByText("득점").length).toBeGreaterThanOrEqual(1);
  });
});
