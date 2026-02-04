import { render, screen, fireEvent } from "@testing-library/react";
import PhoneNumberTextField from "../onboarding/PhoneNumberTextField";

describe("PhoneNumberTextField 컴포넌트", () => {
  it("기본 props로 올바르게 렌더링 되어야 한다", () => {
    render(<PhoneNumberTextField value="" onChange={jest.fn()} />);
    expect(screen.getByLabelText("전화번호")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("전화번호를 입력해주세요."),
    ).toBeInTheDocument();
  });

  it("입력 필드에 값을 입력할 때 포맷팅이 적용되어야 한다", () => {
    const handleChange = jest.fn();
    render(<PhoneNumberTextField value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("전화번호를 입력해주세요.");

    // 01012345678 입력 시
    fireEvent.change(input, { target: { value: "01012345678" } });

    // onChange는 합성 이벤트를 받음. 여기서 핸들러 호출 여부만 확인하거나
    // 실제로는 부모 상태가 변해야 value가 변함.
    // PhoneNumberTextField 내부 handlePhoneChange에서 onChange를 호출할 때
    // 변환된 value를 담은 이벤트를 넘겨주는지 확인.

    // fireEvent.change는 동기적으로 호출됨.
    // handlePhoneChange 내부 로직 검증:
    // onChange가 호출되었는지, 그리고 그 인자의 target.value가 포맷팅되었는지 확인.
    expect(handleChange).toHaveBeenCalled();
    const event = handleChange.mock.calls[0][0];
    expect(event.target.value).toBe("010-1234-5678");
  });

  it("숫자가 아닌 문자는 제거되어야 한다", () => {
    const handleChange = jest.fn();
    render(<PhoneNumberTextField value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("전화번호를 입력해주세요.");

    fireEvent.change(input, { target: { value: "010-a-1234" } });

    const event = handleChange.mock.calls[0][0];
    // 010a1234 -> 0101234 -> 010-1234
    expect(event.target.value).toBe("010-1234");
  });
});
