import { render, screen } from "@testing-library/react";
import SeasonIntegratedRecords from "../SeasonIntegratedRecords";

describe("SeasonIntegratedRecords", () => {
  it("섹션 제목과 테이블 헤더·더미 연도 행을 렌더링한다", () => {
    render(<SeasonIntegratedRecords />);

    expect(
      screen.getByRole("heading", { name: "시즌별 통합 기록" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "연도" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2026" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2025" })).toBeInTheDocument();
  });
});
