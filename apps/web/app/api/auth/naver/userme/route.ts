import { NextRequest, NextResponse } from "next/server";
import { exchangeNaverCodeForUserMe } from "@/lib/social/naver/naverUserMe";

type Body = {
  code?: string;
  state?: string;
  redirectUri?: string;
  accessToken?: string;
};

async function requestNaverUserMe(accessToken: string) {
  const res = await fetch("https://openapi.naver.com/v1/nid/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const json = (await res.json()) as unknown;
  if (!res.ok) {
    return { ok: false as const, error: json };
  }
  return { ok: true as const, data: json };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;

  if (body.accessToken) {
    const userMeRes = await requestNaverUserMe(body.accessToken);
    if (!userMeRes.ok) {
      return NextResponse.json(
        { ok: false, error: userMeRes.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, data: userMeRes.data });
  }

  if (!body.code || !body.state || !body.redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "accessToken 또는 code/state/redirectUri가 필요합니다.",
      },
      { status: 400 },
    );
  }

  const result = await exchangeNaverCodeForUserMe({
    code: body.code,
    state: body.state,
    redirectUri: body.redirectUri,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.userMe });
}
