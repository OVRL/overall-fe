"use client";

import React from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "@/lib/relay/environment";
import type { SerializedRelayRecords } from "@/lib/relay/serialization";

interface RelayProviderProps {
  children: React.ReactNode;
  /** SSR에서 직렬화한 Relay 스토어. 있으면 클라이언트에서 해당 데이터로 하이드레이션합니다. */
  initialRecords?: SerializedRelayRecords;
}

export default function RelayProvider({
  children,
  initialRecords,
}: RelayProviderProps) {
  const environment = getClientEnvironment(initialRecords);
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
