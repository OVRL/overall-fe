import { render, screen } from "@testing-library/react";
import AttackContributionSection from "../AttackContributionSection";

jest.mock("@/components/charts/AttackContributionLineChart", () => ({
  __esModule: true,
  default: () => <div data-testid="attack-line-chart" />,
}));

describe("AttackContributionSection", () => {
  it("제목과 차트 자리를 렌더링한다", () => {
    render(<AttackContributionSection />);

    expect(
      screen.getByRole("heading", { name: "공격 기여도" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("attack-line-chart")).toBeInTheDocument();
  });
});
