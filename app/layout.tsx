import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import RelayProvider from "@/components/RelayProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPortalProvider } from "@/components/GlobalPortal";
import Modals from "@/components/modals/Modals";

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
        className={`${pretendard.variable} w-full h-screen antialiased overflow-x-hidden`}
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
      </body>
    </html>
  );
}
