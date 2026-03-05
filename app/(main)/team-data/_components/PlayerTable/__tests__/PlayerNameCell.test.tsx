import { render, screen } from "@testing-library/react";
import PlayerNameCell from "../PlayerNameCell";

// ProfileAvatar 모킹
jest.mock("@/components/ui/ProfileAvatar", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid="avatar" />
  ),
}));

describe("PlayerNameCell 컴포넌트", () => {
  it("선수 이름과 기본 이미지를 렌더링해야 한다", () => {
    render(<PlayerNameCell name="이강인" />);

    expect(screen.getByText("이강인")).toBeInTheDocument();

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("alt", "이강인");
    expect(avatar).toHaveAttribute("src", "/images/ovr.png");
  });

  it("커스텀 선수가 이미지가 있을 경우 해당 이미지를 사용해야 한다", () => {
    render(<PlayerNameCell name="손흥민" image="/custom/son.png" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("src", "/custom/son.png");
  });
});
