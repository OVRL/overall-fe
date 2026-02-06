"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type InvitationStatus = "pending" | "accepted" | "expired";

interface Invitation {
    id: string;
    name: string;
    invitedAt: string;
    status: InvitationStatus;
}

const mockInvitations: Invitation[] = [
    { id: "1", name: "신규선수1", invitedAt: "2026-01-20", status: "pending" },
    { id: "2", name: "신규선수2", invitedAt: "2026-01-18", status: "accepted" },
    { id: "3", name: "탈퇴선수", invitedAt: "2025-12-01", status: "expired" },
];

const statusLabels: Record<InvitationStatus, { label: string; className: string }> = {
    pending: { label: "대기중", className: "bg-yellow-500/20 text-yellow-400" },
    accepted: { label: "수락", className: "bg-green-500/20 text-green-400" },
    expired: { label: "만료", className: "bg-gray-500/20 text-gray-400" },
};

export default function InvitationPanel() {
    const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
    const [inviteCode] = useState("TEAM-OVR-2026-ABCD");
    const [copied, setCopied] = useState(false);

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(`https://ovr-log.com/invite/${inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleResend = (id: string) => {
        alert(`초대를 재전송했습니다: ${id}`);
    };

    const handleCancel = (id: string) => {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-4">초대 관리</h3>

            {/* 초대 코드 */}
            <section className="bg-surface-tertiary rounded-lg p-4 mb-4">
                <h4 className="text-xs font-bold text-gray-400 mb-2">팀 초대 코드</h4>

                <div className="flex items-center gap-2 max-w-md">
                    <div className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-3 py-3 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={handleCopyCode}>
                        <code className="text-primary font-mono text-sm tracking-wider">{inviteCode}</code>
                        <span className={`text-xs transition-colors ${copied ? "text-green-400" : "text-gray-500 group-hover:text-white"}`}>
                            {copied ? "복사됨! ✓" : "클릭하여 복사"}
                        </span>
                    </div>

                    {/* 별도 버튼 (옵션) - 입력창 자체 클릭으로 UX 개선했으므로 버튼 크기 축소 */}
                    <button
                        onClick={handleCopyCode}
                        className="w-11 h-11 flex items-center justify-center bg-primary rounded-lg text-black hover:bg-primary-dark transition-colors"
                        title="링크 복사"
                    >
                        {copied ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 ml-1">
                    * 이 코드를 팀원에게 공유하면 팀에 자동으로 가입 신청됩니다.
                </p>
            </section>

            {/* 초대 현황 */}
            <section>
                <h4 className="text-sm font-bold text-white mb-2">초대 현황</h4>
                <div className="bg-surface-tertiary rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-surface-secondary">
                            <tr className="text-gray-400 text-left">
                                <th className="px-3 py-2">이름</th>
                                <th className="px-3 py-2">초대 일자</th>
                                <th className="px-3 py-2">상태</th>
                                <th className="px-3 py-2">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {invitations.map((inv) => (
                                <tr key={inv.id} className="hover:bg-white/5">
                                    <td className="px-3 py-2 text-white">{inv.name}</td>
                                    <td className="px-3 py-2 text-gray-400">{inv.invitedAt}</td>
                                    <td className="px-3 py-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusLabels[inv.status].className}`}>
                                            {statusLabels[inv.status].label}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {inv.status === "pending" && (
                                                <>
                                                    <button onClick={() => handleResend(inv.id)} className="text-primary hover:underline">재전송</button>
                                                    <button onClick={() => handleCancel(inv.id)} className="text-red-400 hover:underline">취소</button>
                                                </>
                                            )}
                                            {inv.status === "expired" && (
                                                <button onClick={() => handleResend(inv.id)} className="text-primary hover:underline">재발송</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
