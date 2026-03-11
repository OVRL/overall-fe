"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PositionChip from "@/components/PositionChip";
import type { TeamRole } from "./TeamManagementSidebar";
import { Position } from "@/types/position";

// Mock 팀원 데이터
interface TeamMember {
  id: string;
  name: string;
  gender: "M" | "F";
  birthDate: string;
  profileImage: string;
  mainPosition: Position;
  subPositions: Position[];
  mainFoot: "L" | "R" | "B"; // 왼발, 오른발, 양발
  preferredNumber: number;
  role: TeamRole;
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "정태우",
    gender: "M",
    birthDate: "1990-03-15",
    profileImage: "/images/ovr.png",
    mainPosition: "MF",
    subPositions: ["CAM", "CM"],
    mainFoot: "R",
    preferredNumber: 10,
    role: "manager",
  },
  {
    id: "2",
    name: "김코치",
    gender: "M",
    birthDate: "1985-08-22",
    profileImage: "/images/ovr.png",
    mainPosition: "DF",
    subPositions: ["CB", "CDM"],
    mainFoot: "R",
    preferredNumber: 4,
    role: "coach",
  },
  {
    id: "3",
    name: "박무트",
    gender: "M",
    birthDate: "1998-01-10",
    profileImage: "/images/player/img_player_1.webp",
    mainPosition: "GK",
    subPositions: [],
    mainFoot: "R",
    preferredNumber: 1,
    role: "player",
  },
  {
    id: "4",
    name: "호남두",
    gender: "M",
    birthDate: "1995-06-20",
    profileImage: "/images/player/img_player_2.webp",
    mainPosition: "LB",
    subPositions: ["LWB"],
    mainFoot: "L",
    preferredNumber: 3,
    role: "player",
  },
  {
    id: "5",
    name: "알베스",
    gender: "M",
    birthDate: "1992-11-05",
    profileImage: "/images/player/img_player_8.webp",
    mainPosition: "CAM",
    subPositions: ["CM", "ST"],
    mainFoot: "B",
    preferredNumber: 8,
    role: "player",
  },
];

interface TeamSettingsPanelProps {
  userRole: TeamRole;
}

// 발자국 아이콘 컴포넌트 (두 개의 발 모양 - 활성:초록, 비활성:회색)
const FootIcon = ({ foot }: { foot: "L" | "R" | "B" }) => {
  const leftActive = foot === "L" || foot === "B";
  const rightActive = foot === "R" || foot === "B";

  const footLabel =
    foot === "L" ? "왼발잡이" : foot === "R" ? "오른발잡이" : "양발잡이";

  return (
    <div title={footLabel} className="flex items-center gap-1">
      {/* 왼발 */}
      <svg
        width="24"
        height="30"
        viewBox="0 0 24 28"
        fill="none"
        className={leftActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="12"
          fill="black"
          fontWeight="bold"
        >
          L
        </text>
      </svg>
      {/* 오른발 */}
      <svg
        width="24"
        height="30"
        viewBox="0 0 24 28"
        fill="none"
        className={rightActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="12"
          fill="black"
          fontWeight="bold"
        >
          R
        </text>
      </svg>
    </div>
  );
};

export default function TeamSettingsPanel({
  userRole,
}: TeamSettingsPanelProps) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("바르셀로나 FC");
  const [foundedYear, setFoundedYear] = useState("2020");
  const [description, setDescription] = useState("최고의 팀을 향해!");
  const [frequentArea, setFrequentArea] = useState("용인 수지구");
  const [ownerId, setOwnerId] = useState<string>("1"); // Default to manager (id: "1")

  const [members, setMembers] = useState<TeamMember[]>(mockMembers);

  // 권한 변경 모달
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    memberId: string;
    memberName: string;
    newRole: TeamRole;
  } | null>(null);

  // 팀 삭제 모달
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    type: "warning" | "delete";
  }>({ show: false, type: "warning" });

  // 방출 확인 모달
  const [kickModal, setKickModal] = useState<{
    show: boolean;
    memberId: string;
    memberName: string;
  } | null>(null);

  const isManager = userRole === "manager";
  const isCoach = userRole === "coach";
  const canManage = isManager || isCoach;

  const handleRoleChangeRequest = (
    memberId: string,
    memberName: string,
    newRole: TeamRole,
  ) => {
    setConfirmModal({ show: true, memberId, memberName, newRole });
  };

  const handleRoleChangeConfirm = () => {
    if (!confirmModal) return;
    if (confirmModal.newRole === "manager") {
      alert(
        `[${confirmModal.memberName}]님에게 감독 권한을 위임했습니다. 홈으로 이동합니다.`,
      );
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === confirmModal.memberId) return { ...m, role: "manager" };
          if (m.role === "manager") return { ...m, role: "player" };
          return m;
        }),
      );
      setConfirmModal(null);
      router.push("/home");
      return;
    }
    setMembers((prev) =>
      prev.map((m) =>
        m.id === confirmModal.memberId
          ? { ...m, role: confirmModal.newRole }
          : m,
      ),
    );
    setConfirmModal(null);
  };

  // 방출 요청
  const handleKickRequest = (memberId: string, memberName: string) => {
    setKickModal({ show: true, memberId, memberName });
  };

  // 방출 확정
  const handleKickConfirm = () => {
    if (!kickModal) return;
    setMembers((prev) => prev.filter((m) => m.id !== kickModal.memberId));
    setKickModal(null);
  };

  const handleDeleteButtonClick = () => {
    const hasOtherMembers = members.length > 1;
    setDeleteModal({
      show: true,
      type: hasOtherMembers ? "warning" : "delete",
    });
  };

  const handleFinalDelete = () => {
    alert("팀이 삭제되었습니다.");
    setDeleteModal({ show: false, type: "delete" });
    router.push("/home");
  };

  const formatBirthDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const roleLabels: Record<TeamRole, string> = {
    manager: "감독",
    coach: "코치",
    player: "선수",
  };

  const ownerMember = members.find((m) => m.id === ownerId);

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-5xl mx-auto">
      {/* 팀 정보 섹션 (New) */}
      <section className="bg-[#242424] rounded-3xl overflow-hidden shadow-lg border border-white/5 relative">
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 relative z-10">
          {/* 로고 영역 */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#333] shadow-xl bg-[#1a1a1a] group">
              <Image
                src="/images/ovr.png"
                alt="Team Logo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {isManager && (
                <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-bold border border-white/30 px-3 py-1 rounded-full backdrop-blur-md">
                    로고 변경
                  </span>
                </button>
              )}
            </div>
            {isManager ? (
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="text-2xl font-bold text-center bg-transparent border-b border-transparent hover:border-white/20 focus:border-primary outline-hidden text-white transition-colors w-full max-w-[200px]"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white text-center">
                {teamName}
              </h2>
            )}
          </div>

          {/* 정보 입력 영역 */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                소개글
              </label>
              {isManager ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-gray-300 resize-none h-24 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-hidden transition-all"
                  placeholder="팀 소개를 입력하세요..."
                />
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#1a1a1a] p-4 rounded-xl border border-white/5 h-24 overflow-y-auto">
                  {description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    주 활동 지역
                  </label>
                  {isManager ? (
                    <input
                      type="text"
                      value={frequentArea}
                      onChange={(e) => setFrequentArea(e.target.value)}
                      className="w-full bg-[#1a1a1a] rounded-xl px-3 py-2.5 text-sm text-gray-300 border border-white/5 focus:border-primary/50 outline-hidden transition-all"
                    />
                  ) : (
                    <div className="text-sm text-white font-medium bg-[#1a1a1a] px-3 py-2.5 rounded-xl border border-white/5">
                      {frequentArea}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    창단일
                  </label>
                  <div className="text-sm text-white font-medium bg-[#1a1a1a] px-3 py-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                    {foundedYear}
                    <span className="text-xs text-gray-600">불변</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  구단주 (소유자)
                </label>
                {isManager ? (
                  <div className="relative">
                    <select
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      className="w-full bg-[#1a1a1a] rounded-xl pl-3 pr-10 py-2.5 text-sm text-white appearance-none border border-white/5 focus:border-primary/50 outline-hidden cursor-pointer"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({roleLabels[m.role]})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      ▼
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2.5 rounded-xl border border-white/5">
                    {ownerMember ? (
                      <>
                        <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-700">
                          <Image
                            src={ownerMember.profileImage}
                            alt={ownerMember.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-white font-medium">
                          {ownerMember.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">미지정</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 구성원 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">선수단</h3>
            <span className="bg-[#333] text-primary text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
              {members.length}
            </span>
          </div>
        </div>

        <div className="bg-[#242424] rounded-3xl overflow-hidden shadow-lg border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1e1e1e] border-b border-white/5">
                <tr className="text-gray-400 text-left">
                  <th className="px-6 py-4 font-medium whitespace-nowrap">
                    프로필
                  </th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-center">
                    팀 등번호
                  </th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-center">
                    포지션
                  </th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-center">
                    주발
                  </th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-center">
                    역할
                  </th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-right">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-gray-800 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                          <Image
                            src={member.profileImage}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-white font-bold text-base">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {member.gender === "M" ? "남성" : "여성"} ·{" "}
                            {formatBirthDate(member.birthDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className="text-white font-mono text-xl font-bold opacity-80">
                        {member.preferredNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1.5">
                        <PositionChip
                          position={member.mainPosition}
                          variant="filled"
                          className="text-xs px-2.5 py-0.5"
                        />
                        {member.subPositions.length > 0 && (
                          <div className="flex gap-1">
                            {member.subPositions.slice(0, 2).map((p) => (
                              <span
                                key={p}
                                className="text-[10px] text-gray-500 bg-[#333] px-1.5 rounded"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* 주발 - 발자국 아이콘 */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <FootIcon foot={member.mainFoot} />
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                          member.role === "manager"
                            ? "bg-primary text-black"
                            : member.role === "coach"
                              ? "bg-blue-500 text-white"
                              : "bg-[#333] text-gray-400"
                        }`}
                      >
                        {roleLabels[member.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {member.role !== "manager" && canManage ? (
                        <div className="flex justify-end gap-2">
                          {/* 권한 변경 버튼 - 텍스트 형태 */}
                          {isManager && (
                            <>
                              <button
                                onClick={() =>
                                  handleRoleChangeRequest(
                                    member.id,
                                    member.name,
                                    "player",
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded-lg transition-all ${
                                  member.role === "player"
                                    ? "bg-gray-700 text-gray-500 cursor-default"
                                    : "bg-[#333] text-gray-400 hover:bg-gray-600 hover:text-white"
                                }`}
                                disabled={member.role === "player"}
                              >
                                선수
                              </button>
                              <button
                                onClick={() =>
                                  handleRoleChangeRequest(
                                    member.id,
                                    member.name,
                                    "coach",
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded-lg transition-all ${
                                  member.role === "coach"
                                    ? "bg-blue-500/30 text-blue-300 cursor-default"
                                    : "bg-[#333] text-gray-400 hover:bg-blue-600 hover:text-white"
                                }`}
                                disabled={member.role === "coach"}
                              >
                                코치
                              </button>
                              <button
                                onClick={() =>
                                  handleRoleChangeRequest(
                                    member.id,
                                    member.name,
                                    "manager",
                                  )
                                }
                                className="text-xs px-2 py-1 rounded-lg bg-[#333] text-primary border border-primary/30 hover:bg-primary hover:text-black transition-all"
                              >
                                감독
                              </button>
                            </>
                          )}
                          {/* 방출 버튼 */}
                          <button
                            onClick={() =>
                              handleKickRequest(member.id, member.name)
                            }
                            className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                          >
                            방출
                          </button>
                        </div>
                      ) : member.role === "manager" ? (
                        <span className="text-xs text-gray-500 italic pr-2">
                          Me
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 팀 삭제 */}
      {isManager && (
        <div className="flex justify-center pt-8 pb-10">
          <button
            onClick={handleDeleteButtonClick}
            className="text-xs text-gray-600 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5 opacity-60 hover:opacity-100"
          >
            팀 삭제하기
          </button>
        </div>
      )}

      {/* 권한 변경 모달 */}
      {confirmModal?.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 animate-fade-in p-4">
          <div className="bg-[#242424] rounded-4xl p-8 w-full max-w-sm text-center shadow-2xl border border-white/10 animate-scale-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />

            {confirmModal.newRole === "manager" ? (
              <>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner ring-1 ring-primary/30">
                  👑
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  감독 위임
                </h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  <strong className="text-white text-base">
                    {confirmModal.memberName}
                  </strong>
                  님에게
                  <br />
                  팀의 모든 권한을 넘기시겠습니까?
                </p>
                <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-left mb-8">
                  <ul className="text-xs text-red-300 space-y-1.5 list-disc list-inside">
                    <li>
                      본인은 <strong>선수</strong> 등급으로 변경됩니다.
                    </li>
                    <li>팀 설정 및 관리 권한이 영구적으로 사라집니다.</li>
                    <li>완료 즉시 홈 화면으로 이동합니다.</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={handleRoleChangeConfirm}
                    className="w-full py-4 rounded-2xl font-bold text-base bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    위임하고 나가기
                  </Button>
                  <Button
                    variant="line"
                    onClick={() => setConfirmModal(null)}
                    className="w-full py-3 rounded-2xl border-none text-gray-500 hover:bg-white/5 hover:text-white"
                  >
                    취소
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner ring-1 ring-white/10">
                  🔄
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  권한 변경
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  <strong className="text-white text-lg">
                    {confirmModal.memberName}
                  </strong>
                  님의 역할을
                  <br />
                  <strong className="text-primary text-lg">
                    {roleLabels[confirmModal.newRole]}
                  </strong>
                  (으)로 변경합니다.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="line"
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3.5 rounded-2xl border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRoleChangeConfirm}
                    className="flex-1 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/10"
                  >
                    변경하기
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 방출 확인 모달 */}
      {kickModal?.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-modal animate-fade-in p-4">
          <div className="bg-[#242424] rounded-4xl p-8 w-full max-w-sm text-center shadow-2xl border border-white/10 animate-scale-up">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ring-1 ring-red-500/30">
              🚪
            </div>
            <h3 className="text-xl font-bold text-white mb-2">선수 방출</h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              <strong className="text-red-400 text-lg">
                {kickModal.memberName}
              </strong>{" "}
              선수를
              <br />
              팀에서 방출하시겠습니까?
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={handleKickConfirm}
                className="w-full py-4 rounded-2xl font-bold text-base bg-red-500 border-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                네, 방출합니다
              </Button>
              <Button
                variant="line"
                onClick={() => setKickModal(null)}
                className="w-full py-3 rounded-2xl border-none text-gray-500 hover:bg-white/5 hover:text-white"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 팀 삭제 모달 */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-modal animate-fade-in p-4">
          <div className="bg-[#242424] rounded-4xl p-8 w-full max-w-sm text-center shadow-2xl border border-white/10 animate-scale-up">
            {deleteModal.type === "warning" ? (
              <>
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ring-1 ring-yellow-500/30">
                  ⚠️
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  팀원이 남아있어요
                </h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  팀에 다른 구성원이 있으면 삭제할 수 없습니다.
                  <br />
                  모두 방출하거나 감독을 위임해주세요.
                </p>
                <Button
                  variant="primary"
                  onClick={() =>
                    setDeleteModal({ ...deleteModal, show: false })
                  }
                  className="w-full py-4 rounded-2xl font-bold text-base bg-[#333] text-white hover:bg-[#444]"
                >
                  확인
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ring-1 ring-red-500/30">
                  🗑️
                </div>
                <h3 className="text-xl font-bold text-red-500 mb-2">
                  정말 삭제하시겠습니까?
                </h3>
                <p className="text-sm text-gray-400 mb-8">
                  팀의 모든 데이터가 영구적으로 삭제되며
                  <br />이 작업은 <strong>되돌릴 수 없습니다.</strong>
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={handleFinalDelete}
                    className="w-full py-4 rounded-2xl font-bold text-base bg-red-500 border-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                  >
                    네, 삭제하겠습니다
                  </Button>
                  <Button
                    variant="line"
                    onClick={() =>
                      setDeleteModal({ ...deleteModal, show: false })
                    }
                    className="w-full py-3 rounded-2xl border-none text-gray-500 hover:bg-white/5 hover:text-white"
                  >
                    취소
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
