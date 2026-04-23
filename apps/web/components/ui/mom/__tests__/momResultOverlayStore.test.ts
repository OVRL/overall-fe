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
    isFetching: false,
    candidates: [],
    sessionId: 0,
    request: null,
    requestId: 0,
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
    useMomResultOverlayStore.getState().openWithCandidates(sampleCandidates);
    const s = useMomResultOverlayStore.getState();
    expect(s.isOpen).toBe(true);
    expect(s.candidates).toEqual(sampleCandidates);
    expect(s.sessionId).toBe(1);
  });

  it("open을 연속 호출하면 sessionId가 매번 증가한다", () => {
    const { openWithCandidates } = useMomResultOverlayStore.getState();
    openWithCandidates(sampleCandidates);
    expect(useMomResultOverlayStore.getState().sessionId).toBe(1);
    openWithCandidates(sampleCandidates);
    expect(useMomResultOverlayStore.getState().sessionId).toBe(2);
  });

  it("close 시 isOpen만 false가 되고 candidates는 유지된다", () => {
    const { openWithCandidates, close } = useMomResultOverlayStore.getState();
    openWithCandidates(sampleCandidates);
    close();
    const s = useMomResultOverlayStore.getState();
    expect(s.isOpen).toBe(false);
    expect(s.candidates).toEqual(sampleCandidates);
  });

  it("openByMatch는 candidates를 비우고 request를 설정한다", () => {
    useMomResultOverlayStore
      .getState()
      .openByMatch({ matchId: 1, teamId: 2 });
    const s = useMomResultOverlayStore.getState();
    // openByMatch는 fetching만 트리거하고, 성공했을 때만 openWithCandidates로 오버레이가 열린다.
    expect(s.isOpen).toBe(false);
    expect(s.candidates).toEqual([]);
    expect(s.request).toEqual({ matchId: 1, teamId: 2 });
    expect(s.requestId).toBe(1);
  });

  it("openByMatch는 같은 요청을 fetching 중이면 중복 requestId 증가를 막는다", () => {
    useMomResultOverlayStore
      .getState()
      .openByMatch({ matchId: 1, teamId: 2 });
    expect(useMomResultOverlayStore.getState().isFetching).toBe(true);
    expect(useMomResultOverlayStore.getState().requestId).toBe(1);

    useMomResultOverlayStore
      .getState()
      .openByMatch({ matchId: 1, teamId: 2 });
    expect(useMomResultOverlayStore.getState().requestId).toBe(1);
  });
});
