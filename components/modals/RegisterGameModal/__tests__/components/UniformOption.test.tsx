import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UniformOption from "../../components/UniformOption";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="uniform-image" />
  ),
}));

describe("UniformOption", () => {
  it("label을 렌더링한다", () => {
    render(
      <UniformOption
        type="HOME"
        label="홈"
        isSelected={false}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText("홈")).toBeInTheDocument();
  });

  it("클릭 시 onSelect가 호출된다", () => {
    const onSelect = jest.fn();
    render(
      <UniformOption
        type="HOME"
        label="홈"
        isSelected={false}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText("홈"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("imagePath가 있으면 이미지를 렌더링한다", () => {
    render(
      <UniformOption
        type="HOME"
        label="홈"
        isSelected={false}
        onSelect={jest.fn()}
        imagePath="/icons/uniforms/solid_red.webp"
      />,
    );
    expect(screen.getByTestId("uniform-image")).toBeInTheDocument();
    expect(screen.getByTestId("uniform-image")).toHaveAttribute(
      "src",
      expect.stringContaining("solid_red"),
    );
  });
});
