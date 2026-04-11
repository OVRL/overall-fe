import { render, screen } from "@testing-library/react";
import ProfileStats from "../ProfileStats";

describe("ProfileStats", () => {
  it("스크린 리더용 제목과 스탯 라벨·값을 렌더링한다", () => {
    render(
      <ProfileStats
        overall={{
          ovr: 80,
          appearances: 10,
          goals: 3,
          assists: 2,
          keyPasses: 7,
          cleanSheets: 1,
          mom3: 4,
          mom8: 1,
        }}
      />,
    );

    expect(screen.getByText("활동 통계")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("경기 수")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("골")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("클린시트")).toBeInTheDocument();
    expect(screen.getByText("MOM 3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("overall이 없을 때 숫자 스탯은 0으로 표시한다", () => {
    render(<ProfileStats overall={undefined} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(6);
  });
});
