import { render, screen } from "@testing-library/react";
import OvrCard from "../OvrCard";

describe("OvrCard", () => {
  it("OVR 라벨과 점수를 렌더링한다", () => {
    render(<OvrCard ovrScore={78} />);

    expect(screen.getByText("OVR")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
  });
});
