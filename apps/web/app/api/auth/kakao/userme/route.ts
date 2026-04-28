import { NextRequest, NextResponse } from "next/server";
import { exchangeKakaoCodeForUserMe } from "@/lib/social/kakao/kakaoUserMe";

type Body = {
  code: string;
  redirectUri: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;

  if (!body.code || !body.redirectUri) {
    return NextResponse.json(
      { ok: false, error: "code 또는 redirectUri가 필요합니다." },
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

