import type { RegisterUserInput } from "@/__generated__/useRegisterUserMutation.graphql";
import type { Position } from "@/__generated__/useModifyUserMutation.graphql";

export type AdditionalFormState = {
  gender: "M" | "W";
  activityArea: string;
  activityAreaCode: string;
  foot: "L" | "R" | "B";
  preferredNumber: string;
  favoritePlayer: string;
};

export type SocialRegisterDataShape = {
  email?: unknown;
  provider?: unknown;
  phone?: unknown;
  name?: unknown;
  birthDate?: unknown;
  mainPosition?: unknown;
  subPositions?: unknown;
};

export function graphQLProviderFromData(
  providerRaw: unknown,
): RegisterUserInput["provider"] | undefined {
  if (providerRaw === "kakao") return "KAKAO";
  if (providerRaw === "naver") return "NAVER";
  if (providerRaw === "google") return "GOOGLE";
  return undefined;
}

/** 소셜 회원가입 — 추가 정보 포함 여부만 다름 */
export function buildSocialRegisterInput(
  data: SocialRegisterDataShape,
  info: AdditionalFormState,
  includeAdditional: boolean,
): RegisterUserInput | null {
  const email = typeof data.email === "string" ? data.email : undefined;
  const provider = graphQLProviderFromData(data.provider);
  const phone = typeof data.phone === "string" ? data.phone : "";
  const name = typeof data.name === "string" ? data.name : "";
  const birthDate = typeof data.birthDate === "string" ? data.birthDate : "";
  const mainPosition = data.mainPosition as Position | undefined;
  const subPositions =
    (data.subPositions as unknown as Position[]) ?? [];

  if (
    !email ||
    !provider ||
    !phone ||
    !name ||
    !birthDate ||
    !mainPosition ||
    subPositions.length !== 2
  ) {
    return null;
  }

  if (includeAdditional) {
    return {
      email,
      provider,
      name,
      phone,
      birthDate,
      mainPosition,
      subPositions,
      gender: info.gender,
      activityArea: info.activityAreaCode || info.activityArea || null,
      foot: info.foot,
      preferredNumber: info.preferredNumber
        ? parseInt(info.preferredNumber, 10)
        : null,
      favoritePlayer: info.favoritePlayer || null,
    };
  }

  return {
    email,
    provider,
    name,
    phone,
    birthDate,
    mainPosition,
    subPositions,
    gender: info.gender,
    activityArea: null,
    foot: info.foot,
    preferredNumber: null,
    favoritePlayer: null,
  };
}

export function pickLatestToken(
  tokens:
    | ReadonlyArray<{
        id: number;
        accessToken?: string | null;
        refreshToken?: string | null;
      } | null>
    | null
    | undefined,
): {
  id: number;
  accessToken?: string | null;
  refreshToken?: string | null;
} | null {
  const list = (tokens ?? []).filter(
    (t): t is NonNullable<typeof t> =>
      t != null && Boolean(t.accessToken),
  );
  return list.reduce<(typeof list)[number] | null>((acc, cur) => {
    if (!acc) return cur;
    return cur.id > acc.id ? cur : acc;
  }, null);
}
