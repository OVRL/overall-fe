import { renderHook, act } from "@testing-library/react";
import useEditProfileImage from "../hooks/useEditProfileImage";
import { createImage } from "@/utils/canvasUtils";
import { ProfileImageCanvasHandle } from "../ProfileImageCanvas";

// 캔버스 유틸 모킹
jest.mock("@/utils/canvasUtils", () => ({
  __esModule: true,
  default: jest.fn(),
  createImage: jest.fn(),
}));

// ProfileImageCanvas 모킹
jest.mock("../ProfileImageCanvas", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

// Mock useRemoveBackgroundMutation
jest.mock("../hooks/useRemoveBackgroundMutation", () => ({
  useRemoveBackgroundMutation: jest.fn(() => [
    jest.fn((config) => {
      // Simulate success
      if (config.onCompleted) {
        config.onCompleted({
          removeBackground: { image: "processed-image.png" },
        });
      }
    }),
    false,
  ]),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");

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

    const file = new File(["dummy content"], "test.png", {
      type: "image/webp",
    });
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
    expect(result.current.currentImage).toBe("mock-url");
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

  it("배경 제거를 되돌릴 수 있어야 한다", async () => {
    const { result } = renderHook(() =>
      useEditProfileImage({
        initialImage: "initial-image.png",
        onSave: jest.fn(),
      }),
    );

    // 1. 파일 변경 (이미지 로드)
    const file = new File(["dummy content"], "test.png", {
      type: "image/webp",
    });
    act(() => {
      result.current.handleFileChange({
        target: { files: [file], value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    // 2. 배경 제거 요청
    // We need to mock canvasRef.current.getCroppedImage
    const mockGetCroppedImage = jest
      .fn()
      .mockResolvedValue(new Blob(["blob"], { type: "image/webp" }));

    // Define a partial mock type to avoid 'any'
    const mockCanvasRefCurrent = {
      getCroppedImage: mockGetCroppedImage,
    } as unknown as ProfileImageCanvasHandle;

    if (result.current.canvasRef && "current" in result.current.canvasRef) {
      (
        result.current
          .canvasRef as React.MutableRefObject<ProfileImageCanvasHandle | null>
      ).current = mockCanvasRefCurrent;
    }

    await act(async () => {
      await result.current.handleRemoveBackground();
    });

    expect(result.current.isBackgroundRemoved).toBe(true);
    expect(result.current.currentImage).toBe("processed-image.png");

    // 3. 되돌리기 (Undo)
    act(() => {
      result.current.handleUndoBackgroundRemoval();
    });

    expect(result.current.isBackgroundRemoved).toBe(false);
    expect(result.current.currentImage).toBe("mock-url"); // Restored to original mocked URL
  });

  it("배경이 제거된 상태에서 저장 시 WebP 형식으로 변환하여 onSave를 호출해야 한다", async () => {
    const { result } = renderHook(() =>
      useEditProfileImage({ initialImage, onSave: mockOnSave }),
    );

    // 1. 배경 제거 상태로 만들기
    // handleRemoveBackground를 호출하여 상태를 변경
    const mockGetCroppedImage = jest
      .fn()
      .mockResolvedValue(new Blob(["blob"], { type: "image/png" }));

    const mockCanvasRefCurrent = {
      getCroppedImage: mockGetCroppedImage,
    } as unknown as ProfileImageCanvasHandle;

    if (result.current.canvasRef && "current" in result.current.canvasRef) {
      (
        result.current
          .canvasRef as React.MutableRefObject<ProfileImageCanvasHandle | null>
      ).current = mockCanvasRefCurrent;
    }

    await act(async () => {
      await result.current.handleRemoveBackground();
    });

    expect(result.current.isBackgroundRemoved).toBe(true);

    // 2. createImage 및 canvas 모킹
    const mockImage = { width: 100, height: 100 };
    (createImage as jest.Mock).mockResolvedValue(mockImage);

    const mockCtx = {
      drawImage: jest.fn(),
    };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockCtx),
      toBlob: jest.fn((callback) => {
        callback(new Blob(["webp content"], { type: "image/webp" }));
      }),
    };
    jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") return mockCanvas as any;
      return document.createElement(tagName);
    });

    // 3. 저장 (handleSave)
    await act(async () => {
      await result.current.handleSave();
    });

    // 4. 검증
    expect(createImage).toHaveBeenCalledWith("processed-image.png");
    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
    expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImage, 0, 0);
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/webp",
    );
    expect(mockOnSave).toHaveBeenCalledWith(
      "processed-image.png",
      expect.any(File),
    );

    const savedFile = mockOnSave.mock.calls[0][1];
    expect(savedFile.type).toBe("image/webp");
    expect(savedFile.name).toContain(".webp");
  });
});
