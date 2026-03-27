import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";
import type { Player } from "@/types/formation";

function basePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 10,
    name: "테스트",
    position: "ST",
    number: 9,
    overall: 80,
    ...overrides,
  };
}

describe("getFormationPlayerProfileAvatarUrls", () => {
  it("원본 이미지가 없으면 src는 undefined, 폴백은 m:{팀멤버 id} 플레이스홀더", () => {
    const player = basePlayer({ id: 7 });
    const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

    expect(src).toBeUndefined();
    expect(fallbackSrc).toBe(getPlayerPlaceholderSrc("m:7"));
  });

  it("imageFallbackUrl이 있으면 폴백으로 우선 사용한다", () => {
    const custom = "https://cdn.example/fallback.webp";
    const player = basePlayer({
      id: 1,
      imageFallbackUrl: custom,
    });
    const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

    expect(src).toBeUndefined();
    expect(fallbackSrc).toBe(custom);
  });

  it("원본 URL은 트림하고, 빈 문자열이면 src는 undefined", () => {
    const player = basePlayer({
      image: "  https://img.example/p.png  ",
    });
    const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

    expect(src).toBe("https://img.example/p.png");
    expect(fallbackSrc).toBe(getPlayerPlaceholderSrc("m:10"));

    const empty = basePlayer({ image: "   " });
    expect(getFormationPlayerProfileAvatarUrls(empty).src).toBeUndefined();
  });

  it("image와 imageFallbackUrl이 모두 있으면 src는 원본, 폴백은 지정값", () => {
    const player = basePlayer({
      image: "/a.webp",
      imageFallbackUrl: getPlayerPlaceholderSrc("u:99"),
    });
    const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

    expect(src).toBe("/a.webp");
    expect(fallbackSrc).toBe(getPlayerPlaceholderSrc("u:99"));
  });
});
