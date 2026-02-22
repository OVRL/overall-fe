import { render, screen, fireEvent } from "@testing-library/react";
import FormationPlayerImageThumbnail from "../FormationPlayerImageThumbnail";

// Icon 모킹
jest.mock("@/components/ui/Icon", () => ({ alt }: any) => (
  <span data-testid="mock-icon">{alt}</span>
));

// PlayerCard 모킹
jest.mock("@/components/ui/PlayerCard", () => {
  return function MockPlayerCard(props: any) {
    return (
      <div data-testid="player-card" onClick={props.onDelete}>
        {props.playerName}
      </div>
    );
  };
});

describe("FormationPlayerImageThumbnail 컴포넌트", () => {
  const mockOnDelete = jest.fn();

  const defaultProps = {
    imgUrl: "/test-image.png",
    playerName: "손흥민",
    playerSeason: "23/24",
    isSelected: false,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("해당 선수의 이름과 PlayerCard 요소가 렌더링되어야 한다", () => {
    render(<FormationPlayerImageThumbnail {...defaultProps} />);

    const playerCard = screen.getByTestId("player-card");
    expect(playerCard).toBeInTheDocument();
    expect(playerCard).toHaveTextContent("손흥민");
  });

  it("isSelected가 true일 때, 활성화 원(Icon) 요소가 렌더링되어야 한다", () => {
    render(
      <FormationPlayerImageThumbnail {...defaultProps} isSelected={true} />,
    );

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("selected circle");
  });

  it("isSelected가 false일 때, 활성화 원 요소가 숨김 처리되어야 한다", () => {
    render(
      <FormationPlayerImageThumbnail {...defaultProps} isSelected={false} />,
    );

    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
  });

  it("onDelete 핸들러를 PlayerCard 내부 이벤트로 전달할 수 있어야 한다", () => {
    // PlayerCard의 가장 상위 요소를 클릭하면 onDelete가 실행되도록 모킹됨
    render(<FormationPlayerImageThumbnail {...defaultProps} />);

    const playerCard = screen.getByTestId("player-card");
    fireEvent.click(playerCard);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
