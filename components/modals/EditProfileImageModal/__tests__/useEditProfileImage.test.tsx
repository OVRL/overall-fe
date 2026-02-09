import { renderHook, act } from "@testing-library/react";
import useEditProfileImage from "../useEditProfileImage";

// 캔버스 유틸 모킹
jest.mock("@/utils/canvasUtils", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// ProfileImageCanvas 모킹
jest.mock("../ProfileImageCanvas", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe("useEditProfileImage", () => {
  const initialImage = "test-image.jpg";
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initialImage로 초기화되어야 한다", () => {
    const { result } = renderHook(() =>
      useEditProfileImage({ initialImage, onSave: mockOnSave }),
    );
    expect(result.current.currentImage).toBe(initialImage);
  });

  it("파일 변경을 처리해야 한다", () => {
    const { result } = renderHook(() =>
      useEditProfileImage({ initialImage, onSave: mockOnSave }),
    );

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const event = {
      target: {
        files: [file],
        value: "test.png",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(result.current.currentImage).toBe("blob:mock-url");
    expect(event.target.value).toBe("");
  });

  it("파일 입력 클릭을 트리거해야 한다", () => {
    const { result } = renderHook(() =>
      useEditProfileImage({ initialImage, onSave: mockOnSave }),
    );

    const clickMock = jest.fn();
    (
      result.current
        .fileInputRef as React.MutableRefObject<HTMLInputElement | null>
    ).current = {
      click: clickMock,
    } as unknown as HTMLInputElement;

    act(() => {
      result.current.handleFileClick();
    });

    expect(clickMock).toHaveBeenCalled();
  });
});
