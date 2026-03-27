import { render, screen, fireEvent } from "@testing-library/react";
import FormationBuilder from "../FormationBuilder";
import { FormationMatchPlayersProvider } from "../../_context/FormationMatchPlayersContext";
import { useFormationManager } from "@/hooks/formation/useFormationManager";

// 1. 모듈 모킹
jest.mock("@/hooks/formation/useFormationManager");
jest.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: jest.fn(() => false), // 데스크톱 분기로 테스트
}));

// 데스크톱 분기: dynamic으로 로드되는 FormationBuilderDesktopWithDnd 모킹
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockDesktopWithDnd = (props: any) => (
      <div data-testid="formation-builder-desktop">
        {props.scheduleCard}
        <div data-testid="formation-controls">
          <button
            onClick={() => props.setCurrentQuarterId(2)}
            data-testid="mock-control-button"
          >
            Change Quarter
          </button>
        </div>
        <div data-testid="formation-board-list">
          Current Quarter:{" "}
          {props.currentQuarterId === null ? "null" : props.currentQuarterId}
        </div>
        <div data-testid="formation-player-list">Player List</div>
      </div>
    );
    return MockDesktopWithDnd;
  },
}));

jest.mock("../FormationBuilderMobile", () => {
  return function MockFormationBuilderMobile() {
    return <div data-testid="formation-builder-mobile">Mobile</div>;
  };
});

// FormationHeader는 Next.js 라우터·브릿지 훅을 쓰므로 단위 테스트에서는 스텁 처리
jest.mock("../FormationHeader", () => ({
  __esModule: true,
  default: function MockFormationHeader() {
    return <div data-testid="formation-header" />;
  },
}));

describe("FormationBuilder 컴포넌트", () => {
  const mockScheduleCard = <div data-testid="schedule-card">Mock Schedule</div>;
  const mockInitialPlayers: any[] = [];

  const mockManager = {
    quarters: [{ id: 1, formation: "4-3-3", lineup: {} }],
    setQuarters: jest.fn(),
    addQuarter: jest.fn(),
    assignPlayer: jest.fn(),
    removePlayer: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormationManager as jest.Mock).mockReturnValue(mockManager);
  });

  it("기본 레이아웃 및 렌더링이 정상적으로 동작해야 한다", () => {
    render(
      <FormationMatchPlayersProvider players={mockInitialPlayers}>
        <FormationBuilder scheduleCard={mockScheduleCard} />
      </FormationMatchPlayersProvider>,
    );

    expect(screen.getByTestId("formation-builder-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-card")).toBeInTheDocument();
    expect(screen.getByTestId("formation-controls")).toBeInTheDocument();
    expect(screen.getByTestId("formation-board-list")).toBeInTheDocument();
    expect(screen.getByTestId("formation-player-list")).toBeInTheDocument();
  });

  it("FormationControls를 통한 쿼터 선택 상태가 FormationBoardList로 올바르게 전달되어야 한다", () => {
    render(
      <FormationMatchPlayersProvider players={mockInitialPlayers}>
        <FormationBuilder scheduleCard={mockScheduleCard} />
      </FormationMatchPlayersProvider>,
    );

    // 초기값은 null로 설정되어 있는지 확인 (page 변경 이전엔 null로 초기화됨)
    expect(screen.getByTestId("formation-board-list")).toHaveTextContent(
      "Current Quarter: null",
    );

    // 컨트롤 패널의 버튼 클릭 시 상태 변경되는지 시뮬레이션
    fireEvent.click(screen.getByTestId("mock-control-button"));

    // 상태가 2번 쿼터로 변경되었는지 확인
    expect(screen.getByTestId("formation-board-list")).toHaveTextContent(
      "Current Quarter: 2",
    );
  });
});
