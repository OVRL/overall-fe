import { render, screen } from "@testing-library/react";
import ProfileImageCanvas from "../ProfileImageCanvas";

// Mock react-easy-crop
jest.mock("react-easy-crop", () => ({
  __esModule: true,
  default: () => <div data-testid="react-easy-crop">Cropper</div>,
}));

// Mock icons
// Mock icons
jest.mock(
  "@/components/Icon",
  () =>
    ({ src, alt }: { src: string; alt: string }) => (
      <img src={src} alt={alt} data-testid={`icon-${alt}`} />
    ),
);

describe("ProfileImageCanvas", () => {
  const imageSrc = "test-image.jpg";

  it("renders cropper and overlays", () => {
    render(<ProfileImageCanvas imageSrc={imageSrc} />);

    // Check for Cropper
    expect(screen.getByTestId("react-easy-crop")).toBeInTheDocument();

    // Check for Guide Icon
    expect(screen.getByTestId("icon-guide")).toBeInTheDocument();

    // Check for Coachmark Icon
    expect(screen.getByTestId("icon-coachmark")).toBeInTheDocument();

    // Check for instruction text
    expect(
      screen.getByText("손가락 두개로 확대/축소 하세요."),
    ).toBeInTheDocument();
  });
});
