import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormSection from "../../components/FormSection";

describe("FormSection", () => {
  it("label을 렌더링한다", () => {
    render(<FormSection label="경기 일시">내용</FormSection>);
    expect(screen.getByText("경기 일시")).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(
      <FormSection label="섹션">
        <input data-testid="child-input" />
      </FormSection>,
    );
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  it("className이 적용된다", () => {
    const { container } = render(
      <FormSection label="라벨" className="custom-class">
        내용
      </FormSection>,
    );
    const section = container.firstChild as HTMLElement;
    expect(section.className).toContain("custom-class");
  });
});
