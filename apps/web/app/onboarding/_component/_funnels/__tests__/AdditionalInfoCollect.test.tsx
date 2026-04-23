import { render, screen, fireEvent, act } from "@testing-library/react";
import AdditionalInfoCollect from "../AdditionalInfoCollect";
import "@testing-library/jest-dom";

// Mock mutating hook
const mockCommit = jest.fn();
jest.mock("../../../_hooks/useModifyUserMutation", () => ({
  useModifyUserMutation: () => [mockCommit, false],
}));

// Mock useModal
const mockOpenModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    openModal: mockOpenModal,
    hideModal: jest.fn(),
  }),
}));

describe("AdditionalInfoCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: {
      id: 1,
      profileImageFile: new File(["(⌐□_□)"], "profile.webp", {
        type: "image/webp",
      }),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 및 유효성 검사 (버튼 비활성화)", () => {
    render(<AdditionalInfoCollect {...defaultProps} />);
    expect(screen.getByText(/추가 정보를/)).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: "완료하기" });
    expect(nextButton).toBeDisabled(); // fields empty
  });

  it("모든 정보 입력 시 다음 버튼 활성화 및 제출", async () => {
    render(<AdditionalInfoCollect {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "완료하기" });

    // 1. 활동지역 - Click triggers Modal
    const areaInput = screen.getByPlaceholderText("주소검색");
    fireEvent.click(areaInput);
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    // Simulate address selection via callback passed to openModal
    const modalProps = mockOpenModal.mock.calls[0][0];
    // Assuming ADDRESS_SEARCH props: { onComplete: (address) => void }
    if (modalProps && modalProps.onComplete) {
      act(() => {
        modalProps.onComplete({ address: "서울", code: "1111111111" });
      });
    }

    // 3. 선호하는 등번호
    const numInput = screen.getByLabelText("선호하는 등번호");
    fireEvent.change(numInput, { target: { value: "7" } });

    // 4. 좋아하는 선수
    const playerInput = screen.getByLabelText("좋아하는 선수");
    fireEvent.change(playerInput, { target: { value: "손흥민" } });

    // Now all filled?
    expect(nextButton).toBeEnabled();

    // Submit
    fireEvent.click(nextButton);

    // Verify mutation called
    expect(mockCommit).toHaveBeenCalled();
  });
});
