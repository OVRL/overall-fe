import type { Metadata } from "next";
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

import { headers, cookies } from "next/headers";
import { fetchUserSSR } from "@/utils/fetchUserSSR";
import { fetchFindTeamMemberSSR } from "@/utils/fetchFindTeamMemberSSR";
import { UserInitProvider } from "@/components/providers/UserInitProvider";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";

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

  let initialUser = null;
  let initialSelectedTeamId: string | null = selectedTeamIdFromCookie;
  let initialSelectedTeamName: string | null = null;
  let initialSelectedTeamImageUrl: string | null = null;
  let initialSelectedTeamIdFromSingleTeam = false;

  if (isPrivateRoute) {
    const accessToken = cookieStore.get("accessToken")?.value;
    const userIdStr = cookieStore.get("userId")?.value;

    if (accessToken && userIdStr) {
      const userId = Number(userIdStr);
      if (!isNaN(userId)) {
        const [userResult, membersResult] = await Promise.all([
          fetchUserSSR(userId, accessToken),
          fetchFindTeamMemberSSR(userId, accessToken),
        ]);
        initialUser = userResult;

        const teamsWithInfo = membersResult.filter(
          (m): m is typeof m & { team: NonNullable<typeof m.team> } => m.team != null,
        );
        const teamIds = teamsWithInfo.map((m) => m.team.id);

        if (selectedTeamIdFromCookie != null && teamIds.includes(selectedTeamIdFromCookie)) {
          initialSelectedTeamId = selectedTeamIdFromCookie;
        } else if (teamsWithInfo.length === 1) {
          initialSelectedTeamId = teamsWithInfo[0].team.id;
          initialSelectedTeamIdFromSingleTeam = true;
        } else {
          initialSelectedTeamId = null;
        }

        if (initialSelectedTeamId != null) {
          const selectedTeam = teamsWithInfo.find(
            (m) => m.team.id === initialSelectedTeamId,
          );
          initialSelectedTeamName = selectedTeam?.team.name ?? null;
          initialSelectedTeamImageUrl = null;
        }
      }
    }
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} w-full h-screen antialiased overflow-x-hidden flex flex-col`}
      >
        <TransitionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <RelayProvider>
              <UserInitProvider initialUser={initialUser}>
                <SelectedTeamProvider
                  initialSelectedTeamId={initialSelectedTeamId}
                  initialSelectedTeamName={initialSelectedTeamName}
                  initialSelectedTeamImageUrl={initialSelectedTeamImageUrl}
                  initialSelectedTeamIdFromSingleTeam={initialSelectedTeamIdFromSingleTeam}
                >
                  <div id="modal-root"></div>
                  <PageTransition>{children}</PageTransition>
                  <GlobalPortalProvider>
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
      </body>
    </html>
  );
}
