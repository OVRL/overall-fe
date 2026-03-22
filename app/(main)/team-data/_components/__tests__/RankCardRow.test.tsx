import { render, screen, fireEvent } from "@testing-library/react";
import RankCardRow from "../season-record/RankCardRow";
import { Player } from "../../_types/player";

describe("RankCardRow 컴포넌트", () => {
  const mockPlayer: Player = {
    id: 1,
    name: "손흥민",
    team: "토트넘",
    value: "20골",
    position: "FW",
    backNumber: 7,
    ovr: 80,
  };

  const mockOnPlayerClick = jest.fn();

  it("선수 정보와 순위가 올바르게 렌더링되어야 한다", () => {
    render(
      <RankCardRow
        player={mockPlayer}
        index={0}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    // 순위 확인 (컴포넌트: index + 2로 표시)
    expect(screen.getByText("2")).toBeInTheDocument();

    // 선수 이름 확인 (모킹된 아바타와 실제 이름 텍스트 두 군데 존재할 수 있음)
    const nameElements = screen.getAllByText("손흥민");
    expect(nameElements.length).toBeGreaterThan(0);

    // 값 확인 (정규식 처리에 의해 '20'만 남거나 그대로 표시될 수 있음)
    // 컴포넌트 로직: String(player.value).replace(/[^0-9%]/g, "")
    expect(screen.getByText("20")).toBeInTheDocument();

    // 전역 ProfileAvatar 스텁: 가시 텍스트 대신 aria-label로 alt 전달 (쿼리 중복 방지)
    expect(screen.getByTestId("profile-avatar")).toHaveAttribute(
      "aria-label",
      "손흥민",
    );
  });

  it("클릭 시 onPlayerClick 콜백이 호출되어야 한다", () => {
    render(
      <RankCardRow
        player={mockPlayer}
        index={0}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    fireEvent.click(screen.getByRole("listitem"));

    expect(mockOnPlayerClick).toHaveBeenCalledWith(mockPlayer);
  });
});
