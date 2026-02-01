import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import RelayProvider from "@/components/RelayProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className={`${pretendard.variable} w-screen h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RelayProvider>{children}</RelayProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
