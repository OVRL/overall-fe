import { render, screen, fireEvent } from "@testing-library/react";
import FormationPlayerRow from "../FormationPlayerRow";
import { DndContext } from "@dnd-kit/core";

// 하위 컴포넌트 및 훅 모킹
jest.mock("@/components/ui/ProfileAvatar", () => {
  return function MockProfileAvatar(props: any) {
    return <div data-testid="profile-avatar">{props.alt}</div>;
  };
});

jest.mock("@/components/PositionChip", () => {
  return function MockPositionChip(props: any) {
    return <div data-testid="position-chip">{props.position}</div>;
  };
});

jest.mock("@/components/ui/QuarterChip", () => {
  return function MockQuarterChip(props: any) {
    return <div data-testid="quarter-chip">{props.quarters?.join(",")}</div>;
  };
});

jest.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: jest.fn().mockReturnValue(false),
}));

describe("FormationPlayerRow 컴포넌트", () => {
  const mockOnSelect = jest.fn();

  const mockPlayer: any = {
    id: 10,
    name: "박지성",
    position: "MF",
    overall: 88,
    rating: 88,
    number: 7,
  };

  const defaultProps = {
    player: mockPlayer,
    isSelected: false,
    activeQuarters: [1, 2],
    onSelect: mockOnSelect,
  };

  const setup = (props = {}) => {
    return render(
      <DndContext>
        <FormationPlayerRow {...defaultProps} {...props} />
      </DndContext>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("선수 이름, 오버롤, 포지션 칩, 쿼터 칩 등 기본 정보를 올바르게 렌더링해야 한다", () => {
    setup();

    expect(screen.getAllByText("박지성").length).toBeGreaterThan(0);
    expect(screen.getByText("OVR 88")).toBeInTheDocument();

    expect(screen.getByTestId("profile-avatar")).toHaveTextContent("박지성");
    expect(screen.getByTestId("position-chip")).toHaveTextContent("MF");
    expect(screen.getByTestId("quarter-chip")).toHaveTextContent("1,2");
  });

  it("로우 전체 영역을 클릭했을 때 onSelect 핸들러가 해당 선수 데이터를 인자로 호출되어야 한다", () => {
    setup();

    // row의 텍스트가 포함된 첫번째 요소를 클릭한다고 가정 (최상위 컨테이너)
    const rowContainer = screen
      .getAllByText("박지성")[0]
      .closest("div[class*='group']")!;
    fireEvent.click(rowContainer);

    expect(mockOnSelect).toHaveBeenCalledWith(mockPlayer);
  });

  it("isSelected가 true일 때 특정 강조 스타일 클래스를 포함해야 한다", () => {
    setup({ isSelected: true });

    const rowContainer = screen
      .getAllByText("박지성")[0]
      .closest("div[class*='group']")!;
    expect(rowContainer).toHaveClass("border-[#32400A]");
  });
});
