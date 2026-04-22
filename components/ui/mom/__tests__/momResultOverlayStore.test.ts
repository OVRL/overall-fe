import { useMomResultOverlayStore } from "../momResultOverlayStore";
import type { GachaCardProps } from "../GachaCard";

const sampleCandidates: GachaCardProps[] = [
  {
    id: 1,
    name: "테스트",
    position: "CM",
    number: 10,
    profileImage: "/x.webp",
  },
];

function resetStore() {
  useMomResultOverlayStore.setState({
    isOpen: false,
    candidates: [],
    sessionId: 0,
  });
}

describe("useMomResultOverlayStore", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it("초기 상태는 닫혀 있고 후보는 비어 있다", () => {
    const s = useMomResultOverlayStore.getState();
    expect(s.isOpen).toBe(false);
    expect(s.candidates).toEqual([]);
    expect(s.sessionId).toBe(0);
  });

  it("open 시 isOpen·candidates가 설정되고 sessionId가 증가한다", () => {
    useMomResultOverlayStore.getState().open(sampleCandidates);
    const s = useMomResultOverlayStore.getState();
    expect(s.isOpen).toBe(true);
    expect(s.candidates).toEqual(sampleCandidates);
    expect(s.sessionId).toBe(1);
  });

  it("open을 연속 호출하면 sessionId가 매번 증가한다", () => {
    const { open } = useMomResultOverlayStore.getState();
    open(sampleCandidates);
    expect(useMomResultOverlayStore.getState().sessionId).toBe(1);
    open(sampleCandidates);
    expect(useMomResultOverlayStore.getState().sessionId).toBe(2);
  });

  it("close 시 isOpen만 false가 되고 candidates는 유지된다", () => {
    const { open, close } = useMomResultOverlayStore.getState();
    open(sampleCandidates);
    close();
    const s = useMomResultOverlayStore.getState();
    expect(s.isOpen).toBe(false);
    expect(s.candidates).toEqual(sampleCandidates);
  });
});
