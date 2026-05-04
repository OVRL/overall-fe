import Header from "@/components/Header";
import { MainNativeBottomNavReserve } from "@/components/providers/MainNativeBottomNavReserve";
import { headers } from "next/headers";
import { isNativeLiquidBottomNavShellPath } from "@/lib/native/nativeLiquidBottomNavShellPaths";
import { isNativeWebViewUserAgent } from "@/lib/native/webViewUserAgent";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const pathname = h.get("x-pathname") ?? "";
  const hideWebGlobalChrome = isNativeWebViewUserAgent(ua);
  const ssrNativeBottomNavPad =
    hideWebGlobalChrome && isNativeLiquidBottomNavShellPath(pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-bg-basic pt-safe">
      <Header variant="global" hideWebGlobalChrome={hideWebGlobalChrome} />
      <MainNativeBottomNavReserve ssrShouldPad={ssrNativeBottomNavPad}>
        {children}
      </MainNativeBottomNavReserve>
    </div>
  );
}
