import TitleSection from "./_components/TitleSection";
import ProfileClientContainer from "./_components/ProfileClientContainer";
import ProfileRevealSection from "./_components/ProfileRevealSection";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col py-6 md:py-8 px-4 lg:px-8">
      <div className="flex justify-center flex-1">
        <main className="max-w-300 min-w-0 flex-1 flex flex-col gap-8">
          <ProfileRevealSection>
            <TitleSection />
          </ProfileRevealSection>
          <ProfileClientContainer />
        </main>
      </div>
    </div>
  );
}
