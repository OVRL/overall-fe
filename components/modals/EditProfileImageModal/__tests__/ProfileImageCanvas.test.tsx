import { render, screen } from "@testing-library/react";
import ProfileImageCanvas from "../ProfileImageCanvas";

// react-easy-crop 모킹
jest.mock("react-easy-crop", () => ({
  __esModule: true,
  default: () => <div data-testid="react-easy-crop">Cropper</div>,
}));

// 아이콘 모킹
jest.mock("@/components/Icon", () => {
  const MockIcon = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid={`icon-${alt}`} />
  );
  MockIcon.displayName = "MockIcon";
  return MockIcon;
});

describe("ProfileImageCanvas", () => {
  const imageSrc = "test-image.jpg";

  it("크로퍼와 오버레이를 정상적으로 렌더링한다", () => {
    render(<ProfileImageCanvas imageSrc={imageSrc} />);

    // 크로퍼 확인
    expect(screen.getByTestId("react-easy-crop")).toBeInTheDocument();

    // 가이드 아이콘 확인
    expect(screen.getByTestId("icon-guide")).toBeInTheDocument();

    // 코치마크 아이콘 확인
    expect(screen.getByTestId("icon-coachmark")).toBeInTheDocument();

    // 안내 텍스트 확인
    expect(
      screen.getByText("손가락 두개로 확대/축소 하세요."),
    ).toBeInTheDocument();
  });
});
