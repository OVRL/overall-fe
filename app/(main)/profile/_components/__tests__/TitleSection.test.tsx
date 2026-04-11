import { render, screen } from "@testing-library/react";
import TitleSection from "../TitleSection";

describe("TitleSection", () => {
  it("페이지 제목과 설명 문구를 렌더링한다", () => {
    render(<TitleSection />);

    expect(
      screen.getByRole("heading", { level: 1, name: "내 정보" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("프로필과 팀별 활동 기록을 확인하세요"),
    ).toBeInTheDocument();
  });
});
