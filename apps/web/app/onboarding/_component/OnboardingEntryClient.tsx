"use client";

import { useEffect, useState } from "react";
import OnboardingFunnelWrapper from "./OnboardingFunnelWrapper";
import {
  mapSocialSnapshotToRegisterPrefill,
  readSocialSnapshotFromSessionStorage,
} from "@/lib/social/mapSocialSnapshotToRegisterPrefill";
import type { OnboardingLockedFields } from "@/types/onboarding";

type Props = {
  userId?: number;
};

export default function OnboardingEntryClient({ userId }: Props) {
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [lockedFields, setLockedFields] = useState<OnboardingLockedFields>({});
  const [mode, setMode] = useState<"onboarding" | "social-register">(
    "onboarding",
  );

  useEffect(() => {
    const snap = readSocialSnapshotFromSessionStorage();
    if (!snap) return;
    const mapped = mapSocialSnapshotToRegisterPrefill(snap);
    setInitialData(mapped.prefill);
    setLockedFields(mapped.lockedFields);
    setMode("social-register");
  }, []);

  return (
    <OnboardingFunnelWrapper
      userId={userId}
      mode={mode}
      initialSocialPrefill={initialData}
      lockedFields={lockedFields}
    />
  );
}

