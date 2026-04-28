export interface SuspendedUser {
  email: string;
  suspendedBy: string;
  suspendedAt: string;
  expiresAt: string | null; // null = 영구정지
  reason?: string;
}

class SuspendStore {
  private suspensions = new Map<string, SuspendedUser>();

  suspend(email: string, suspendedBy: string, days: number | "permanent", reason?: string): SuspendedUser {
    const now = new Date();
    const expiresAt = days === "permanent" ? null : new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    const entry: SuspendedUser = {
      email,
      suspendedBy,
      suspendedAt: now.toISOString(),
      expiresAt,
      reason,
    };
    this.suspensions.set(email, entry);
    return entry;
  }

  unsuspend(email: string): boolean {
    return this.suspensions.delete(email);
  }

  isSuspended(email: string): boolean {
    const s = this.suspensions.get(email);
    if (!s) return false;
    if (s.expiresAt === null) return true;
    return new Date(s.expiresAt) > new Date();
  }

  get(email: string): SuspendedUser | undefined {
    return this.suspensions.get(email);
  }

  listAll(): SuspendedUser[] {
    return Array.from(this.suspensions.values());
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _suspendStore: SuspendStore | undefined;
}

export const suspendStore = globalThis._suspendStore ?? (globalThis._suspendStore = new SuspendStore());
