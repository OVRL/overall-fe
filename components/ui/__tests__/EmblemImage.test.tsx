import { render, screen, fireEvent } from "@testing-library/react";
import { EmblemImage } from "@/components/ui/EmblemImage";
import { MOCK_EMBLEM_SRC } from "@/lib/utils";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onError,
    unoptimized,
    sizes,
    quality,
    className,
    fill,
  }: {
    src: string;
    alt: string;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    unoptimized?: boolean;
    sizes?: string;
    quality?: number;
    className?: string;
    fill?: boolean;
  }) => (
    // next/image 대체 모킹 — 실제 Image 최적화와 무관
    // eslint-disable-next-line @next/next/no-img-element -- 테스트용 순수 img
    <img
      data-testid="next-image"
      src={src}
      alt={alt}
      onError={onError}
      data-unoptimized={String(unoptimized)}
      data-sizes={sizes ?? ""}
      data-quality={quality ?? ""}
      data-fill={String(fill)}
      className={className}
    />
  ),
}));

function getImg() {
  return screen.getByTestId("next-image");
}

describe("EmblemImage", () => {
  it("유효한 https URL을 정규화된 src로 그대로 사용한다", () => {
    render(
      <EmblemImage
        src="https://cdn.example.com/emblem.png"
        alt="홈팀"
        sizes="2.5rem"
      />,
    );
    const img = getImg();
    expect(img).toHaveAttribute("src", "https://cdn.example.com/emblem.png");
    expect(img).toHaveAttribute("alt", "홈팀");
    expect(img).toHaveAttribute("data-sizes", "2.5rem");
    expect(img).toHaveAttribute("data-quality", "100");
    expect(img).toHaveAttribute("data-fill", "true");
    expect(img).toHaveAttribute("data-unoptimized", "false");
  });

  it("로컬 경로(/)는 그대로 src로 사용한다", () => {
    render(<EmblemImage src="/uploads/team.png" alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("src", "/uploads/team.png");
  });

  it("무효·빈 src는 기본 엠블럼(MOCK_EMBLEM_SRC)으로 정규화한다", () => {
    const { rerender } = render(<EmblemImage src={null} alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);

    rerender(<EmblemImage src="" alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);

    rerender(<EmblemImage src="   " alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);

    rerender(<EmblemImage src="not-a-valid-url" alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);
  });

  it("표시 src가 SVG일 때 unoptimized가 true이다", () => {
    render(<EmblemImage src={null} alt="" sizes="1.5rem" />);
    expect(getImg()).toHaveAttribute("data-unoptimized", "true");
  });

  it("https이지만 경로가 .svg면 unoptimized가 true이다", () => {
    render(
      <EmblemImage
        src="https://cdn.example.com/logo.svg"
        alt=""
        sizes="1.5rem"
      />,
    );
    expect(getImg()).toHaveAttribute("data-unoptimized", "true");
  });

  it("로드 에러 시 기본 엠블럼으로 바꾸고 onError 콜백을 호출한다", () => {
    const onError = jest.fn();
    render(
      <EmblemImage
        src="https://cdn.example.com/missing.png"
        alt="팀"
        sizes="1.5rem"
        onError={onError}
      />,
    );
    const img = getImg();
    expect(img).toHaveAttribute(
      "src",
      "https://cdn.example.com/missing.png",
    );

    fireEvent.error(img);

    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("src prop이 바뀌면 이전 로드 실패 상태를 버리고 새 URL을 다시 시도한다", () => {
    const { rerender } = render(
      <EmblemImage src="https://a.example.com/1.png" alt="" sizes="1.5rem" />,
    );
    fireEvent.error(getImg());
    expect(getImg()).toHaveAttribute("src", MOCK_EMBLEM_SRC);

    rerender(
      <EmblemImage src="https://b.example.com/2.png" alt="" sizes="1.5rem" />,
    );
    expect(getImg()).toHaveAttribute("src", "https://b.example.com/2.png");
  });

  it("className을 object-cover와 병합해 전달한다", () => {
    render(
      <EmblemImage
        src="https://cdn.example.com/e.png"
        alt=""
        sizes="1.5rem"
        className="ring-1"
      />,
    );
    expect(getImg().className).toMatch(/object-cover/);
    expect(getImg().className).toMatch(/ring-1/);
  });

  it("unoptimized prop을 명시하면 SVG가 아니어도 그 값을 따른다", () => {
    render(
      <EmblemImage
        src="https://cdn.example.com/e.png"
        alt=""
        sizes="1.5rem"
        unoptimized
      />,
    );
    expect(getImg()).toHaveAttribute("data-unoptimized", "true");
  });
});
