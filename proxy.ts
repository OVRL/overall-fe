import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./lib/env";
import { GUEST_ONLY_ROUTES, PUBLIC_ROUTES } from "./lib/routes";
import { refreshAccessToken, type TokenPair } from "./lib/auth/refreshToken";
import { isAccessTokenExpired } from "./lib/auth/jwtAccess";

const BACKEND_URL = env.BACKEND_URL;

/**
 * 프록시 인증 디버그용 로그 (토큰 값은 출력하지 않음).
 * - 로컬: `next dev`면 자동 출력
 * - Vercel 등: 환경 변수 `DEBUG_PROXY_AUTH=1` 설정 후 재배포
 */
function logProxyAuthDebug(
  phase: string,
  request: NextRequest,
  cookieSnapshot: {
    accessToken: string | undefined;
    refreshToken: string | undefined;
  },
) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.DEBUG_PROXY_AUTH !== "1"
  ) {
    return;
  }
  const { pathname, search } = request.nextUrl;
  const access = cookieSnapshot.accessToken;
  const refresh = cookieSnapshot.refreshToken;
  console.log("[proxy auth]", phase, {
    method: request.method,
    pathname,
    search,
    isRscRequest: search.includes("_rsc="),
    cookieHeaderPresent: request.headers.has("cookie"),
    namedCookieCount: request.cookies.getAll().length,
    hasAccessTokenCookie: access != null,
    hasRefreshTokenCookie: refresh != null,
    accessExpired:
      access != null ? isAccessTokenExpired(access) : null,
    hasUserIdCookie: request.cookies.get("userId") != null,
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. API 요청 처리 (기존 로직 유지)
  if (pathname.startsWith("/api/")) {
    let token = accessToken;
    let preemptiveRefresh: TokenPair | null = null;

    if ((!token || isAccessTokenExpired(token)) && refreshToken) {
      console.log("API Proxy: access 없음 또는 만료, refresh 시도.");
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) {
        token = newTokens.accessToken;
        preemptiveRefresh = newTokens;
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

    // 선제적 refresh로 새 액세스를 받은 경우 Set-Cookie (만료 JWT가 쿠키에 남는 문제 완화)
    if (preemptiveRefresh?.accessToken) {
      responseProxy.cookies.set("accessToken", preemptiveRefresh.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });
      if (preemptiveRefresh.refreshToken) {
        responseProxy.cookies.set(
          "refreshToken",
          preemptiveRefresh.refreshToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          },
        );
      }
    }
    return responseProxy;
  }

  // API 요청이 아닌 경우에 대한 페이지 접근 제어 로직
  // 2. 경로 분류 (Pattern Matching)
  const isGuestOnly = GUEST_ONLY_ROUTES.some((pattern) =>
    pattern.test(pathname),
  );
  const isPublic = PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
  const isPrivate = !isGuestOnly && !isPublic;

  // 인증 확인 헬퍼 (accessToken이 있거나, refreshToken으로 갱신 가능한 경우). 실패 시 1회 재시도.
  const checkAuth = async (): Promise<{
    isAuthenticated: boolean;
    newTokens?: TokenPair;
  }> => {
    const accessUsable =
      accessToken != null && !isAccessTokenExpired(accessToken);
    if (accessUsable) {
      return { isAuthenticated: true };
    }
    if (refreshToken) {
      console.log(
        "Checking Auth: access 없음 또는 만료, refresh 시도...",
      );
      let newTokens = await refreshAccessToken(refreshToken);
      if (!newTokens?.accessToken) {
        console.log("Checking Auth: Refresh 실패, 1회 재시도...");
        newTokens = await refreshAccessToken(refreshToken);
      }
      if (newTokens?.accessToken)
        return { isAuthenticated: true, newTokens };
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
    logProxyAuthDebug("private:입력", request, {
      accessToken,
      refreshToken,
    });
    const { isAuthenticated, newTokens } = await checkAuth();
    if (!isAuthenticated) {
      logProxyAuthDebug("private:인증실패→clear-session", request, {
        accessToken,
        refreshToken,
      });
      // 비로그인/만료 사용자: 세션 쿠키를 제거한 뒤 로그인 페이지로 리다이렉트 (무효 토큰 잔존 방지)
      const clearSessionUrl = new URL(
        "/api/auth/clear-session",
        request.url,
      );
      clearSessionUrl.searchParams.set("redirect", "/");
      return NextResponse.redirect(clearSessionUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-is-private-route", "true");
    requestHeaders.set("x-pathname", pathname);

    let response;
    // 갱신된 토큰이 있다면 쿠키 설정 필요
    if (newTokens?.accessToken) {
      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
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
    } else {
      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return response;
  }

  // 5. 둘 다 볼 수 있는 페이지 (Public)
  if (isPublic) {
  }

  return NextResponse.next();
}

export const config = {
  // matcher: 정적 파일 및 API 등을 제외하여 성능 최적화 (icons: public 폴더 유니폼 등)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|videos|icons).*)",
  ],
};
