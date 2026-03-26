"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLazyLoadQuery } from "react-relay";
import { ChevronDown } from "lucide-react";
import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";
import {
  getPlayerPlaceholderSrc,
  getUserAvatarSeedFromGraphqlId,
} from "@/lib/playerPlaceholderImage";

type AttendanceRow =
  findMatchAttendanceQuery["response"]["findMatchAttendance"][number];

type OpenKind = "attend" | "absent" | null;

const HOVER_CAPABILITY_MQ = "(hover: hover) and (pointer: fine)";
const HOVER_CLOSE_MS = 140;

function partitionByStatus(rows: readonly AttendanceRow[]) {
  const attend: AttendanceRow[] = [];
  const absent: AttendanceRow[] = [];
  for (const row of rows) {
    if (row.attendanceStatus === "ATTEND") attend.push(row);
    else if (row.attendanceStatus === "ABSENT") absent.push(row);
  }
  const byUser = (a: AttendanceRow, b: AttendanceRow) => a.userId - b.userId;
  attend.sort(byUser);
  absent.sort(byUser);
  return { attend, absent };
}

/** 호버 기반 열림에서 포커스 이동·스크롤 점프를 막기 위한 지연 닫기 */
function useHoverCloseTimer(setOpenKind: (k: OpenKind) => void) {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenKind(null);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, [cancelClose, setOpenKind]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  return { cancelClose, scheduleClose };
}

function AttendanceMemberRow({
  row,
  isMe,
}: {
  row: AttendanceRow;
  isMe: boolean;
}) {
  const name = row.user?.name?.trim() || "이름 없음";
  const rawUrl = row.user?.profileImage?.trim() || "";
  const fallbackSrc = getPlayerPlaceholderSrc(
    getUserAvatarSeedFromGraphqlId(row.user?.id ?? String(row.userId)) ??
      `u:${row.userId}`,
  );

  return (
    <div className="flex min-w-0 items-center gap-2 py-1.5 pe-1 ps-1">
      <ProfileAvatar
        src={rawUrl || undefined}
        fallbackSrc={fallbackSrc}
        alt={name}
        size={36}
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {isMe ? (
          <span
            className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-semibold text-gray-100"
            aria-label="나"
          >
            나
          </span>
        ) : null}
        <span className="truncate text-sm font-medium text-gray-1100">
          {name}
        </span>
      </div>
    </div>
  );
}

function AttendanceListPanel({
  rows,
  currentUserId,
  emptyMessage,
}: {
  rows: AttendanceRow[];
  currentUserId: number | null;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="px-2 py-3 text-center text-sm text-gray-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="max-h-60 list-none space-y-0.5 overflow-y-auto scrollbar-thin py-1">
      {rows.map((row) => (
        <li key={row.userId}>
          <AttendanceMemberRow
            row={row}
            isMe={currentUserId != null && row.userId === currentUserId}
          />
        </li>
      ))}
    </ul>
  );
}

function StatusSummaryTrigger({
  kind,
  count,
  rows,
  openKind,
  setOpenKind,
  prefersHoverOpen,
  currentUserId,
  cancelClose,
  scheduleClose,
}: {
  kind: "attend" | "absent";
  count: number;
  rows: AttendanceRow[];
  openKind: OpenKind;
  setOpenKind: Dispatch<SetStateAction<OpenKind>>;
  prefersHoverOpen: boolean;
  currentUserId: number | null;
  cancelClose: () => void;
  scheduleClose: () => void;
}) {
  const open = openKind === kind;
  const label = kind === "attend" ? "참석" : "불참";
  const emptyMessage =
    kind === "attend"
      ? "참석으로 투표한 사람이 없습니다."
      : "불참으로 투표한 사람이 없습니다.";

  const onOpenChange = (next: boolean) => {
    // 호버 가능 환경에서는 마우스 진입/이탈로만 열고 닫음 (트리거 클릭 토글과 충돌 방지)
    if (prefersHoverOpen) return;
    setOpenKind(next ? kind : null);
  };

  const triggerClass = cn(
    "inline-flex items-center gap-0.5 rounded-md px-0.5 py-0.5 text-sm font-semibold text-gray-100",
    "outline-none transition-colors",
    prefersHoverOpen
      ? "cursor-default hover:text-gray-200"
      : "cursor-pointer hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
  );

  return (
    <Popover
      /* 상위 다이얼로그(참석 투표 모달) 내부라 포커스 트랩 충돌을 피함 */
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`${count}명 ${label}, 명단 보기`}
          onMouseEnter={() => {
            if (!prefersHoverOpen) return;
            cancelClose();
            setOpenKind(kind);
          }}
          onMouseLeave={() => {
            if (!prefersHoverOpen) return;
            scheduleClose();
          }}
        >
          <span>
            {count}명 {label}
          </span>
          <ChevronDown
            className="size-3.5 shrink-0 opacity-80"
            aria-hidden
            strokeWidth={2.5}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        collisionPadding={16}
        className={cn(
          "w-[min(18rem,calc(100vw-2rem))] border border-gray-300 bg-surface-primary p-1 shadow-card",
          "rounded-lg text-Label-Primary",
        )}
        onMouseEnter={() => {
          if (!prefersHoverOpen) return;
          cancelClose();
        }}
        onMouseLeave={() => {
          if (!prefersHoverOpen) return;
          scheduleClose();
        }}
        onOpenAutoFocus={(e) => {
          if (prefersHoverOpen) e.preventDefault();
        }}
      >
        <AttendanceListPanel
          rows={rows}
          currentUserId={currentUserId}
          emptyMessage={emptyMessage}
        />
      </PopoverContent>
    </Popover>
  );
}

type Props = {
  matchId: number;
  teamId: number;
  currentUserId: number | null;
};

/**
 * findMatchAttendance 결과로 참석/불참 인원 수를 표시하고,
 * 데스크톱은 호버·터치 기기는 탭으로 명단 팝오버를 연다.
 */
export function MatchAttendanceSummary({
  matchId,
  teamId,
  currentUserId,
}: Props) {
  const data = useLazyLoadQuery<findMatchAttendanceQuery>(
    FindMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const { attend, absent } = useMemo(() => {
    const rows = data.findMatchAttendance ?? [];
    return partitionByStatus(rows);
  }, [data.findMatchAttendance]);

  const prefersHoverRaw = useMediaQuery(HOVER_CAPABILITY_MQ);
  const prefersHoverOpen = prefersHoverRaw === true;

  const [openKind, setOpenKind] = useState<OpenKind>(null);
  const { cancelClose, scheduleClose } = useHoverCloseTimer(setOpenKind);

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-sm font-semibold text-gray-100">
      <StatusSummaryTrigger
        kind="attend"
        count={attend.length}
        rows={attend}
        openKind={openKind}
        setOpenKind={setOpenKind}
        prefersHoverOpen={prefersHoverOpen}
        currentUserId={currentUserId}
        cancelClose={cancelClose}
        scheduleClose={scheduleClose}
      />
      <StatusSummaryTrigger
        kind="absent"
        count={absent.length}
        rows={absent}
        openKind={openKind}
        setOpenKind={setOpenKind}
        prefersHoverOpen={prefersHoverOpen}
        currentUserId={currentUserId}
        cancelClose={cancelClose}
        scheduleClose={scheduleClose}
      />
    </div>
  );
}
