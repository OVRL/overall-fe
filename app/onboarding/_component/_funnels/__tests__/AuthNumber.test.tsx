import { render, screen, fireEvent } from "@testing-library/react";
import AuthNumber from "../AuthNumber";
import "@testing-library/jest-dom";

describe("AuthNumber", () => {
  it("기본적으로 올바르게 렌더링되어야 한다.", () => {
    render(<AuthNumber />);
    expect(screen.getByText(/인증번호를 입력해주세요/)).toBeInTheDocument();
    expect(screen.getByLabelText("인증번호")).toBeInTheDocument();
  });

  it("인증번호 입력 시 버튼이 활성화되어야 한다.", () => {
    render(<AuthNumber />);
    const input = screen.getByLabelText("인증번호");
    const button = screen.getByRole("button", { name: "인증완료" });

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "123456" } });
    expect(input).toHaveValue(123456); // type=number input returns number value usually, but string in DOM
    expect(button).toBeEnabled();
  });
});
