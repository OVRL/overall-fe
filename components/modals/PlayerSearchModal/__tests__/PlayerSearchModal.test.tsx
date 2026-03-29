import { render, screen, fireEvent } from "@testing-library/react";
import PlayerSearchModal from "../PlayerSearchModal";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";

jest.mock("@/hooks/usePlayerSearch", () => ({
  usePlayerSearch: jest.fn(),
}));

jest.mock("../SearchInputSection", () => {
  return function MockSearchInputSection() {
    return <div data-testid="search-input" />;
  };
});

jest.mock("../PlayerListSection", () => {
  return function MockPlayerListSection() {
    return <div data-testid="player-list" />;
  };
});

// ModalLayout은 단순히 children을 렌더링하도록 모킹
jest.mock("../../ModalLayout", () => {
  return function MockModalLayout({ children, title }: any) {
    return (
      <div data-testid="modal-layout" title={title}>
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

jest.mock("@/components/ui/Button", () => {
  return function MockButton({ children, onClick, disabled }: any) {
    return (
      <button data-testid="complete-btn" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  };
});

describe("PlayerSearchModal", () => {
  const mockHandleComplete = jest.fn();
  const mockSetInputValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePlayerSearch as jest.Mock).mockReturnValue({
      inputValue: "",
      setInputValue: mockSetInputValue,
      debouncedKeyword: "",
      searchResults: [],
      pendingChanges: new Map(),
      mercenaryPlayer: null,
      isSearching: false,
      handleToggleAttendance: jest.fn(),
      handleComplete: mockHandleComplete,
    });
  });

  const defaultProps = {
    matchId: 1,
    teamId: 1,
  };

  it("모달 레이아웃, 검색 입력, 선수 목록 및 완료 버튼이 렌더링되어야 한다", () => {
    render(<PlayerSearchModal {...defaultProps} />);

    expect(screen.getByTestId("modal-layout")).toBeInTheDocument();
    expect(screen.getByText("선수 검색")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("player-list")).toBeInTheDocument();
    expect(screen.getByTestId("complete-btn")).toBeInTheDocument();
  });

  it("pendingChanges가 비어있을 때 완료 버튼은 비활성화되고 텍스트는 '완료'여야 한다", () => {
    render(<PlayerSearchModal {...defaultProps} />);

    const btn = screen.getByTestId("complete-btn");
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("완료");
  });

  it("pendingChanges에 데이터가 있을 때 완료 버튼은 활성화되고 변경된 인원 수를 표시해야 한다", () => {
    const changesMap = new Map();
    changesMap.set(1, { currentStatus: "ATTEND" });
    changesMap.set(2, { currentStatus: "ABSENT" });

    (usePlayerSearch as jest.Mock).mockReturnValue({
      inputValue: "",
      setInputValue: mockSetInputValue,
      debouncedKeyword: "",
      searchResults: [],
      pendingChanges: changesMap,
      mercenaryPlayer: null,
      isSearching: false,
      handleToggleAttendance: jest.fn(),
      handleComplete: mockHandleComplete,
    });

    render(<PlayerSearchModal {...defaultProps} />);

    const btn = screen.getByTestId("complete-btn");
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveTextContent("완료 (2명 변경)");
  });

  it("완료 버튼 클릭 시 handleComplete 콜백이 실행되어야 한다", () => {
    const changesMap = new Map();
    changesMap.set(1, { currentStatus: "ATTEND" });

    (usePlayerSearch as jest.Mock).mockReturnValue({
      inputValue: "",
      setInputValue: mockSetInputValue,
      debouncedKeyword: "",
      searchResults: [],
      pendingChanges: changesMap,
      mercenaryPlayer: null,
      isSearching: false,
      handleToggleAttendance: jest.fn(),
      handleComplete: mockHandleComplete,
    });

    render(<PlayerSearchModal {...defaultProps} />);

    const btn = screen.getByTestId("complete-btn");
    fireEvent.click(btn);

    expect(mockHandleComplete).toHaveBeenCalledTimes(1);
  });
});
