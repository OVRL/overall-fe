import { render, screen } from "@testing-library/react";
import PlayerNameCell from "../PlayerNameCell";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";
import { getValidImageSrc, MOCK_IMAGE_SRC } from "@/lib/utils";

jest.mock("@/components/ui/ProfileAvatar", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fallbackSrc = MOCK_IMAGE_SRC,
  }: {
    src?: string | null;
    alt: string;
    fallbackSrc?: string;
  }) => (
    <img
      src={getValidImageSrc(src, fallbackSrc)}
      alt={alt}
      data-testid="avatar"
    />
  ),
}));

describe("PlayerNameCell 컴포넌트", () => {
  it("선수 이름과 플레이스홀더 이미지를 렌더링해야 한다", () => {
    const playerId = 42;
    render(<PlayerNameCell name="이강인" playerId={playerId} />);

    expect(screen.getByText("이강인")).toBeInTheDocument();

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("alt", "이강인");
    expect(avatar).toHaveAttribute(
      "src",
      getPlayerPlaceholderSrc(`m:${playerId}`),
    );
  });

  it("커스텀 선수가 이미지가 있을 경우 해당 이미지를 사용해야 한다", () => {
    render(
      <PlayerNameCell name="손흥민" image="/custom/son.png" playerId={1} />,
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("src", "/custom/son.png");
  });
});
