/**
 * 어드민 권한 관리 저장소
 * - 초기 슈퍼어드민: xodnqjtjt12@naver.com
 * - 서버리스 cold start 시 초기화됨 (프로토타입 전용)
 */

export interface AdminUser {
  email: string;
  role: "superadmin" | "admin";
  grantedAt: string;
  grantedBy: string;
}

class AdminStore {
  private admins = new Map<string, AdminUser>();

  constructor() {
    // 초기 슈퍼어드민 설정
    this.admins.set("xodnqjtjt12@naver.com", {
      email: "xodnqjtjt12@naver.com",
      role: "superadmin",
      grantedAt: new Date().toISOString(),
      grantedBy: "system",
    });
  }

  /** 이메일이 어드민 권한을 가졌는지 확인 */
  isAdmin(email: string): boolean {
    return this.admins.has(email);
  }

  /** 어드민 정보 조회 */
  getAdmin(email: string): AdminUser | undefined {
    return this.admins.get(email);
  }

  /** 어드민 권한 부여 (superadmin만 가능) */
  grantAdmin(
    targetEmail: string,
    grantedByEmail: string,
  ): AdminUser | null {
    const granter = this.admins.get(grantedByEmail);
    if (!granter || granter.role !== "superadmin") return null;

    const admin: AdminUser = {
      email: targetEmail,
      role: "admin",
      grantedAt: new Date().toISOString(),
      grantedBy: grantedByEmail,
    };
    this.admins.set(targetEmail, admin);
    return admin;
  }

  /** 어드민 권한 회수 (superadmin만 가능, 자기 자신은 불가) */
  revokeAdmin(targetEmail: string, revokerEmail: string): boolean {
    const revoker = this.admins.get(revokerEmail);
    if (!revoker || revoker.role !== "superadmin") return false;
    if (targetEmail === revokerEmail) return false;

    return this.admins.delete(targetEmail);
  }

  /** 전체 어드민 목록 */
  listAdmins(): AdminUser[] {
    return Array.from(this.admins.values());
  }
}

export const adminStore = new AdminStore();
