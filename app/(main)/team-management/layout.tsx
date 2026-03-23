import { TeamManagementAccessGuard } from "@/components/team-management/TeamManagementAccessGuard";

export default function TeamManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeamManagementAccessGuard>{children}</TeamManagementAccessGuard>;
}
