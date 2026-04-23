import { renderHook, act } from "@testing-library/react";

const hideModal = jest.fn();

jest.mock("../useModal", () => ({
  __esModule: true,
  default: jest.fn(() => ({ hideModal })),
}));

import { useAddressSearch } from "../useAddressSearch";

describe("useAddressSearch", () => {
  beforeEach(() => {
    hideModal.mockClear();
  });

  it("선택 후 handleComplete 시 onComplete와 hideModal을 호출한다", () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useAddressSearch({ onComplete }));

    act(() => {
      result.current.handleSelect("서울시", "code-1");
    });
    act(() => {
      result.current.handleComplete();
    });

    expect(onComplete).toHaveBeenCalledWith({
      address: "서울시",
      code: "code-1",
    });
    expect(hideModal).toHaveBeenCalledTimes(1);
  });

  it("선택 없이 handleComplete 하면 onComplete를 호출하지 않는다", () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useAddressSearch({ onComplete }));

    act(() => {
      result.current.handleComplete();
    });

    expect(onComplete).not.toHaveBeenCalled();
    expect(hideModal).not.toHaveBeenCalled();
  });
});
