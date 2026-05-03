import { render, screen } from "@testing-library/react";
import UserIntroSection from "../UserIntroSection";

jest.mock("@/components/ui/ImgPlayer", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => (
    <div data-testid="img-player" role="img" aria-label={alt} />
  ),
}));

jest.mock("@/hooks/useUpdateTeamMemberProfileImage", () => ({
  useUpdateTeamMemberProfileImage: () => ({
    pickFromAlbum: jest.fn(),
    fileInputRef: { current: null },
    onHiddenFileChange: jest.fn(),
    previewImage: null,
    isUpdating: false,
  }),
}));

describe("UserIntroSection", () => {
  it("프로필 이미지와 수정 버튼을 렌더링한다", () => {
    render(<UserIntroSection member={null} />);

    expect(screen.getByRole("img", { name: "프로필 이미지" })).toBeInTheDocument();
    expect(screen.getByText("수정하기")).toBeInTheDocument();
  });

  it("이미지 수정 기능을 위한 hidden input이 존재해야 한다", () => {
    const { container } = render(<UserIntroSection member={null} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("hidden");
  });
});
