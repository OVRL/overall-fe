import { render, screen } from "@testing-library/react";
import PositionChip from "../PositionChip";
import { Position } from "@/types/position";
import "@testing-library/jest-dom";

describe("PositionChip 컴포넌트", () => {
  it("포지션 텍스트가 올바르게 렌더링되어야 한다.", () => {
    const position: Position = "FW";
    render(<PositionChip position={position} />);

    const chip = screen.getByText("FW");
    expect(chip).toBeInTheDocument();
  });

  it("기본 variant는 outline이어야 한다.", () => {
    render(<PositionChip position="MF" />);

    const chip = screen.getByText("MF");
    expect(chip).toHaveClass("border-Position-MF-Green");
    expect(chip).toHaveClass("text-Position-MF-Green");
    expect(chip).not.toHaveClass("bg-Position-MF-Green");
  });

  it("filled variant가 올바르게 적용되어야 한다.", () => {
    render(<PositionChip position="DF" variant="filled" />);

    const chip = screen.getByText("DF");

    expect(chip).toHaveClass("bg-Position-DF-Blue");
    expect(chip).toHaveClass("text-white");
  });

  describe("세부 포지션 매핑 테스트", () => {
    it("ST(세부 포지션)는 FW 스타일을 따라야 한다.", () => {
      render(<PositionChip position="ST" variant="filled" />);
      const chip = screen.getByText("ST");

      expect(chip).toHaveClass("bg-Position-FW-Red");
    });

    it("CDM(세부 포지션)은 MF 스타일을 따라야 한다.", () => {
      render(<PositionChip position="CDM" variant="outline" />);
      const chip = screen.getByText("CDM");

      expect(chip).toHaveClass("text-Position-MF-Green");
    });

    it("LB(세부 포지션)는 DF 스타일을 따라야 한다.", () => {
      render(<PositionChip position="LB" variant="filled" />);
      const chip = screen.getByText("LB");

      expect(chip).toHaveClass("bg-Position-DF-Blue");
    });
  });

  it("추가적인 className이 전달되면 병합되어야 한다.", () => {
    render(
      <PositionChip
        position="GK"
        className="cursor-pointer hover:opacity-80"
      />,
    );

    const chip = screen.getByText("GK");
    expect(chip).toHaveClass("cursor-pointer");
    expect(chip).toHaveClass("hover:opacity-80");
    expect(chip).toHaveClass("border-Position-GK-Yellow");
  });
});
