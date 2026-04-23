import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import MomResultOverlayHost from "../MomResultOverlayHost";
import { useMomResultOverlayStore } from "../momResultOverlayStore";
import type { GachaCardProps } from "../GachaCard";

jest.mock("../MomOverlay", () => ({
  __esModule: true,
  default: function MockMomOverlay({
    candidates,
    onClose,
  }: {
    candidates: GachaCardProps[];
    onClose?: () => void;
  }) {
    return (
      <div data-testid="mom-overlay-mock">
        <span data-testid="candidate-count">{candidates.length}</span>
        {onClose ? (
          <button type="button" onClick={onClose}>
            닫기
          </button>
        ) : null}
      </div>
    );
  },
}));

jest.mock("react-relay", () => ({
  __esModule: true,
  useQueryLoader: () => [null, jest.fn(), jest.fn()],
  usePreloadedQuery: () => ({}),
}));

const sampleCandidates: GachaCardProps[] = [
  {
    id: 1,
    name: "A",
    position: "CM",
    number: 1,
    profileImage: "/1.webp",
  },
  {
    id: 2,
    name: "B",
    position: "RW",
    number: 2,
    profileImage: "/2.webp",
  },
];

function resetStore() {
  useMomResultOverlayStore.setState({
    isOpen: false,
    candidates: [],
    sessionId: 0,
  });
}

describe("MomResultOverlayHost", () => {
  beforeEach(() => {
    cleanup();
    resetStore();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    act(() => {
      resetStore();
    });
    document.body.style.overflow = "";
  });

  it("스토어 open 시 MomOverlay에 후보 수가 전달된다", () => {
    render(<MomResultOverlayHost />);
    expect(screen.queryByTestId("mom-overlay-mock")).not.toBeInTheDocument();

    act(() => {
      useMomResultOverlayStore.getState().openWithCandidates(sampleCandidates);
    });

    expect(screen.getByTestId("mom-overlay-mock")).toBeInTheDocument();
    expect(screen.getByTestId("candidate-count")).toHaveTextContent("2");
  });

  it("모의 닫기 버튼이 스토어 close를 호출한다", () => {
    render(<MomResultOverlayHost />);
    act(() => {
      useMomResultOverlayStore.getState().openWithCandidates(sampleCandidates);
    });

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(useMomResultOverlayStore.getState().isOpen).toBe(false);
  });
});
