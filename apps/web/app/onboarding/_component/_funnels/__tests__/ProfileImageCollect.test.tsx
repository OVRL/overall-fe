import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileImageCollect from "../ProfileImageCollect";
import "@testing-library/jest-dom";
import { OnboardingStepProps } from "@/types/onboarding";

// Mock implementation for ImageUploader
jest.mock("@/components/ImageUploader", () => {
  const MockImageUploader = ({
    onFileSelect,
    onDefaultImageSelect,
  }: {
    onFileSelect: (file: File) => void;
    onDefaultImageSelect: (image: string) => void;
  }) => (
    <div data-testid="mock-uploader">
      <button
        onClick={() =>
          onFileSelect(
            new File(["(⌐□_□)"], "profile.webp", { type: "image/webp" }),
          )
        }
      >
        Upload File
      </button>
      <button onClick={() => onDefaultImageSelect("/images/default.png")}>
        Select Default
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
    data: {
      name: "Test Player",
      mainPosition: "FW",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve(new Blob(["(⌐□_□)"], { type: "image/webp" })),
        headers: new Headers(),
        ok: true,
        status: 200,
      }),
    ) as jest.Mock;
  });

  it("기본 렌더링 확인", async () => {
    render(<ProfileImageCollect {...defaultProps} />);
    expect(
      screen.getByText(/프로필 이미지를 등록해주세요/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-uploader")).toBeInTheDocument();

    // 초기 상태에서는 파일이 선택되지 않아 버튼이 비활성화됨
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeDisabled();
  });

  it("이미지 업로드 시 다음 버튼 활성화 및 진행", async () => {
    render(<ProfileImageCollect {...defaultProps} />);

    // Click mock uploader button to trigger onFileSelect
    fireEvent.click(screen.getByText("Upload File"));

    // Now profileImage state should be set to the mock URL and file
    const nextButton = screen.getByRole("button", { name: "다음" });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });

    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();

    // Verify the update function callback
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const prevState = {};
    const newState = updateFn(prevState);

    expect(newState).toEqual({
      profileImage: "blob:mock-url",
      profileImageFile: expect.any(File),
    });
    expect(mockOnNext).toHaveBeenCalled();
  });
});
