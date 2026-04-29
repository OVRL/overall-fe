import { NextRequest, NextResponse } from "next/server";
import {
  exchangeKakaoCodeForUserMe,
  fetchKakaoUserMeWithAccessToken,
} from "@/lib/social/kakao/kakaoUserMe";

type Body = {
  code?: string;
  redirectUri?: string;
  accessToken?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;

  if (body.accessToken) {
    const result = await fetchKakaoUserMeWithAccessToken(body.accessToken);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, data: result.userMe });
  }

  if (!body.code || !body.redirectUri) {
    return NextResponse.json(
      { ok: false, error: "accessToken 또는 code·redirectUri가 필요합니다." },
      { status: 400 },
    );
  }

  const result = await exchangeKakaoCodeForUserMe({
    code: body.code,
    redirectUri: body.redirectUri,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.userMe });
}

