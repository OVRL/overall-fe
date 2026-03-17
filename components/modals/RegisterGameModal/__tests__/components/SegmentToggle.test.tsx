import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SegmentToggle from "../../components/SegmentToggle";

const options = [
  { value: "INTERNAL", label: "내전" },
  { value: "MATCH", label: "매칭" },
] as const;

describe("SegmentToggle", () => {
  it("모든 옵션 라벨을 렌더링한다", () => {
    const onChange = jest.fn();
    render(
      <SegmentToggle
        options={options}
        value="INTERNAL"
        onChange={onChange}
      />,
    );
    expect(screen.getByText("내전")).toBeInTheDocument();
    expect(screen.getByText("매칭")).toBeInTheDocument();
  });

  it("옵션 클릭 시 onChange에 해당 value를 전달한다", () => {
    const onChange = jest.fn();
    render(
      <SegmentToggle
        options={options}
        value="INTERNAL"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("매칭"));
    expect(onChange).toHaveBeenCalledWith("MATCH");
  });
});
