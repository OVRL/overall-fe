"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PlayerRedirectInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (params.name) {
      const base = `/player/${encodeURIComponent(params.name as string)}/history`;
      const qs = searchParams.toString();
      router.replace(qs ? `${base}?${qs}` : base);
    }
  }, [params.name, router, searchParams]);

  return null;
}

export default function PlayerRedirectPage() {
  return (
    <div className="min-h-dvh bg-[#080808] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
      <Suspense>
        <PlayerRedirectInner />
      </Suspense>
    </div>
  );
}
