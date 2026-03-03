import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import RelayProvider from "@/components/RelayProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPortalProvider } from "@/components/GlobalPortal";
import Modals from "@/components/modals/Modals";
import Script from "next/script";
import { env } from "@/lib/env";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            {children}
            <GlobalPortalProvider>
              <Modals />
            </GlobalPortalProvider>
          </RelayProvider>
        </ThemeProvider>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
