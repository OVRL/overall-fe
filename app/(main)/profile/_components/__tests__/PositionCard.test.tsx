import { render, screen } from "@testing-library/react";
import PositionCard from "../PositionCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: unknown;
    alt: string;
    width: number;
    height: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element -- 테스트용 순수 img
    <img
      data-testid="next-image"
      src={typeof src === "object" && src && "src" in src ? String((src as { src: string }).src) : String(src)}
      alt={alt}
      width={width}
      height={height}
    />
  ),
}));

describe("PositionCard", () => {
  it("포지션이 없으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<PositionCard positions={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("주 포지션 제목과 포지션 코드·횟수를 렌더링한다", () => {
    render(
      <PositionCard
        positions={[
          { name: "FW", count: 42 },
          { name: "AM", count: 10 },
        ]}
      />,
    );

    expect(screen.getByText("주 포지션")).toBeInTheDocument();
    expect(screen.getByText("FW")).toBeInTheDocument();
    expect(screen.getByText("AM")).toBeInTheDocument();
    expect(screen.getByText("42회")).toBeInTheDocument();
    expect(screen.getByText("10회")).toBeInTheDocument();
  });
});
