import Link from "next/link";
import { cookies, headers } from "next/headers";
import { Button } from "@/components/ui/Button";
import { exchangeKakaoCodeForUserMe } from "@/lib/social/kakao/kakaoUserMe";
import { exchangeNaverCodeForUserMe } from "@/lib/social/naver/naverUserMe";

export const dynamic = "force-dynamic";

const STATE_COOKIE_PREFIX = "oauth_state_";

type PageProps = {
  params: Promise<{ provider: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function SocialCallbackPage({
  params,
  searchParams,
}: PageProps) {
  const { provider } = await params;
  const sp = await searchParams;

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";
  const redirectUri = origin
    ? `${origin}/social/${provider}/callback`
    : "";

  const code = first(sp.code);
  const state = first(sp.state);
  const oauthError = first(sp.error);
  const oauthErrorDescription = first(sp.error_description);

  const cookieStore = await cookies();

  if (provider !== "kakao" && provider !== "naver") {
    return (
      <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-sm text-Label-Alternative">
          아직 지원하지 않는 provider입니다: {provider}
        </p>
        <Link href="/login/social">
          <Button size="l">로그인으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  if (oauthError) {
    return (
      <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-sm text-Label-Alternative">
          OAuth 오류: {oauthError}
          {oauthErrorDescription ? ` (${oauthErrorDescription})` : ""}
        </p>
        <Link href="/login/social">
          <Button size="l">로그인으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  if (!code) {
    return (
      <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-sm text-Label-Alternative">code가 없습니다.</p>
        <Link href="/login/social">
          <Button size="l">로그인으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  if (!redirectUri) {
    return (
      <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-sm text-Label-Alternative">
          요청 호스트를 확인할 수 없어 redirect_uri를 만들 수 없습니다.
        </p>
        <Link href="/login/social">
          <Button size="l">로그인으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  let result:
    | { ok: true; userMe: unknown }
    | { ok: false; error: unknown };

  if (provider === "kakao") {
    if (!state) {
      return (
        <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-sm text-Label-Alternative">state가 없습니다.</p>
          <Link href="/login/social">
            <Button size="l">로그인으로 돌아가기</Button>
          </Link>
        </main>
      );
    }

    if (state) {
      const expected = cookieStore.get(`${STATE_COOKIE_PREFIX}${provider}`)?.value;
      if (!expected || expected !== state) {
        return (
          <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
            <p className="text-sm text-Label-Alternative">
              state가 일치하지 않습니다.
            </p>
            <Link href="/login/social">
              <Button size="l">로그인으로 돌아가기</Button>
            </Link>
          </main>
        );
      }
    }

    result = await exchangeKakaoCodeForUserMe({
      code,
      redirectUri,
    });
  } else {
    if (!state) {
      return (
        <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-sm text-Label-Alternative">state가 없습니다.</p>
          <Link href="/login/social">
            <Button size="l">로그인으로 돌아가기</Button>
          </Link>
        </main>
      );
    }

    const expected = cookieStore.get(`${STATE_COOKIE_PREFIX}${provider}`)?.value;
    if (!expected || expected !== state) {
      return (
        <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-sm text-Label-Alternative">
            state가 일치하지 않습니다.
          </p>
          <Link href="/login/social">
            <Button size="l">로그인으로 돌아가기</Button>
          </Link>
        </main>
      );
    }

    result = await exchangeNaverCodeForUserMe({
      code,
      state,
      redirectUri,
    });
  }

  return (
    <main className="min-h-dvh w-full px-6 py-10 max-w-2xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-Label-Normal">
          소셜 로그인 콜백 ({provider})
        </h1>
        <p className="text-sm text-Label-Alternative">조회 결과</p>
      </div>

      <div className="rounded-lg border border-Fill-Alternative p-4 bg-bg-0">
        <div className="flex justify-end">
          <Link href="/login/social">
            <Button size="s" variant="ghost">
              다시 시도
            </Button>
          </Link>
        </div>
        <pre className="mt-3 overflow-auto text-xs text-Label-Normal whitespace-pre-wrap break-words">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </main>
  );
}
