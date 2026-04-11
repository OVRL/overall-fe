import { Suspense } from "react";
import TitleSection from "./_components/TitleSection";
import ProfilePageRelaySection from "./_components/ProfilePageRelaySection";
import { ProfilePageRelayFallback } from "./_components/ProfilePageRelayFallback";
import ProfileRevealSection from "./_components/ProfileRevealSection";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col py-12 px-4 lg:px-8">
      <div className="flex justify-center flex-1">
        <main className="max-w-300 min-w-0 flex-1 flex flex-col gap-12">
          <ProfileRevealSection>
            <TitleSection />
          </ProfileRevealSection>
          <Suspense fallback={<ProfilePageRelayFallback />}>
            <ProfilePageRelaySection />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
