import { render, screen, fireEvent } from "@testing-library/react";
import PhoneNumberCollect from "../PhoneNumberCollect";
import "@testing-library/jest-dom";

describe("PhoneNumberCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본적으로 올바르게 렌더링되어야 한다.", () => {
    render(<PhoneNumberCollect {...defaultProps} />);
    
    expect(screen.getByText("전화번호를 알려주세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("전화번호")).toBeInTheDocument();
    
    // 버튼은 초기 상태에서 비활성화 (전화번호 없음)
    const nextButton = screen.getByRole("button", { name: "인증번호 받기" });
    expect(nextButton).toBeDisabled();
  });

  it("기존 데이터(data.phone)가 있으면 초기값으로 설정되어야 한다.", () => {
    render(<PhoneNumberCollect {...defaultProps} data={{ phone: "010-1234-5678" }} />);
    
    expect(screen.getByLabelText("전화번호")).toHaveValue("010-1234-5678");
    const nextButton = screen.getByRole("button", { name: "인증번호 받기" });
    expect(nextButton).toBeEnabled();
  });

  it("유효한 전화번호를 입력하면 버튼이 활성화되어야 한다.", () => {
    render(<PhoneNumberCollect {...defaultProps} />);
    
    const input = screen.getByLabelText("전화번호");
    const nextButton = screen.getByRole("button", { name: "인증번호 받기" });
    
    // PhoneNumberTextField 내부 로직에 의해 하이픈이 자동 추가됨을 가정하지만,
    // fireEvent.change는 직접 value를 주입하므로 포맷팅된 값을 넣어주어야 함 (실제 동작 시뮬레이션 한계)
    // 혹은 PhoneNumberTextField가 onChange에서 포맷팅해서 부모 state를 업데이트하므로,
    // 테스트에서는 '010-1234-5678'이라는 최종 결과값이 입력된 것처럼 이벤트를 발생시켜야 함.
    
    // Note: PhoneNumberTextField relies on internal formatting on change. 
    // If we fire change with raw value, the component's handlePhoneChange logic runs.
    fireEvent.change(input, { target: { value: "01012345678" } });
    
    // 상태 업데이트 후 리렌더링 반영 확인
    // PhoneNumberTextField의 onChange 로직이 실행되어 포맷팅된 값이 value로 들어감
    expect(input).toHaveValue("010-1234-5678");
    expect(nextButton).toBeEnabled();
  });

  it("유효하지 않은 전화번호(짧음) 입력 시 버튼이 비활성화되어야 한다.", () => {
    render(<PhoneNumberCollect {...defaultProps} />);
    
    const input = screen.getByLabelText("전화번호");
    const nextButton = screen.getByRole("button", { name: "인증번호 받기" });
    
    fireEvent.change(input, { target: { value: "010123" } });
    
    expect(nextButton).toBeDisabled();
  });

  it("다음 버튼 클릭 시 하이픈을 제거한 번호를 저장하고 onNext를 호출해야 한다.", () => {
    render(<PhoneNumberCollect {...defaultProps} />);
    
    const input = screen.getByLabelText("전화번호");
    fireEvent.change(input, { target: { value: "01012345678" } });
    
    const nextButton = screen.getByRole("button", { name: "인증번호 받기" });
    fireEvent.click(nextButton);
    
    // 구현 코드에서 mockOnDataChange((prev) => ...) 형태이고, 
    // cleanPhoneNumber ("01012345678")를 저장함.
    // mockOnDataChange 호출 인자를 검증.
    expect(mockOnDataChange).toHaveBeenCalled();
    // 함수형 업데이트인지 직접 값인지에 따라 검증이 다를 수 있으나, 보통 호출 여부를 먼저 확인.
    // 여기서는 onNext 호출이 중요.
    expect(mockOnNext).toHaveBeenCalled();
    
    // onDataChange에 전달된 콜백을 실행해보거나 mock.calls 확인
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const newData = updateFn({});
    expect(newData).toEqual({ phone: "01012345678" });
  });
});
