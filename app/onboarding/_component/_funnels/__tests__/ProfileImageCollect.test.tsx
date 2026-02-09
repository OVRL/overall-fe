import { render, screen, fireEvent } from "@testing-library/react";
import ProfileImageCollect from "../ProfileImageCollect";
import "@testing-library/jest-dom";
import { OnboardingStepProps } from "@/types/onboarding";

// Mock implementation for ImageUploader
// We expose a helper to trigger file selection if needed, or just simulate interacting with a simple mock.
jest.mock("@/components/ImageUploader", () => {
  const MockImageUploader = ({
    onFileSelect,
  }: {
    onFileSelect: (file: File) => void;
  }) => (
    <div data-testid="mock-uploader">
      <button
        onClick={() =>
          onFileSelect(
            new File(["(⌐□_□)"], "profile.png", { type: "image/png" }),
          )
        }
      >
        Upload File
      </button>
    </div>
  );
  MockImageUploader.displayName = "MockImageUploader";
  return MockImageUploader;
});

describe("ProfileImageCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps: OnboardingStepProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 확인", () => {
    render(<ProfileImageCollect {...defaultProps} />);
    expect(
      screen.getByText(/프로필 이미지를 등록해주세요/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-uploader")).toBeInTheDocument();

    // Button initially enabled (default image)
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
  });

  it("이미지 업로드 시 다음 버튼 활성화 및 진행", () => {
    render(<ProfileImageCollect {...defaultProps} />);

    // Click mock uploader button to trigger onFileSelect
    fireEvent.click(screen.getByText("Upload File"));

    // Now profileImage state should be set to the mock URL
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();
    const updateFn = mockOnDataChange.mock.calls[0][0];
    expect(updateFn({})).toEqual({
      profileImage: "blob:mock-url",
    });
    expect(mockOnNext).toHaveBeenCalled();
  });
});
