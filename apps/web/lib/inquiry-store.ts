/** 문의 상태 */
export type InquiryStatus = "pending" | "answered" | "closed";

/** 문의 유형 */
export type InquiryCategory =
  | "service"
  | "bug"
  | "report"
  | "user_tip"
  | "partnership"
  | "other";

export const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  service: "서비스 이용",
  bug: "버그 신고",
  user_tip: "유저 제보",
  report: "신고하기",
  partnership: "제휴 신청",
  other: "기타",
};

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  pending: "대기중",
  answered: "답변완료",
  closed: "종료",
};

/** 답변 */
export interface InquiryReply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

/** 문의 */
export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  replies: InquiryReply[];
  createdAt: string;
  updatedAt: string;
}

// --------------- In-Memory Store ---------------

class InquiryStore {
  private items = new Map<string, Inquiry>();
  private counter = 0;

  create(
    data: Pick<
      Inquiry,
      "name" | "phone" | "email" | "category" | "title" | "content"
    >,
  ): Inquiry {
    const id = String(++this.counter);
    const now = new Date().toISOString();
    const inquiry: Inquiry = {
      ...data,
      id,
      status: "pending",
      replies: [],
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(id, inquiry);
    return inquiry;
  }

  findAll(status?: InquiryStatus, category?: InquiryCategory): Inquiry[] {
    const all = Array.from(this.items.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    let filtered = all;
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (category) filtered = filtered.filter((i) => i.category === category);
    return filtered;
  }

  findById(id: string): Inquiry | undefined {
    return this.items.get(id);
  }

  addReply(id: string, content: string, author: string): Inquiry | undefined {
    const inquiry = this.items.get(id);
    if (!inquiry) return undefined;
    const reply: InquiryReply = {
      id: `${id}-r${inquiry.replies.length + 1}`,
      content,
      author,
      createdAt: new Date().toISOString(),
    };
    inquiry.replies.push(reply);
    inquiry.status = "answered";
    inquiry.updatedAt = new Date().toISOString();
    return inquiry;
  }

  updateStatus(id: string, status: InquiryStatus): Inquiry | undefined {
    const inquiry = this.items.get(id);
    if (!inquiry) return undefined;
    inquiry.status = status;
    inquiry.updatedAt = new Date().toISOString();
    return inquiry;
  }

  get totalCount() {
    return this.items.size;
  }

  get pendingCount() {
    return this.findAll("pending").length;
  }
}

// globalThis로 유지해 hot reload / cold start 시 초기화 방지
const g = globalThis as typeof globalThis & { __inquiryStore?: InquiryStore };
if (!g.__inquiryStore) g.__inquiryStore = new InquiryStore();
export const inquiryStore = g.__inquiryStore;
