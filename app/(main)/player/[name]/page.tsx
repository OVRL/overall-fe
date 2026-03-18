"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PlayerRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.name) {
      router.replace(`/player/${encodeURIComponent(params.name as string)}/history`);
    }
  }, [params.name, router]);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e5a0]"></div>
    </div>
  );
}
