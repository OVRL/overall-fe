import { render, screen } from "@testing-library/react";
import FormationControls from "../FormationControls";

jest.mock("../quarter/QuarterSelector", () => {
  return function MockQuarterSelector(props: any) {
    return (
      <div data-testid="quarter-selector">
        Quarter count: {props.quarters.length}
      </div>
    );
  };
});

describe("FormationControls 컴포넌트", () => {
  const defaultProps: any = {
    currentQuarterId: null,
    setCurrentQuarterId: jest.fn(),
    quarters: [
      { id: 1, formation: "4-3-3", lineup: {}, type: "match", matchup: "home" },
    ],
    addQuarter: jest.fn(),
  };

  it("섹션 컨테이너 내부에 타이틀 이미지와 QuarterSelector 래퍼를 올바르게 렌더링해야 한다", () => {
    render(<FormationControls {...defaultProps} />);

    // section 요소 및 aria-label 확인
    const section = screen.getByRole("region", { name: "포메이션 컨트롤" });
    expect(section).toBeInTheDocument();

    // 이미지 렌더링 확인 (FormationControls의 Icon alt="로고")
    const image = screen.getByAltText("로고");
    expect(image).toBeInTheDocument();

    // QuarterSelector 모킹 확인
    const quarterSelector = screen.getByTestId("quarter-selector");
    expect(quarterSelector).toBeInTheDocument();
    expect(quarterSelector).toHaveTextContent("Quarter count: 1");
  });
});
