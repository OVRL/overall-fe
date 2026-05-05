import {
  PLAYER_PLACEHOLDER_IMAGES,
  resolveTeamMemberCardImageUrl,
} from "@/lib/playerPlaceholderImage";

describe("resolveTeamMemberCardImageUrl", () => {
  it("profileImg가 유효하면 해당 URL을 반환한다", () => {
    expect(
      resolveTeamMemberCardImageUrl({
        profileImg: "  https://cdn.example/team-member.webp  ",
      }),
    ).toBe("https://cdn.example/team-member.webp");
  });

  it("profileImg가 비어 있으면 기본 플레이스홀더(img_player_1)를 반환한다", () => {
    expect(resolveTeamMemberCardImageUrl({ profileImg: null })).toBe(
      PLAYER_PLACEHOLDER_IMAGES[0],
    );
    expect(resolveTeamMemberCardImageUrl({ profileImg: "" })).toBe(
      PLAYER_PLACEHOLDER_IMAGES[0],
    );
    expect(resolveTeamMemberCardImageUrl({ profileImg: "   " })).toBe(
      PLAYER_PLACEHOLDER_IMAGES[0],
    );
  });
});
