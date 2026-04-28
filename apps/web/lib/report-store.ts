export type ReportType = "abuse" | "spam" | "illegal" | "etc";
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporterEmail: string;
  targetEmail: string;
  targetName?: string;
  type: ReportType;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  note?: string;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  abuse: "욕설/비하",
  spam: "스팸/도배",
  illegal: "불법 행위",
  etc: "기타",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "접수",
  reviewing: "검토중",
  resolved: "처리완료",
  dismissed: "무혐의",
};

export const REPORT_STATUS_COLORS: Record<ReportStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  reviewing: "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
  dismissed: "bg-gray-500/10 text-gray-400",
};

declare global {
  // eslint-disable-next-line no-var
  var __reportStore: Report[] | undefined;
}

function getStore(): Report[] {
  if (!globalThis.__reportStore) globalThis.__reportStore = [];
  return globalThis.__reportStore;
}

export const reportStore = {
  list(): Report[] {
    return [...getStore()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  get(id: string): Report | undefined {
    return getStore().find((r) => r.id === id);
  },

  create(data: Omit<Report, "id" | "createdAt" | "status">): Report {
    const report: Report = {
      ...data,
      id: `report_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    getStore().push(report);
    return report;
  },

  updateStatus(id: string, status: ReportStatus, resolvedBy: string, note?: string): Report | null {
    const store = getStore();
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    store[idx] = {
      ...store[idx],
      status,
      note,
      resolvedBy,
      resolvedAt: ["resolved", "dismissed"].includes(status) ? new Date().toISOString() : undefined,
    };
    return store[idx];
  },

  pendingCount(): number {
    return getStore().filter((r) => r.status === "pending").length;
  },
};
