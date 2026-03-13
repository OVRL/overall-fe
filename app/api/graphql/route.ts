import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { refreshAccessToken } from "@/lib/auth/refreshToken";

const BACKEND_URL = env.BACKEND_URL;

/**
 * 클라이언트 GraphQL 요청을 백엔드로 프록시하며,
 * 쿠키의 accessToken(또는 refreshToken 갱신 결과)을 Authorization 헤더로 붙입니다.
 * Relay fetchGraphQL이 이 경로로 요청하면 인증이 적용됩니다.
 */
export async function POST(request: NextRequest) {
  const accessToken =
    request.cookies.get("accessToken")?.value ??
    (process.env.NODE_ENV === "development" ? env.DEV_ACCESS_TOKEN : undefined);
  const refreshToken =
    request.cookies.get("refreshToken")?.value ??
    (process.env.NODE_ENV === "development" ? env.DEV_REFRESH_TOKEN : undefined);

  let token = accessToken;
  if (!token && refreshToken) {
    const newTokens = await refreshAccessToken(refreshToken);
    if (newTokens?.accessToken) token = newTokens.accessToken;
  }

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  const body = isMultipart ? await request.blob() : await request.text();
  const headers: HeadersInit = {
    ...(isMultipart ? { "Content-Type": contentType } : { "Content-Type": "application/json" }),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  let backendResponse = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers,
    body,
  });

  if (backendResponse.status === 401 && refreshToken) {
    const newTokens = await refreshAccessToken(refreshToken);
    if (newTokens?.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${newTokens.accessToken}`;
      backendResponse = await fetch(`${BACKEND_URL}/graphql`, {
        method: "POST",
        headers,
        body,
      });

      const response = new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: new Headers(backendResponse.headers),
      });
      response.cookies.set("accessToken", newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });
      if (newTokens.refreshToken) {
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

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: new Headers(backendResponse.headers),
  });
}
