import { fireEvent, render, screen } from "@testing-library/react";
import TeamButton from "../TeamButton";

describe("TeamButton", () => {
  it("팀 이름과 라디오 역할을 노출한다", () => {
    render(<TeamButton name="테스트 FC" selected={false} />);

    expect(screen.getByRole("radio", { name: /테스트 FC/ })).toBeInTheDocument();
  });

  it("선택 상태에 따라 aria-checked를 반영한다", () => {
    render(<TeamButton name="A" selected />);

    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
  });

  it("클릭 시 onClick을 호출한다", () => {
    const onClick = jest.fn();
    render(<TeamButton name="B" onClick={onClick} />);

    fireEvent.click(screen.getByRole("radio"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
