import {
  type SocialOauthSnapshot,
  SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY,
} from "@/lib/social/socialOauthStorage";
import type {
  OnboardingLockedFields,
} from "@/types/onboarding";
import { extractEmailFromSocialProfile } from "@/lib/social/extractSocialEmail";

type ProviderLower = "kakao" | "naver" | "google";

export type SocialRegisterPrefill = {
  snapshot: SocialOauthSnapshot;
  prefill: {
    email?: string;
    provider?: ProviderLower;
    name?: string;
    phone?: string;
    birthDate?: string;
    gender?: "M" | "W";
  };
  lockedFields: OnboardingLockedFields;
};

function safeString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length > 0 ? digits : undefined;
}

/**
 * 카카오: "+82 10-xxxx-xxxx" → 국가코드 제거 후 국내 휴대폰 11자리(010…)
 * 10자리(10으로 시작)면 앞에 0을 붙임.
 */
function normalizeKakaoPhoneNumber(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  let s = phone.trim();
  s = s.replace(/^\+82\s*/i, "");
  s = s.replace(/^82\s+/, "");
  const digits = s.replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("10")) {
    return `0${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("010")) {
    return digits;
  }
  if (digits.length > 0) return digits;
  return undefined;
}

function buildBirthDate(birthyear?: string, birthday?: string): string | undefined {
  // 네이버 birthday: "07-18" 형태가 흔함
  const y = safeString(birthyear);
  const b = safeString(birthday);
  if (!y || !b) return undefined;
  // 카카오: "0718" (MMDD, 구분자 없음)
  const onlyDigits = b.replace(/[^0-9]/g, "");
  if (onlyDigits.length === 4) {
    const mm = onlyDigits.slice(0, 2);
    const dd = onlyDigits.slice(2, 4);
    const candidate = `${y}-${mm}-${dd}`;
    return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : undefined;
  }
  const parts = b.split("-");
  if (parts.length !== 2) return undefined;
  const mm = parts[0]?.padStart(2, "0");
  const dd = parts[1]?.padStart(2, "0");
  if (!mm || !dd) return undefined;
  const candidate = `${y}-${mm}-${dd}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : undefined;
}

function mapGender(v?: string): "M" | "W" | undefined {
  const lower = v?.toLowerCase();
  if (v === "M" || lower === "male") return "M";
  if (v === "F" || v === "W" || lower === "female") return "W";
  return undefined;
}

/** Google OIDC userinfo: name 우선, 없으면 family_name + given_name */
function buildGoogleDisplayName(
  o: Record<string, unknown> | null,
): string | undefined {
  if (!o) return undefined;
  const full = safeString(o.name);
  if (full) return full;
  const family = safeString(o.family_name);
  const given = safeString(o.given_name);
  if (family && given) return `${family}${given}`;
  return family ?? given;
}

export function readSocialSnapshotFromSessionStorage(): SocialOauthSnapshot | null {
  try {
    const raw = sessionStorage.getItem(SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SocialOauthSnapshot;
  } catch {
    return null;
  }
}

export function mapSocialSnapshotToRegisterPrefill(
  snapshot: SocialOauthSnapshot,
): SocialRegisterPrefill {
  const provider = snapshot.provider;
  const userMe = snapshot.userMe;

  const email =
    snapshot.email ??
    (userMe ? extractEmailFromSocialProfile(provider, userMe) : null) ??
    undefined;

  const locked: OnboardingLockedFields = {
    email: Boolean(email),
    provider: true,
  };

  const prefill: SocialRegisterPrefill["prefill"] = {
    email: email ?? undefined,
    provider,
  };

  if (provider === "kakao") {
    const root =
      userMe && typeof userMe === "object"
        ? (userMe as Record<string, unknown>)
        : null;
    const ka =
      root?.kakao_account && typeof root.kakao_account === "object"
        ? (root.kakao_account as Record<string, unknown>)
        : null;

    const name = safeString(ka?.name);
    const phone = normalizeKakaoPhoneNumber(safeString(ka?.phone_number));
    const birthDate = buildBirthDate(
      safeString(ka?.birthyear),
      safeString(ka?.birthday),
    );
    const gender = mapGender(safeString(ka?.gender));

    if (name) {
      prefill.name = name;
      locked.name = true;
    }
    if (phone) {
      prefill.phone = phone;
      locked.phone = true;
    }
    if (birthDate) {
      prefill.birthDate = birthDate;
      locked.birthDate = true;
    }
    if (gender) {
      prefill.gender = gender;
      locked.gender = true;
    }
    if (email) locked.email = true;

    return { snapshot, prefill, lockedFields: locked };
  }

  if (provider === "google") {
    const o =
      userMe && typeof userMe === "object"
        ? (userMe as Record<string, unknown>)
        : null;

    const displayName = buildGoogleDisplayName(o);

    if (displayName) {
      prefill.name = displayName;
      locked.name = true;
    }
    if (email) locked.email = true;

    return { snapshot, prefill, lockedFields: locked };
  }

  // naver
  const root = (userMe && typeof userMe === "object" ? (userMe as Record<string, unknown>) : null);
  const response =
    root?.response && typeof root.response === "object"
      ? (root.response as Record<string, unknown>)
      : null;

  const name = safeString(response?.name);
  const phone = normalizePhone(safeString(response?.mobile));
  const gender = mapGender(safeString(response?.gender));
  const birthDate = buildBirthDate(
    safeString(response?.birthyear),
    safeString(response?.birthday),
  );

  if (name) {
    prefill.name = name;
    locked.name = true;
  }
  if (phone) {
    prefill.phone = phone;
    locked.phone = true;
  }
  if (gender) {
    prefill.gender = gender;
    locked.gender = true;
  }
  if (birthDate) {
    prefill.birthDate = birthDate;
    locked.birthDate = true;
  }
  if (email) locked.email = true;

  return { snapshot, prefill, lockedFields: locked };
}

