import { render, screen } from "@testing-library/react";
import FootIcon from "../season-record/FootIcon";

describe("FootIcon 컴포넌트", () => {
  it("왼발잡이('L')일 때 올바른 레이블과 활성 상태를 가져야 한다", () => {
    render(<FootIcon foot="L" />);

    const container = screen.getByRole("img", { name: "왼발잡이" });
    expect(container).toBeInTheDocument();

    const leftFoot = screen.getByText("L").closest("svg");
    const rightFoot = screen.getByText("R").closest("svg");

    expect(leftFoot).toHaveClass("text-green-500");
    expect(rightFoot).toHaveClass("text-gray-600");
  });

  it("오른발잡이('R')일 때 올바른 레이블과 활성 상태를 가져야 한다", () => {
    render(<FootIcon foot="R" />);

    const container = screen.getByRole("img", { name: "오른발잡이" });
    expect(container).toBeInTheDocument();

    const leftFoot = screen.getByText("L").closest("svg");
    const rightFoot = screen.getByText("R").closest("svg");

    expect(leftFoot).toHaveClass("text-gray-600");
    expect(rightFoot).toHaveClass("text-green-500");
  });

  it("양발잡이('B')일 때 올바른 레이블과 두 발 모두 활성 상태여야 한다", () => {
    render(<FootIcon foot="B" />);

    const container = screen.getByRole("img", { name: "양발잡이" });
    expect(container).toBeInTheDocument();

    const leftFoot = screen.getByText("L").closest("svg");
    const rightFoot = screen.getByText("R").closest("svg");

    expect(leftFoot).toHaveClass("text-green-500");
    expect(rightFoot).toHaveClass("text-green-500");
  });
});
