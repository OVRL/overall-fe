import { redirect } from "next/navigation";

/**
 * 포메이션 화면은 항상 특정 경기 ID 경로(`/formation/[matchId]`)에서만 제공합니다.
 */
export default function FormationIndexPage() {
  redirect("/home");
}
