import { render, screen } from "@testing-library/react";
import StatsCell from "../StatsCell";

describe("StatsCell 컴포넌트", () => {
  it("기본 값을 올바르게 렌더링해야 한다", () => {
    render(
      <table>
        <tbody>
          <tr>
            <StatsCell value={10} highlight={false} />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("highlight가 false일 때 기본 스타일(text-Label-Tertiary)을 가져야 한다", () => {
    render(
      <table>
        <tbody>
          <tr>
            <StatsCell value={10} highlight={false} />
          </tr>
        </tbody>
      </table>,
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("text-Label-Tertiary");
    expect(cell).not.toHaveClass("text-primary");
  });

  it("highlight가 true일 때 강조 스타일(text-primary font-bold)을 가져야 한다", () => {
    render(
      <table>
        <tbody>
          <tr>
            <StatsCell value={10} highlight={true} />
          </tr>
        </tbody>
      </table>,
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("text-primary");
    expect(cell).toHaveClass("font-bold");
  });
});
