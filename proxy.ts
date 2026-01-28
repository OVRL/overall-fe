import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./lib/env";

const BACKEND_URL = env.BACKEND_URL;

interface User {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface RefreshResponse {
  data?: {
    refresh: User;
  };
  errors?: unknown[];
}

// 헬퍼 함수: 토큰 갱신
async function refreshAccessToken(
  refreshToken: string,
): Promise<User | undefined | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Refresh($refreshToken: String!) {
            refresh(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    });
    const data: RefreshResponse = await response.json();
    return data?.data?.refresh;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

// 경로 세분화 정의
const GUEST_ONLY_PATHS = ["/login"];
const PUBLIC_PATHS = ["/", "/social/callback"]; // 둘 다 접근 가능
// 그 외 나머지는 모두 로그인 필요

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. API 요청 처리 (기존 로직 유지)
  if (pathname.startsWith("/api/")) {
    let token = accessToken;

    if (!token && refreshToken) {
      console.log("API Proxy: No valid access token.");
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) {
        token = newTokens.accessToken;
      }
    }

    const url = `${BACKEND_URL}${pathname}${search}`;
    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.blob()
        : undefined;
    const headers = new Headers(request.headers);
    headers.delete("host");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let backendResponse = await fetch(url, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    if (backendResponse.status === 401 && refreshToken) {
      console.log("API Proxy: 401 Unauthorized.");
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) {
        token = newTokens.accessToken;
        headers.set("Authorization", `Bearer ${token}`);
        backendResponse = await fetch(url, {
          method: request.method,
          headers,
          body,
          redirect: "manual",
        });

        const responseProxy = new NextResponse(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: backendResponse.headers,
        });

        // 쿠키 갱신
        responseProxy.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        });
        if (newTokens.refreshToken) {
          responseProxy.cookies.set("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
        }
        return responseProxy;
      }
    }

    const responseProxy = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });

    // 선제적 갱신 시 쿠키 저장
    if (!accessToken && token && token !== accessToken) {
      responseProxy.cookies.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });
    }
    return responseProxy;
  }

  // API 요청이 아닌 경우에 대한 페이지 접근 제어 로직
  // 2. 경로 분류
  const isGuestOnly = GUEST_ONLY_PATHS.some((path) => pathname === path);
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith("/social/callback"),
  );
  const isPrivate = !isGuestOnly && !isPublic;

  // 인증 확인 헬퍼 (accessToken이 있거나, refreshToken으로 갱신 가능한 경우)
  const checkAuth = async (): Promise<{
    isAuthenticated: boolean;
    newTokens?: User;
  }> => {
    if (accessToken) return { isAuthenticated: true };
    if (refreshToken) {
      console.log("Checking Auth: No access token, attempting refresh...");
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) return { isAuthenticated: true, newTokens };
    }
    return { isAuthenticated: false };
  };

  // 3. 비로그인 사용자만 접근 가능한 페이지 (Guest Only) -> /login
  if (isGuestOnly) {
    const { isAuthenticated, newTokens } = await checkAuth();
    if (isAuthenticated) {
      // 로그인 된 사용자가 접근 시 -> /home
      const response = NextResponse.redirect(new URL("/home", request.url));
      if (newTokens?.accessToken) {
        // 쿠키 갱신 (Silent Refresh가 일어났을 경우)
        response.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        });
        if (newTokens.refreshToken)
          response.cookies.set("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
      }
      return response;
    }
  }

  // 4. 로그인 된 사용자만 볼 수 있는 페이지 (Private)
  if (isPrivate) {
    const { isAuthenticated, newTokens } = await checkAuth();
    if (!isAuthenticated) {
      // 비로그인 사용자가 접근 시 -> / (루트 페이지로 리다이렉트)
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 갱신된 토큰이 있다면 쿠키 설정 필요
    if (newTokens?.accessToken) {
      const response = NextResponse.next();
      response.cookies.set("accessToken", newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });
      if (newTokens.refreshToken)
        response.cookies.set("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      return response;
    }
  }

  // 5. 둘 다 볼 수 있는 페이지 (Public)
  if (isPublic) {
  }

  return NextResponse.next();
}

export const config = {
  // 모든 경로 매치 (단, 정적 파일 제외)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
