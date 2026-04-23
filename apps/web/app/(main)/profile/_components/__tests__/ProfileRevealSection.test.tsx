import { act, render, waitFor } from "@testing-library/react";
import ProfileRevealSection from "../ProfileRevealSection";

describe("ProfileRevealSection", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: jest.fn(),
    }));
  });

  it("prefers-reduced-motion이면 즉시 profile-reveal--visible을 적용한다", async () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(
      <ProfileRevealSection>
        <p>child</p>
      </ProfileRevealSection>,
    );

    await waitFor(() => {
      expect(container.firstElementChild).toHaveClass("profile-reveal--visible");
    });
  });

  it("교차 관찰 시 노출되면 profile-reveal--visible을 적용한다", async () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    let intersectionCallback: IntersectionObserverCallback | null = null;

    global.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      intersectionCallback = cb;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        root: null,
        rootMargin: "",
        thresholds: [],
        takeRecords: jest.fn(),
      };
    });

    const { container } = render(
      <ProfileRevealSection>
        <p>child</p>
      </ProfileRevealSection>,
    );

    expect(intersectionCallback).not.toBeNull();

    await act(async () => {
      intersectionCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(container.firstElementChild).toHaveClass("profile-reveal--visible");
    });
  });
});
