import { render } from "@testing-library/react";
import { ProfilePageRelayFallback } from "../ProfilePageRelayFallback";

describe("ProfilePageRelayFallback", () => {
  it("스켈레톤 레이아웃 루트 클래스를 가진다", () => {
    const { container } = render(<ProfilePageRelayFallback />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("flex", "flex-col", "gap-12");
  });

  it("스켈레톤 블록을 여러 개 렌더링한다", () => {
    const { container } = render(<ProfilePageRelayFallback />);
    const skeletons = container.querySelectorAll(".animate-shimmer");

    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });
});
