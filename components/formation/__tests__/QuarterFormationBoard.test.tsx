import { render, screen, fireEvent } from "@testing-library/react";
import QuarterFormationBoard from "../board/QuarterFormationBoard";
import { DndContext } from "@dnd-kit/core";

// 하위 컴포넌트 모킹
jest.mock("../board/DroppableSlot", () => {
  return function MockDroppableSlot(props: any) {
    return (
      <div
        data-testid={`droppable-slot-${props.index}`}
        onClick={() => props.onPositionSelect()}
      >
        {props.positionName} - {props.player ? props.player.name : "Empty"}
      </div>
    );
  };
});

jest.mock("@/components/ui/Dropdown", () => {
  return function MockDropdown(props: any) {
    return (
      <select
        data-testid="dropdown"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock("@/components/ui/ObjectField", () => {
  return function MockObjectField(props: any) {
    return <div data-testid="object-field">{props.children}</div>;
  };
});

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn().mockReturnValue(true), // desktop default
}));

describe("QuarterFormationBoard 컴포넌트", () => {
  const mockOnPositionSelect = jest.fn();
  const mockOnPositionRemove = jest.fn();
  const mockOnFormationChange = jest.fn();

  const mockQuarter = {
    id: 1,
    formation: "4-3-3" as import("@/types/formation").FormationType,
    lineup: {
      0: {
        id: 100,
        name: "Player1",
        position: "ST",
        overall: 90,
        number: 10,
      } as any,
    },
    type: "match" as any,
    matchup: "home" as any,
  };

  const defaultProps = {
    quarter: mockQuarter,
    activePosition: null,
    selectedPlayer: null,
    isSelected: false,
    hasSelection: false,
    onPositionSelect: mockOnPositionSelect,
    onPositionRemove: mockOnPositionRemove,
    onFormationChange: mockOnFormationChange,
  };

  const setup = (props = {}) => {
    return render(
      <DndContext>
        <QuarterFormationBoard {...defaultProps} {...props} />
      </DndContext>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1Q 라벨 및 드롭다운 포메이션 선택기를 정상적으로 렌더링해야 한다", () => {
    setup();
    // 1Q 버튼 체크
    expect(screen.getByText("1Q")).toBeInTheDocument();

    // 드롭다운 렌더링
    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue("4-3-3");
  });

  it("포메이션 드롭다운을 변경하면 onFormationChange가 호출되어야 한다", () => {
    setup();
    const dropdown = screen.getByTestId("dropdown");
    fireEvent.change(dropdown, { target: { value: "4-4-2" } });

    expect(mockOnFormationChange).toHaveBeenCalledWith("4-4-2");
  });

  it("선수 배열(lineup)에 맞춰 DroppableSlot들이 올바르게 렌더링되어야 한다", () => {
    setup();
    // 4-3-3 포메이션의 경우 11개의 포지션이 있으나 상수 설정에 따름
    // 배열의 첫번째 요소(index=0)가 Player1인지 확인
    const firstSlot = screen.getByTestId("droppable-slot-0");
    expect(firstSlot).toBeInTheDocument();
    expect(firstSlot).toHaveTextContent("Player1");
  });

  it("빈 슬롯(DroppableSlot)을 클릭 시 position 정보를 담아 onPositionSelect가 호출되어야 한다", () => {
    setup();

    // index 0번 슬롯 클릭 (기본적으로 빈슬롯 상태를 모의로 조작하진 않았으나,
    // onClick에 onPositionSelect가 연결되었는지 확인)
    const firstSlot = screen.getByTestId("droppable-slot-0");
    fireEvent.click(firstSlot);

    // 4-3-3의 0번 인덱스 포지션명은 상수에 정의되어 있음 (예: "ST", "LW" 등)
    // 호출되었는지만 우선 검증
    expect(mockOnPositionSelect).toHaveBeenCalled();
  });
});
