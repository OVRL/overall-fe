import { render, screen } from "@testing-library/react";
import type { ProfileTeamMemberRow } from "../../types/profileTeamMemberTypes";
import UserIntroSection from "../UserIntroSection";

jest.mock("@/components/ui/ImgPlayer", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => (
    <div data-testid="img-player" role="img" aria-label={alt} />
  ),
}));

describe("UserIntroSection", () => {
  it("member가 없을 때 대시로 이름·지역을 표시한다", () => {
    render(<UserIntroSection member={null} />);

    expect(screen.getByRole("heading", { name: "—" })).toBeInTheDocument();
    expect(screen.getByText(/가입일:.*—/)).toBeInTheDocument();
    expect(screen.getByText(/활동지역:.*—/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "프로필" })).toBeInTheDocument();
  });

  it("member 정보를 표시하고 편집 버튼을 렌더링한다", () => {
    const member = {
      profileImg: "https://example.com/p.png",
      joinedAt: "2024-01-15T00:00:00.000Z",
      user: {
        name: "  홍길동  ",
        region: { name: "서울 강남구" },
      },
      team: { id: "VGVhbTox", name: "팀A", emblem: null },
    } as unknown as ProfileTeamMemberRow;

    render(<UserIntroSection member={member} />);

    expect(screen.getByRole("heading", { name: "홍길동" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /편집/ })).toBeInTheDocument();
    expect(screen.getByText(/가입일:/)).toBeInTheDocument();
    expect(screen.getByText(/2024\.01\.15/)).toBeInTheDocument();
    expect(screen.getByText(/활동지역:/)).toBeInTheDocument();
    expect(screen.getByText(/서울 강남구/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "홍길동" })).toBeInTheDocument();
  });
});
