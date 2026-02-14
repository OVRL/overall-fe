import React from "react";
import { render, screen } from "@testing-library/react";
import UpcomingMatch from "../UpcomingMatch";

// Mock child components to verify conditional rendering
jest.mock("../UpcomingMatchMobile", () => {
  return function MockUpcomingMatchMobile() {
    return <div data-testid="mobile-match">Mobile Match</div>;
  };
});

jest.mock("../UpcomingMatchDesktop", () => {
  return function MockUpcomingMatchDesktop() {
    return <div data-testid="desktop-match">Desktop Match</div>;
  };
});

describe("UpcomingMatch", () => {
  it("renders both mobile and desktop components hidden/visible by CSS", () => {
    render(<UpcomingMatch />);

    const mobileValidator = screen.getByTestId("mobile-match");
    const desktopValidator = screen.getByTestId("desktop-match");

    expect(mobileValidator).toBeInTheDocument();
    expect(desktopValidator).toBeInTheDocument();

    // Since we are using Tailwind classes for hiding, we can check if they are rendered.
    // The actual visibility control is done by CSS, which jsdom doesn't fully simulate for layout,
    // but we can check if the wrapper has the correct classes if we were testing the wrapper.
    // However, UpcomingMatch.tsx renders them directly. Let's check UpcomingMatch.tsx structure again.
    // Looking at the view_file output from history:
    // UpcomingMatch renders a wrapper div with bg, rounded, etc.
    // Then renders Mobile and Desktop components.
    // The conditional logic is INSIDE Mobile/Desktop components (md:hidden, etc).
  });
});
