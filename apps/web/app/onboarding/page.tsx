import { cookies } from "next/headers";
import OnboardingEntryClient from "./_component/OnboardingEntryClient";

const OnboardingPage = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  return (
    <div className="flex flex-col gap-y-10 h-full pt-safe">
      <main className="px-4 md:px-0 flex-1 md:max-w-layout md:mx-auto w-full">
        <OnboardingEntryClient userId={userId ? Number(userId) : undefined} />
      </main>
    </div>
  );
};

export default OnboardingPage;
