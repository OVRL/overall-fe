import { render, screen } from "@testing-library/react";
import whistleIcon from "@/public/icons/player-infos/whistle.svg";
import StatCard from "../StatCard";

describe("StatCard", () => {
  it("제목과 값을 표시한다", () => {
    render(
      <StatCard title="경기 수" value={12} icon={whistleIcon} />,
    );

    expect(screen.getByText("경기 수")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
