import { render, screen, fireEvent } from "@testing-library/react";
import PlayerTableHeader from "../PlayerTableHeader";
import {
  PLAYER_TABLE_COLUMNS,
  SORTABLE_COLUMN_KEYS,
} from "../../../_constants/playerTableColumns";

describe("PlayerTableHeader 컴포넌트", () => {
  const mockOnSort = jest.fn();

  it("모든 컬럼 헤더가 렌더링되어야 한다", () => {
    render(
      <table>
        <PlayerTableHeader />
      </table>,
    );

    PLAYER_TABLE_COLUMNS.forEach((col) => {
      expect(screen.getByText(col.key)).toBeInTheDocument();
    });
  });

  it("정렬 가능한 컬럼 클릭 시 onSort 콜백이 호출되어야 한다", () => {
    render(
      <table>
        <PlayerTableHeader onSort={mockOnSort} />
      </table>,
    );

    // 정렬 가능한 첫 번째 컬럼 찾기 (예: '선수명' 혹은 'OVR' 등)
    const sortableKey = Array.from(SORTABLE_COLUMN_KEYS)[0];
    const header = screen.getByText(sortableKey);

    fireEvent.click(header);
    expect(mockOnSort).toHaveBeenCalledWith(sortableKey);
  });

  it("현재 정렬된 컬럼에 방향 표시기(▲/▼)가 나타나야 한다", () => {
    const sortableKey = Array.from(SORTABLE_COLUMN_KEYS)[0];

    const { rerender } = render(
      <table>
        <PlayerTableHeader
          sortConfig={{ key: sortableKey, direction: "asc" }}
        />
      </table>,
    );
    expect(screen.getByText("▲")).toBeInTheDocument();

    rerender(
      <table>
        <PlayerTableHeader
          sortConfig={{ key: sortableKey, direction: "desc" }}
        />
      </table>,
    );
    expect(screen.getByText("▼")).toBeInTheDocument();
  });
});
