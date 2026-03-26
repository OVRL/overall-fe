import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchSummaryHeader } from "../MatchSummaryHeader";
import { MOCK_MATCH_RECORDS } from "../mockMatchRecords";

const record = MOCK_MATCH_RECORDS[0];

describe("MatchSummaryHeader", () => {
  it("날짜·상대·스코어·결과 배지를 표시해야 한다", () => {
    render(<MatchSummaryHeader record={record} isOpen={false} />);

    expect(screen.getByText(record.dateLabel)).toBeInTheDocument();
    expect(screen.getByText(`vs ${record.opponentName}`)).toBeInTheDocument();
    expect(
      screen.getByText(`${record.ourScore} - ${record.theirScore}`),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("패배")).toBeInTheDocument();
  });

  it("isOpen이 true이면 쉐브론에 회전 클래스가 붙어야 한다", () => {
    const { container } = render(
      <MatchSummaryHeader record={record} isOpen />,
    );
    const chevronWrap = container.querySelector(".rotate-180");
    expect(chevronWrap).toBeInTheDocument();
  });
});
