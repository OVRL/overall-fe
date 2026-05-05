import { render, screen } from "@testing-library/react";
import TitleSection from "../TitleSection";

describe("TitleSection", () => {
  it("페이지 제목(h1)을 렌더링한다", () => {
    const { container } = render(<TitleSection />);

    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent("내 정보");
  });
});
