import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import RelayProvider from "@/components/RelayProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPortalProvider } from "@/components/GlobalPortal";
import Modals from "@/components/modals/Modals";
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
import { UserInitProvider } from "@/components/providers/UserInitProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts에서 설정한 헤더를 확인하여 private 라우트인지 판별
  const requestHeaders = await headers();
  const isPrivateRoute = requestHeaders.get("x-is-private-route") === "true";

  let initialUser = null;
  if (isPrivateRoute) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userIdStr = cookieStore.get("userId")?.value;
    
    // userId 및 accessToken이 모두 있을 때만 fetch
    if (accessToken && userIdStr) {
      const userId = Number(userIdStr);
      if (!isNaN(userId)) {
        initialUser = await fetchUserSSR(userId, accessToken);
      }
    }
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} w-full h-screen antialiased overflow-x-hidden flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RelayProvider>
            <UserInitProvider initialUser={initialUser}>
              {children}
              <GlobalPortalProvider>
                <Modals />
              </GlobalPortalProvider>
            </UserInitProvider>
          </RelayProvider>
        </ThemeProvider>
        <Analytics />
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
