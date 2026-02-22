import { render, screen } from "@testing-library/react";
import MatchScheduleCard from "../MatchScheduleCard";

// 자식 모바일/데스크탑 컴포넌트 모킹
jest.mock("../MatchScheduleCardMobile", () => {
  return function MockMobile({ matchDate }: any) {
    return <div data-testid="mobile-card">{matchDate}</div>;
  };
});

jest.mock("../MatchScheduleCardDesktop", () => {
  return function MockDesktop({ matchDate, opponent }: any) {
    return (
      <div data-testid="desktop-card">
        {matchDate} - {opponent}
      </div>
    );
  };
});

describe("MatchScheduleCard 컴포넌트", () => {
  const defaultProps = {
    matchDate: "2026-02-03(목)",
    matchTime: "18:00~20:00",
    stadium: "수원 월드컵 보조 구장 A",
    opponent: "FC 빠름셀로나",
    opponentRecord: "전적 2승 1무 1패",
    homeUniform: "빨강",
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

  it("모바일 및 데스크탑 뷰 컴포넌트에 올바른 props를 전달해야 한다", () => {
    render(<MatchScheduleCard {...defaultProps} />);

    const mobileCard = screen.getByTestId("mobile-card");
    const desktopCard = screen.getByTestId("desktop-card");

    expect(mobileCard).toBeInTheDocument();
    expect(desktopCard).toBeInTheDocument();

    expect(mobileCard).toHaveTextContent("2026-02-03(목)");
    expect(desktopCard).toHaveTextContent("2026-02-03(목) - FC 빠름셀로나");
  });

  it("props가 주어지지 않았을 때 기본(Fallback) 데이터를 사용하여 렌더링해야 한다", () => {
    render(<MatchScheduleCard />);

    const desktopCard = screen.getByTestId("desktop-card");
    expect(desktopCard).toHaveTextContent("2026-02-03(목) - FC 빠름셀로나");
  });
});
