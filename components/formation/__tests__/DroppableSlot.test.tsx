import { render, screen, fireEvent } from "@testing-library/react";
import DroppableSlot from "../DroppableSlot";
import { DndContext } from "@dnd-kit/core";

// FormationPlayerImageThumbnail 컴포넌트 모킹
jest.mock("../FormationPlayerImageThumbnail", () => {
  return function MockThumbnail(props: any) {
    return (
      <div data-testid="player-thumbnail" onClick={() => props.onDelete?.()}>
        {props.playerName}
      </div>
    );
  };
});

// QuarterButton 컴포넌트 모킹
jest.mock("@/components/ui/QuarterButton", () => {
  return function MockQuarterButton(props: any) {
    return (
      <button data-testid="quarter-button" onClick={props.onClick}>
        {props.children}
      </button>
    );
  };
});

describe("DroppableSlot 컴포넌트", () => {
  const mockOnPositionSelect = jest.fn();
  const mockOnPlayerRemove = jest.fn();

  const defaultProps = {
    quarterId: 1,
    index: 0,
    positionName: "ST",
    player: null,
    selectedPlayer: null,
    isActive: false,
    onPositionSelect: mockOnPositionSelect,
    onPlayerRemove: mockOnPlayerRemove,
  };

  const setup = (props = {}) => {
    return render(
      <DndContext>
        <DroppableSlot {...defaultProps} {...props} />
      </DndContext>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("선수(player) 데이터가 없을 때, 빈 슬롯(QuarterButton)을 렌더링하고 포지션 이름을 표시해야 한다", () => {
    setup();

    const emptySlotBtn = screen.getByTestId("quarter-button");
    expect(emptySlotBtn).toBeInTheDocument();
    expect(emptySlotBtn).toHaveTextContent("ST");
  });

  it("빈 슬롯을 클릭하면 onPositionSelect가 호출되어야 한다", () => {
    setup();

    const emptySlotBtn = screen.getByTestId("quarter-button");
    fireEvent.click(emptySlotBtn);
    expect(mockOnPositionSelect).toHaveBeenCalledTimes(1);
  });

  it("선수(player) 데이터가 주어지면, QuarterButton 대신 FormationPlayerImageThumbnail을 렌더링해야 한다", () => {
    const playerMock = { id: 1, name: "손흥민", position: "ST", rating: 90 };
    setup({ player: playerMock });

    // 빈 슬롯 버튼은 없어야 함
    expect(screen.queryByTestId("quarter-button")).not.toBeInTheDocument();

    // 선수 썸네일은 렌더링되어야 함
    const thumbnail = screen.getByTestId("player-thumbnail");
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveTextContent("손흥민");
  });

  it("선수 썸네일 제거(onDelete) 액션 시 onPlayerRemove가 호출되어야 한다", () => {
    const playerMock = { id: 1, name: "손흥민", position: "ST", rating: 90 };
    setup({ player: playerMock });

    const thumbnail = screen.getByTestId("player-thumbnail");
    fireEvent.click(thumbnail); // 모킹에서 click 시 onDelete 호출되도록 설정됨
    expect(mockOnPlayerRemove).toHaveBeenCalledTimes(1);
  });
});
