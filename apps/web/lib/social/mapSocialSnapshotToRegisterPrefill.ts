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

function buildBirthDate(birthyear?: string, birthday?: string): string | undefined {
  // 네이버 birthday: "07-18" 형태가 흔함
  const y = safeString(birthyear);
  const b = safeString(birthday);
  if (!y || !b) return undefined;
  const parts = b.split("-");
  if (parts.length !== 2) return undefined;
  const mm = parts[0]?.padStart(2, "0");
  const dd = parts[1]?.padStart(2, "0");
  if (!mm || !dd) return undefined;
  const candidate = `${y}-${mm}-${dd}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : undefined;
}

function mapGender(v?: string): "M" | "W" | undefined {
  if (v === "M") return "M";
  if (v === "F" || v === "W") return "W";
  return undefined;
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
    // 요구사항: 카카오는 이메일만 사용
    if (email) locked.email = true;
    return { snapshot, prefill, lockedFields: locked };
  }

  if (provider === "google") {
    const o = (userMe && typeof userMe === "object" ? (userMe as Record<string, unknown>) : null);
    const name = safeString(o?.name);
    if (name) {
      prefill.name = name;
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

