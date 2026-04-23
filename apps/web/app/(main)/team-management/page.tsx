"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamManagementPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/team-management/settings");
  }, [router]);

  return null;
}
