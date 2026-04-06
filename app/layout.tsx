import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import RelayProvider from "@/components/RelayProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPortalProvider } from "@/components/GlobalPortal";
import Modals from "@/components/modals/Modals";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import Script from "next/script";
import { env } from "@/lib/env";
import { Analytics } from "@vercel/analytics/next";
import { headers, cookies } from "next/headers";
import { UserInitProvider } from "@/components/providers/UserInitProvider";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";
import { loadLayoutSSR } from "@/lib/relay/ssr/loadLayoutSSR";
import { EMPTY_LAYOUT_STATE } from "@/lib/relay/ssr/layoutState";
import { TEAM_REQUIRED_ROUTES, isTeamManagementPath } from "@/lib/routes";
import { canUseTeamManagementStaffFeatures } from "@/lib/permissions/teamMemberRole";
import { errorMessageRequiresSessionClear } from "@/lib/auth/graphqlSessionClear";
import { redirect } from "next/navigation";
import { SpeedInsights } from '@vercel/speed-insights/next';

const pretendard = localFont({
  src: "../styles/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Overall",
  description: "Overall",
};

/** 모바일·웹뷰: 동적 뷰포트 높이, 노치(safe-area), 가상 키보드 레이아웃 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(99.11% 0 89.9)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.13 0 0)" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const isPrivateRoute = requestHeaders.get("x-is-private-route") === "true";

  const cookieStore = await cookies();
  const selectedTeamIdFromCookie =
    cookieStore.get(SELECTED_TEAM_ID_COOKIE_KEY)?.value ?? null;

  let relayInitialRecords: string | undefined;
  let layoutState = EMPTY_LAYOUT_STATE;

  if (isPrivateRoute) {
    const accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;
    const userIdStr = cookieStore.get("userId")?.value;
    const userId =
      userIdStr != null && !Number.isNaN(Number(userIdStr))
        ? Number(userIdStr)
        : null;

    try {
      const { relayInitialRecords: records, layoutState: state } =
        await loadLayoutSSR({
          accessToken,
          refreshToken,
          userId,
          selectedTeamIdFromCookie,
        });
      relayInitialRecords = records;
      layoutState = state;
    } catch (e) {
      // SSR에서 refresh 후에도 Unauthorized(토큰 만료 등)면 세션 삭제 후 로그인 페이지로
      // (세션 삭제 없이 "/"로만 보내면 proxy가 쿠키로 인해 다시 /home으로 보내 리다이렉트 루프 발생)
      const message = e instanceof Error ? e.message : String(e);
      if (
        message.includes("Unauthorized") ||
        message.toLowerCase().includes("unauthorized") ||
        errorMessageRequiresSessionClear(message)
      ) {
        redirect("/api/auth/clear-session?redirect=/");
      }
      throw e;
    }
  }

  // 리디렉션: 로그인·팀 유무에 따른 접근 제어
  const pathname = requestHeaders.get("x-pathname") ?? "";
  const isLoggedIn = layoutState.userId != null;
  /** 소속 팀 유무(다중 팀 + 쿠키 없음이면 initialSelectedTeamId는 null일 수 있음) */
  const hasTeam = layoutState.hasAnyTeamMembership;

  // 로그인 + 소속 팀 없음 → 팀 필수 경로 접근 시 landing으로
  if (
    isPrivateRoute &&
    isLoggedIn &&
    !hasTeam &&
    TEAM_REQUIRED_ROUTES.some((pattern) => pattern.test(pathname))
  ) {
    redirect("/landing");
  }

  // 로그인 + 소속 팀 있음 → landing 접근 시 /home으로
  if (isPrivateRoute && isLoggedIn && hasTeam && pathname === "/landing") {
    redirect("/home");
  }

  // player는 팀 관리(및 하위 경로) SSR 단계에서 차단 (직링크·북마크)
  const role = layoutState.initialSelectedTeamMemberRole;
  if (
    isPrivateRoute &&
    isLoggedIn &&
    isTeamManagementPath(pathname) &&
    role != null &&
    !canUseTeamManagementStaffFeatures(role)
  ) {
    redirect("/home");
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} w-full min-h-dvh h-screen antialiased overflow-x-hidden flex flex-col`}
      >
        <TransitionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <RelayProvider initialRecords={relayInitialRecords}>
              <UserInitProvider
                userId={layoutState.userId}
                initialUser={layoutState.initialUser}
              >
                <SelectedTeamProvider
                  initialSelectedTeamId={layoutState.initialSelectedTeamId}
                  initialSelectedTeamIdNum={
                    layoutState.initialSelectedTeamIdNum
                  }
                  initialSelectedTeamName={layoutState.initialSelectedTeamName}
                  initialSelectedTeamImageUrl={
                    layoutState.initialSelectedTeamImageUrl
                  }
                  initialIsSoloTeam={layoutState.initialIsSoloTeam}
                >
                  <GlobalPortalProvider>
                    <div id="modal-root"></div>
                    <PageTransition>{children}</PageTransition>
                    <Modals />
                  </GlobalPortalProvider>
                  <Toaster />
                </SelectedTeamProvider>
              </UserInitProvider>
            </RelayProvider>
          </ThemeProvider>
          <Analytics />
        </TransitionProvider>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
          strategy="lazyOnload"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
