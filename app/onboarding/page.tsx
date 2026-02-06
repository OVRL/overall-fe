import { cookies } from "next/headers";
import OnboardingFunnelWrapper from "./_component/OnboardingFunnelWrapper";

const OnboardingPage = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("onboarding_user_id")?.value;

  return (
    <div className="flex flex-col gap-y-10 h-full">
      <main className="px-4 md:px-0 flex-1 md:max-w-layout md:mx-auto w-full">
        <OnboardingFunnelWrapper userId={userId ? Number(userId) : undefined} />
      </main>
    </div>
  );
};

export default OnboardingPage;
