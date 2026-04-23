import { render, screen, fireEvent } from "@testing-library/react";
import QuarterSelector from "../quarter/QuarterSelector";

// QuarterButton은 내부 내용을 렌더링하기만 하도록 모킹할 수도 있으나,
// 여기서는 실제 onClick이벤트를 검증하기 위해 원래 컴포넌트를 사용하거나 DOM을 통해 테스트합니다.
// button 요소를 쉽게 찾기 위해 RTL 메서드를 사용합니다.

describe("QuarterSelector 컴포넌트", () => {
  const mockSetCurrentQuarterId = jest.fn();

  const mockQuarters: any[] = [
    { id: 1, formation: "4-3-3", lineup: {}, type: "match", matchup: "home" },
    { id: 2, formation: "4-4-2", lineup: {}, type: "match", matchup: "home" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // scrollIntoView 모킹 (jsdom 지원 X)
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    // DOM에 임시 엘리먼트 추가
    const dummyBoard = document.createElement("div");
    dummyBoard.id = "quarter-board-1";
    document.body.appendChild(dummyBoard);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const setup = (currentQuarterId: number | null = null) => {
    return render(
      <QuarterSelector
        quarters={mockQuarters}
        currentQuarterId={currentQuarterId}
        setCurrentQuarterId={mockSetCurrentQuarterId}
      />,
    );
  };

  it("제공된 쿼터 수만큼 버튼이 렌더링되어야 한다", () => {
    setup();
    // 1Q, 2Q 버튼이 존재하는지 확인
    expect(screen.getByRole("button", { name: "1Q" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2Q" })).toBeInTheDocument();
  });

  it("현재 선택되지 않은 쿼터 버튼을 클릭하면 해당 쿼터 ID로 상태 변경이 트리거되어야 한다", () => {
    setup(null); // 아무것도 선택 안 된 상태
    const btn1Q = screen.getByRole("button", { name: "1Q" });

    fireEvent.click(btn1Q);

    expect(mockSetCurrentQuarterId).toHaveBeenCalledWith(1);
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
    });
  });

  it("이미 선택된 쿼터 버튼을 다시 클릭하면 선택 해제(null) 상태가 되어야 한다", () => {
    setup(2); // 2Q가 선택된 상태
    const btn2Q = screen.getByRole("button", { name: "2Q" });

    fireEvent.click(btn2Q);

    expect(mockSetCurrentQuarterId).toHaveBeenCalledWith(null);
  });
});
