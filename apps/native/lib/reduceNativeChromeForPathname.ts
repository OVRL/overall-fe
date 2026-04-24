import type { NativeWebChrome } from "@/types/nativeChrome";
import {
  isMainAppShellPath,
  isSharedHeaderTopbarPath,
} from "@/lib/nativeWebChromePaths";

/** WebView URL 의 pathname 에 맞춰 글로벌/탑바 네이티브 크롬을 제거할지 결정한다. */
export function reduceNativeChromeForPathname(
  prev: NativeWebChrome | null,
  pathname: string,
): NativeWebChrome | null {
  if (!prev) return prev;
  if (prev.mode === "global" && !isMainAppShellPath(pathname)) {
    return null;
  }
  if (prev.mode === "topbar" && !isSharedHeaderTopbarPath(pathname)) {
    return null;
  }
  return prev;
}
