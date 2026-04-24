import Header from "@/components/Header";
import { headers } from "next/headers";
import { isNativeWebViewUserAgent } from "@/lib/native/webViewUserAgent";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ua = (await headers()).get("user-agent") ?? "";
  const hideWebGlobalChrome = isNativeWebViewUserAgent(ua);

  return (
    <div className="min-h-dvh bg-bg-basic flex flex-col pt-safe">
      <Header variant="global" hideWebGlobalChrome={hideWebGlobalChrome} />
      {children}
    </div>
  );
}
