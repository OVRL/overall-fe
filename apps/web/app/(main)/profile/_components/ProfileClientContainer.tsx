"use client";

import { useState, Suspense } from "react";
import ProfileTabMenu, { ProfileTabType } from "./ProfileTabMenu";
import ProfilePageRelaySection from "./ProfilePageRelaySection";
import ProfilePersonalRelaySection from "./ProfilePersonalRelaySection";
import { ProfilePageRelayFallback } from "./ProfilePageRelayFallback";
import { ProfilePersonalRelayFallback } from "./ProfilePersonalRelayFallback";

export default function ProfileClientContainer() {
  const [activeTab, setActiveTab] = useState<ProfileTabType>("개인 프로필");

  return (
    <>
      <ProfileTabMenu activeTab={activeTab} onChange={setActiveTab} />
      <Suspense
        fallback={
          activeTab === "개인 프로필" ? (
            <ProfilePersonalRelayFallback />
          ) : (
            <ProfilePageRelayFallback />
          )
        }
      >
        {activeTab === "개인 프로필" && <ProfilePersonalRelaySection />}
        {activeTab === "팀 프로필" && <ProfilePageRelaySection />}
      </Suspense>
    </>
  );
}
