import { renderHook, act } from "@testing-library/react";
import useEditProfileImage from "../useEditProfileImage";

// Mock canvas utils
jest.mock("@/utils/canvasUtils", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock ProfileImageCanvas
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
    global.URL.createObjectURL = jest.fn(() => "blob:test-url");
  });

  it("should initialize with initialImage", () => {
    const { result } = renderHook(() =>
      useEditProfileImage({ initialImage, onSave: mockOnSave }),
    );
    expect(result.current.currentImage).toBe(initialImage);
  });

  it("should handle file change", () => {
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
    expect(result.current.currentImage).toBe("blob:test-url");
    expect(event.target.value).toBe("");
  });

  it("should trigger file input click", () => {
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
