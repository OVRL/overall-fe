import { render, screen } from "@testing-library/react";
import OnboardingTitle from "../onboarding/OnboardingTitle";

describe("OnboardingTitle 컴포넌트", () => {
  it("children으로 전달된 텍스트가 렌더링되어야 한다", () => {
    render(<OnboardingTitle>테스트 제목</OnboardingTitle>);
    expect(screen.getByText("테스트 제목")).toBeInTheDocument();
  });

  it("줄바꿈이 적용된 텍스트를 렌더링할 때 whitespace-pre-wrap 스타일이 있어야 한다", () => {
    render(<OnboardingTitle>줄바꿈{"\n"}테스트</OnboardingTitle>);
    const titleElement = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "h1" && content.includes("줄바꿈")
      );
    });
    expect(titleElement).toHaveClass("whitespace-pre-wrap");
  });
});
