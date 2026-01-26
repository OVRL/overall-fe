"use client";

import React from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "@/lib/relay/environment";

export default function RelayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const environment = getClientEnvironment();
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
