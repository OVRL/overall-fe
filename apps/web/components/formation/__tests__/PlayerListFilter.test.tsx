import { render, screen, fireEvent } from "@testing-library/react";
import PlayerListFilter from "../player-list/PlayerListFilter";

describe("PlayerListFilter 컴포넌트", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnPosTabChange = jest.fn();

  const defaultProps = {
    searchTerm: "",
    onSearchChange: mockOnSearchChange,
    activePosTab: "전체",
    onPosTabChange: mockOnPosTabChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 UI 요소들(제목, 탭 목록)을 올바르게 렌더링해야 한다", () => {
    render(<PlayerListFilter {...defaultProps} />);

    expect(screen.getByText("선수 명단")).toBeInTheDocument();

    const tabs = ["전체", "FW", "MF", "DF", "GK"];
    tabs.forEach((tab) => {
      // AssistiveChip이 div로 렌더링되므로 텍스트로 조회
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it("탭을 클릭하면 onPosTabChange가 호출되어야 한다", () => {
    render(<PlayerListFilter {...defaultProps} />);

    const fwTab = screen.getByText("FW");
    fireEvent.click(fwTab);

    expect(mockOnPosTabChange).toHaveBeenCalledWith("FW");
  });
});
