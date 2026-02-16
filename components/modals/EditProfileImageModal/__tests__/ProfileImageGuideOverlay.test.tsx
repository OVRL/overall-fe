import { render, screen } from "@testing-library/react";
import ProfileImageGuideOverlay from "../ProfileImageGuideOverlay";

describe("ProfileImageGuideOverlay", () => {
  it("배경이 제거되지 않았을 때 가이드 아이콘과 텍스트를 렌더링해야 한다", () => {
    render(<ProfileImageGuideOverlay isBackgroundRemoved={false} />);

    expect(screen.getByAltText("guide")).toBeInTheDocument();
    expect(
      screen.getByText("손가락 두개로 확대/축소 하세요."),
    ).toBeInTheDocument();
  });

  it("배경이 제거되었을 때 올바른 텍스트를 렌더링해야 한다", () => {
    render(<ProfileImageGuideOverlay isBackgroundRemoved={true} />);

    // 가이드 아이콘은 없어야 함 (opacity 50% 큰 아이콘)
    expect(screen.queryByAltText("guide")).not.toBeInTheDocument();
    // 코치마크 아이콘은 있어야 함
    expect(screen.getByAltText("coachmark")).toBeInTheDocument();
    expect(
      screen.getByText("좌/우로 이미지를 움직이세요."),
    ).toBeInTheDocument();
  });
});
