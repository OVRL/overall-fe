"use client";

import { useState, Suspense } from "react";
import ProfileTabMenu, { ProfileTabType } from "./ProfileTabMenu";
import ProfilePageRelaySection from "./ProfilePageRelaySection";
import ProfilePersonalRelaySection from "./ProfilePersonalRelaySection";
import { ProfilePageRelayFallback } from "./ProfilePageRelayFallback";
import { ProfilePersonalRelayFallback } from "./ProfilePersonalRelayFallback";
import TitleSection from "./TitleSection";
import ProfileRevealSection from "./ProfileRevealSection";

export default function ProfileClientContainer() {
  const [activeTab, setActiveTab] = useState<ProfileTabType>("상세 정보");

  return (
    <>
      <ProfileRevealSection className="flex flex-row items-baseline justify-start gap-6">
        <TitleSection />
        <ProfileTabMenu activeTab={activeTab} onChange={setActiveTab} />
      </ProfileRevealSection>
      <Suspense
        fallback={
          activeTab === "상세 정보" ? (
            <ProfilePersonalRelayFallback />
          ) : (
            <ProfilePageRelayFallback />
          )
        }
      >
        {activeTab === "상세 정보" && <ProfilePersonalRelaySection />}
        {activeTab === "팀 프로필" && <ProfilePageRelaySection />}
      </Suspense>
    </>
  );
}
