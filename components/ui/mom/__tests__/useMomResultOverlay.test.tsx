import { renderHook, act } from "@testing-library/react";
import { useMomResultOverlay } from "../useMomResultOverlay";
import { useMomResultOverlayStore } from "../momResultOverlayStore";
import type { GachaCardProps } from "../GachaCard";

const sampleCandidates: GachaCardProps[] = [
  {
    id: 1,
    name: "A",
    position: "ST",
    number: 9,
    profileImage: "/a.webp",
  },
];

function resetStore() {
  useMomResultOverlayStore.setState({
    isOpen: false,
    candidates: [],
    sessionId: 0,
  });
}

describe("useMomResultOverlay", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it("빈 배열로 open 하면 스토어가 바뀌지 않는다", () => {
    const { result } = renderHook(() => useMomResultOverlay());
    act(() => {
      result.current.open([]);
    });
    expect(useMomResultOverlayStore.getState().isOpen).toBe(false);
    expect(useMomResultOverlayStore.getState().candidates).toEqual([]);
  });

  it("open 후 isOpen이 true이고 close 후 false가 된다", () => {
    const { result } = renderHook(() => useMomResultOverlay());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open(sampleCandidates);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
