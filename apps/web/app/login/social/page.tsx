import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SocialButtons from "@/components/ui/SocialButtons";
import LoginLogo from "@/components/login/LoginLogo";
import { isAccessTokenExpired } from "@/lib/auth/jwtAccess";
import { SocialOAuthCallbackToast } from "./SocialOAuthCallbackToast";
import { LoginSocialSessionRedirectGuard } from "./LoginSocialSessionRedirectGuard";

/** 유효한 access 쿠키가 있으면 홈으로. 캐시 복원만 있는 뒤로가기는 `LoginSocialSessionRedirectGuard`가 `/api/me/user-id`로 보정. */
export default async function LoginSocialPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("accessToken")?.value;
  if (access != null && !isAccessTokenExpired(access)) {
    redirect("/");
  }

  return (
    <main className="flex flex-col h-full w-full justify-between items-center bg-linear-to-br from-primary-light via-dark-olive to-black relative overflow-hidden pt-safe">
      <LoginSocialSessionRedirectGuard />
      <Suspense fallback={null}>
        <SocialOAuthCallbackToast />
      </Suspense>
      <div className="absolute inset-0 z-0 flex items-end justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-dark-olive/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/30" />
      </div>
      <LoginLogo />

      <div className="relative z-10 w-full p-6 pb-12 lg:pb-20 flex flex-col gap-2 max-w-sm mx-auto animate-in slide-in-from-bottom duration-500 fade-in">
        <SocialButtons />
      </div>
    </main>
  );
}
