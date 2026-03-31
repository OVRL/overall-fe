import { render, screen } from "@testing-library/react";
import MatchScheduleCard from "../MatchScheduleCard";

// 데스크톱 컴포넌트 모킹 (모바일 카드는 기획 변경으로 제거됨)
jest.mock("../MatchScheduleCardDesktop", () => {
  return function MockDesktop({
    matchScheduleLine,
    opponent,
  }: {
    matchScheduleLine: string;
    opponent: string;
  }) {
    return (
      <div data-testid="desktop-card">
        {matchScheduleLine} — {opponent}
      </div>
    );
  };
});

describe("MatchScheduleCard 컴포넌트", () => {
  const defaultProps = {
    matchId: 1,
    teamId: 2,
    matchScheduleLine: "2026-02-03(목) 18:00~20:00",
    venue: {
      address: "수원 월드컵 보조 구장 A",
      latitude: 0,
      longitude: 0,
    },
    opponent: "FC 빠름셀로나",
    opponentRecord: "전적 2승 1무 1패",
    uniformDesign: "SOLID_RED" as const,
  };

  it("전체 섹션 래퍼와 올바른 클래스네임을 렌더링해야 한다", () => {
    const { container } = render(
      <MatchScheduleCard {...defaultProps} className="custom-test-class" />,
    );
    const section = container.querySelector("section");
    const innerDiv = section?.firstChild as HTMLElement;

    expect(section).toBeInTheDocument();
    expect(innerDiv).toHaveClass("bg-surface-card");
    expect(innerDiv).toHaveClass("custom-test-class");
  });

  it("데스크톱 뷰 컴포넌트에 올바른 props를 전달해야 한다", () => {
    render(<MatchScheduleCard {...defaultProps} />);

    const desktopCard = screen.getByTestId("desktop-card");
    expect(desktopCard).toBeInTheDocument();
    expect(desktopCard).toHaveTextContent(
      "2026-02-03(목) 18:00~20:00 — FC 빠름셀로나",
    );
  });

  it("선택 props를 생략했을 때 기본(Fallback) 데이터로 렌더링해야 한다", () => {
    render(<MatchScheduleCard matchId={1} teamId={2} />);

    const desktopCard = screen.getByTestId("desktop-card");
    expect(desktopCard).toHaveTextContent(
      "2026-02-03(목) 18:00~20:00 — FC 빠름셀로나",
    );
  });
});
