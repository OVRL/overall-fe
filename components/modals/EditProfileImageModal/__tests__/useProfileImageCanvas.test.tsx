import { renderHook, act } from "@testing-library/react";
import useProfileImageCanvas from "../hooks/useProfileImageCanvas";
import getCroppedImg from "@/utils/canvasUtils";

// util 모킹
jest.mock("@/utils/canvasUtils");

describe("useProfileImageCanvas", () => {
  const initialProps = {
    imageSrc: "test-image.jpg",
    isAnimating: false,
    onAnimationComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("초기 상태가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => useProfileImageCanvas(initialProps));

    expect(result.current.crop).toEqual({ x: 0, y: 0 });
    expect(result.current.zoom).toBe(1);
    expect(result.current.isLoaded).toBe(false);
  });

  it("setCrop 호출 시 crop 상태가 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useProfileImageCanvas(initialProps));

    act(() => {
      result.current.setCrop({ x: 10, y: 10 });
    });

    expect(result.current.crop).toEqual({ x: 10, y: 10 });
  });

  it("getCroppedImage 호출 시 getCroppedImg 유틸 함수가 호출되어야 한다", async () => {
    const { result } = renderHook(() => useProfileImageCanvas(initialProps));
    const mockCroppedAreaPixels = { x: 0, y: 0, width: 100, height: 100 };

    // 먼저 cropComplete를 호출하여 areaPixels 설정
    act(() => {
      result.current.onCropComplete(
        { x: 0, y: 0, width: 100, height: 100 },
        mockCroppedAreaPixels,
      );
    });

    await act(async () => {
      await result.current.getCroppedImage();
    });

    expect(getCroppedImg).toHaveBeenCalledWith(
      initialProps.imageSrc,
      mockCroppedAreaPixels,
    );
  });

  it("애니메이션이 활성화되고 이미지가 로드되면 500ms 후 완료 콜백이 호출되어야 한다", () => {
    const onAnimationComplete = jest.fn();
    const { result } = renderHook(() =>
      useProfileImageCanvas({
        ...initialProps,
        isAnimating: true,
        onAnimationComplete,
      }),
    );

    act(() => {
      result.current.handleMediaLoaded();
    });

    expect(result.current.isLoaded).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onAnimationComplete).toHaveBeenCalled();
    expect(result.current.isLoaded).toBe(false);
  });
});
