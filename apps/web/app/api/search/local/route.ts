import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const NAVER_LOCAL_API = "https://openapi.naver.com/v1/search/local.json";
const DISPLAY = 10;

/** 네이버 지역 검색 API 응답 item (mapx/mapy: WGS84×1e7 정수 또는 구형 TM128 — 클라이언트에서 구분) */
interface NaverLocalItem {
  title: string;
  link: string;
  category: string;
  description: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface NaverLocalResponse {
  items: NaverLocalItem[];
  total: number;
  start: number;
  display: number;
}

/**
 * 네이버 개발자센터 지역 검색 API 프록시.
 * Client Secret 보안을 위해 서버에서만 호출.
 * GET /api/search/local?query=양지공원
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json(
      { error: "query 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  // 네이버 개발자센터 검색 API 인증 (공식문서: X-Naver-Client-Id, X-Naver-Client-Secret 헤더 필수)
  const clientId = env.NAVER_CLIENT_ID?.trim();
  const clientSecret = env.NAVER_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 환경 변수를 설정해 주세요." },
      { status: 500 },
    );
  }

  const url = new URL(NAVER_LOCAL_API);
  url.searchParams.set("query", query);
  url.searchParams.set("display", String(DISPLAY));
  url.searchParams.set("start", "1");
  url.searchParams.set("sort", "random");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    const is401 = res.status === 401;
    return NextResponse.json(
      {
        error: "지역 검색 API 오류",
        detail: text,
        ...(is401 && {
          hint: "네이버 개발자센터(developers.naver.com) 앱의 클라이언트 ID/시크릿인지 확인하고, 해당 앱에서 '검색' API 사용 설정이 켜져 있는지 확인해 주세요. NCP 지도용 키와 별도입니다.",
        }),
      },
      { status: res.status },
    );
  }

  const data = (await res.json()) as NaverLocalResponse;
  const items = data.items ?? [];

  return NextResponse.json({ items });
}
