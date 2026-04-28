export type NoticeType = "info" | "warning" | "maintenance" | "update";

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: NoticeType;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  startsAt?: string | null;
  endsAt?: string | null;
}

export const NOTICE_TYPE_LABELS: Record<NoticeType, string> = {
  info: "공지",
  warning: "경고",
  maintenance: "점검",
  update: "업데이트",
};

export const NOTICE_TYPE_COLORS: Record<NoticeType, string> = {
  info: "bg-blue-500/10 text-blue-400",
  warning: "bg-yellow-500/10 text-yellow-400",
  maintenance: "bg-red-500/10 text-red-400",
  update: "bg-green-500/10 text-green-400",
};

declare global {
  // eslint-disable-next-line no-var
  var __noticeStore: Notice[] | undefined;
}

function getStore(): Notice[] {
  if (!globalThis.__noticeStore) globalThis.__noticeStore = [];
  return globalThis.__noticeStore;
}

export const noticeStore = {
  list(): Notice[] {
    return [...getStore()].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  get(id: string): Notice | undefined {
    return getStore().find((n) => n.id === id);
  },

  create(data: Omit<Notice, "id" | "createdAt" | "updatedAt">): Notice {
    const notice: Notice = {
      ...data,
      id: `notice_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    getStore().push(notice);
    return notice;
  },

  update(id: string, data: Partial<Omit<Notice, "id" | "createdAt">>): Notice | null {
    const store = getStore();
    const idx = store.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
    return store[idx];
  },

  delete(id: string): boolean {
    const store = getStore();
    const idx = store.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  },

  publishedList(): Notice[] {
    const now = new Date();
    return getStore().filter((n) => {
      if (!n.isPublished) return false;
      if (n.endsAt && new Date(n.endsAt) < now) return false;
      return true;
    });
  },
};
