/**
 * 유니폼 디자인 — GraphQL enum / 서버 저장값과 1:1 대응
 * CreateTeam, RegisterGameModal 등에서 공통 사용
 */

export const UNIFORM_DESIGN_VALUES = [
  "DEFAULT",
  "SOLID_BLACK",
  "SOLID_BLUE",
  "SOLID_PURPLE",
  "SOLID_RED",
  "SOLID_WHITE",
  "STRIPE_BLUE",
  "STRIPE_RED",
  "STRIPE_WHITE",
  "STRIPE_YELLOW",
] as const;

export type UniformDesign = (typeof UNIFORM_DESIGN_VALUES)[number];

/** enum → 이미지 경로 (파일명: 소문자_언더스코어.webp) */
export function getUniformImagePath(design: UniformDesign): string {
  return `/icons/uniforms/${design.toLowerCase()}.webp`;
}

const LABELS: Record<UniformDesign, string> = {
  DEFAULT: "기본",
  SOLID_BLACK: "블랙 단색",
  SOLID_BLUE: "블루 단색",
  SOLID_PURPLE: "퍼플 단색",
  SOLID_RED: "레드 단색",
  SOLID_WHITE: "화이트 단색",
  STRIPE_BLUE: "블루 줄무늬",
  STRIPE_RED: "레드 줄무늬",
  STRIPE_WHITE: "화이트 줄무늬",
  STRIPE_YELLOW: "옐로우 줄무늬",
};

export const UNIFORM_DESIGNS: {
  design: UniformDesign;
  imagePath: string;
  label: string;
}[] = UNIFORM_DESIGN_VALUES.map((design) => ({
  design,
  imagePath: getUniformImagePath(design),
  label: LABELS[design],
}));
