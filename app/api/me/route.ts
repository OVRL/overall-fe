import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { UserModel } from "@/contexts/UserContext";

const FIND_USER_BY_ID_QUERY = `
  query FindUserById($id: Int!) {
    findUserById(id: $id) {
      id
      email
      name
      profileImage
      activityArea
      birthDate
      favoritePlayer
      foot
      gender
      mainPosition
      phone
      preferredNumber
      provider
      subPositions
    }
  }
`;

/**
 * 로그인된 현재 유저 정보를 쿠키(accessToken, userId) 기반으로 조회합니다.
 * 클라이언트에서 유저 정보 직접 확인/디버깅용으로 사용합니다.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userIdStr = cookieStore.get("userId")?.value;

    if (!accessToken || !userIdStr) {
      return NextResponse.json(
        { user: null, error: "쿠키에 accessToken 또는 userId 없음" },
        { status: 200 },
      );
    }

    const userId = Number(userIdStr);
    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { user: null, error: "유효하지 않은 userId" },
        { status: 200 },
      );
    }

    const res = await fetch(`${env.BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: FIND_USER_BY_ID_QUERY,
        variables: { id: userId },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { user: null, error: `백엔드 HTTP ${res.status}` },
        { status: 200 },
      );
    }

    const { data, errors } = await res.json();
    if (errors?.length) {
      return NextResponse.json(
        { user: null, error: errors[0]?.message ?? "GraphQL 에러" },
        { status: 200 },
      );
    }

    const raw = data?.findUserById;
    if (!raw) {
      return NextResponse.json({ user: null, error: "findUserById 결과 없음" }, { status: 200 });
    }

    const user: UserModel = {
      id: String(raw.id),
      email: raw.email,
      name: raw.name ?? null,
      profileImage: raw.profileImage ?? null,
      activityArea: raw.activityArea ?? null,
      birthDate: raw.birthDate ?? null,
      favoritePlayer: raw.favoritePlayer ?? null,
      foot: raw.foot ?? null,
      gender: raw.gender ?? null,
      mainPosition: raw.mainPosition ?? null,
      phone: raw.phone ?? null,
      preferredNumber: raw.preferredNumber ?? null,
      provider: raw.provider ?? null,
      subPositions: raw.subPositions ?? null,
    };

    return NextResponse.json({ user, error: null });
  } catch (err) {
    console.error("GET /api/me 예외:", err);
    return NextResponse.json(
      { user: null, error: err instanceof Error ? err.message : "서버 오류" },
      { status: 200 },
    );
  }
}
