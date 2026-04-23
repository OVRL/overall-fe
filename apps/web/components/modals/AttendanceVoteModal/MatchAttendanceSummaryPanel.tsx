"use client";

import {
  memo,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import ChevronRightIcon from "@/public/icons/chevron_right.svg";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  useAttendancePopoverHoverClose,
  type AttendancePopoverOpenKind,
} from "@/hooks/useAttendancePopoverHoverClose";
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
import Icon from "@/components/ui/Icon";
import {
  partitionMatchAttendanceByStatus,
  type MatchAttendanceRow,
} from "./partitionMatchAttendanceByStatus";
import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";

export type { MatchAttendanceRow };
export { partitionMatchAttendanceByStatus };

export type MatchMercenarySummaryRow =
  findMatchAttendanceQuery["response"]["matchMercenaries"][number];

/** 팝오버 명단: 팀원 참석 행 또는 용병 (불참·미투표는 팀원 행만) */
export type AttendanceSummaryPopoverRow =
  | { kind: "team_member"; row: MatchAttendanceRow }
  | { kind: "mercenary"; id: number; name: string };

const HOVER_CAPABILITY_MQ = "(hover: hover) and (pointer: fine)";

const AttendanceMemberRow = memo(function AttendanceMemberRow({
  row,
}: {
  row: MatchAttendanceRow;
}) {
  const name = row.user?.name?.trim() || "이름 없음";
  const rawUrl = row.user?.profileImage?.trim() || "";
  const fallbackSrc = getPlayerPlaceholderSrc(
    getUserAvatarSeedFromGraphqlId(row.user?.id ?? row.userId) ??
      `u:${row.userId}`,
  );

  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProfileAvatar
        src={rawUrl || undefined}
        fallbackSrc={fallbackSrc}
        alt={name}
        size={36}
        className="shrink-0"
      />

      <span className="w-18.75 truncate text-sm h-8 text-Label-Primary flex items-center">
        {name}
      </span>
    </div>
  );
});

const AttendanceMercenaryRow = memo(function AttendanceMercenaryRow({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const displayName = name.trim() || "이름 없음";
  const fallbackSrc = getPlayerPlaceholderSrc(`merc:${id}`);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProfileAvatar
        src={undefined}
        fallbackSrc={fallbackSrc}
        alt={displayName}
        size={36}
        className="shrink-0"
      />

      <span className="w-18.75 truncate text-sm h-8 text-Label-Primary flex items-center">
        {displayName}
      </span>
    </div>
  );
});

const AttendanceListPanel = memo(function AttendanceListPanel({
  rows,
  emptyMessage,
}: {
  rows: AttendanceSummaryPopoverRow[];
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
    <ul className="max-h-42 list-none space-y-0.5 overflow-y-auto scrollbar-thin py-1">
      {rows.map((entry) => (
        <li
          key={
            entry.kind === "mercenary"
              ? `mercenary-${entry.id}`
              : `member-${entry.row.userId}`
          }
        >
          {entry.kind === "mercenary" ? (
            <AttendanceMercenaryRow id={entry.id} name={entry.name} />
          ) : (
            <AttendanceMemberRow row={entry.row} />
          )}
        </li>
      ))}
    </ul>
  );
});

const AttendanceSummaryStatusRow = memo(function AttendanceSummaryStatusRow({
  kind,
  count,
  totalVoters,
  rows,
  openKind,
  setOpenKind,
  prefersHoverOpen,
  cancelClose,
  scheduleClose,
  fillClassName,
}: {
  kind: "attend" | "absent";
  count: number;
  totalVoters: number;
  rows: AttendanceSummaryPopoverRow[];
  openKind: AttendancePopoverOpenKind;
  setOpenKind: Dispatch<SetStateAction<AttendancePopoverOpenKind>>;
  prefersHoverOpen: boolean;
  cancelClose: () => void;
  scheduleClose: () => void;
  fillClassName: string;
}) {
  const open = openKind === kind;
  const label = kind === "attend" ? "참석" : "불참";
  const emptyMessage =
    kind === "attend"
      ? "참석으로 투표한 사람이 없습니다."
      : "불참으로 투표한 사람이 없습니다.";

  const ratioPct =
    totalVoters > 0 ? Math.round((count / totalVoters) * 1000) / 10 : 0;

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (prefersHoverOpen) return;
      setOpenKind(next ? kind : null);
    },
    [prefersHoverOpen, kind, setOpenKind],
  );

  const onTriggerMouseEnter = useCallback(() => {
    if (!prefersHoverOpen) return;
    cancelClose();
    setOpenKind(kind);
  }, [prefersHoverOpen, cancelClose, setOpenKind, kind]);

  const onTriggerMouseLeave = useCallback(() => {
    if (!prefersHoverOpen) return;
    scheduleClose();
  }, [prefersHoverOpen, scheduleClose]);

  const onContentMouseEnter = useCallback(() => {
    if (!prefersHoverOpen) return;
    cancelClose();
  }, [prefersHoverOpen, cancelClose]);

  const onContentMouseLeave = useCallback(() => {
    if (!prefersHoverOpen) return;
    scheduleClose();
  }, [prefersHoverOpen, scheduleClose]);

  const onOpenAutoFocus = useCallback(
    (e: Event) => {
      if (prefersHoverOpen) e.preventDefault();
    },
    [prefersHoverOpen],
  );

  const triggerClass = cn(
    "inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-semibold text-Label-Primary",
    "outline-none transition-colors",
    prefersHoverOpen
      ? "cursor-default hover:text-Label-Secondary"
      : "cursor-pointer hover:text-Label-Secondary focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.9375rem] font-semibold text-white">
          {label}
        </span>
        <Popover modal={false} open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={triggerClass}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={`${count}명 ${label}, 명단 보기`}
              onMouseEnter={onTriggerMouseEnter}
              onMouseLeave={onTriggerMouseLeave}
            >
              <span className="text-white text-sm">{count}명</span>
              <Icon
                src={ChevronRightIcon}
                width={24}
                height={24}
                className="text-gray-500"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={6}
            collisionPadding={16}
            className={cn(
              "border border-gray-1000 bg-gray-1200 px-3 py-2 shadow-card w-32",
              "rounded-xl",
            )}
            onMouseEnter={onContentMouseEnter}
            onMouseLeave={onContentMouseLeave}
            onOpenAutoFocus={onOpenAutoFocus}
          >
            <AttendanceListPanel rows={rows} emptyMessage={emptyMessage} />
          </PopoverContent>
        </Popover>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-900"
        role="presentation"
      >
        <div
          className={cn(
            "h-full max-w-full rounded-full transition-[width] duration-200 ease-out",
            fillClassName,
          )}
          style={{ width: `${ratioPct}%` }}
        />
      </div>
    </div>
  );
});

type Props = {
  rows: readonly MatchAttendanceRow[];
  /** 해당 팀·경기 용병(라인업 후보). 참석 인원·명단에만 포함됩니다. */
  mercenaryRows?: readonly MatchMercenarySummaryRow[];
};

function buildAttendPopoverRows(
  attendMembers: readonly MatchAttendanceRow[],
  mercenaries: readonly MatchMercenarySummaryRow[],
): AttendanceSummaryPopoverRow[] {
  const memberEntries: AttendanceSummaryPopoverRow[] = attendMembers.map(
    (row) => ({ kind: "team_member", row }),
  );
  const sortedMercs = [...mercenaries].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ko");
    if (byName !== 0) return byName;
    return a.id - b.id;
  });
  const mercEntries: AttendanceSummaryPopoverRow[] = sortedMercs.map((m) => ({
    kind: "mercenary",
    id: m.id,
    name: m.name,
  }));
  return [...memberEntries, ...mercEntries];
}

function toMemberOnlyPopoverRows(
  members: readonly MatchAttendanceRow[],
): AttendanceSummaryPopoverRow[] {
  return members.map((row) => ({ kind: "team_member", row }));
}

/**
 * findMatchAttendance(+ matchMercenaries) 응답을 받아 카드형 요약·진행 바·명단 팝오버를 그립니다.
 * 데이터 페칭은 MatchAttendanceSummarySlot이 담당합니다.
 */
export function MatchAttendanceSummaryPanel({
  rows,
  mercenaryRows = [],
}: Props) {
  const { attend, absent } = useMemo(
    () => partitionMatchAttendanceByStatus(rows),
    [rows],
  );

  const attendPopoverRows = useMemo(
    () => buildAttendPopoverRows(attend, mercenaryRows),
    [attend, mercenaryRows],
  );

  const absentPopoverRows = useMemo(
    () => toMemberOnlyPopoverRows(absent),
    [absent],
  );

  const attendCount = attend.length + mercenaryRows.length;
  const totalVoters = attendCount + absent.length;

  const prefersHoverRaw = useMediaQuery(HOVER_CAPABILITY_MQ);
  const prefersHoverOpen = prefersHoverRaw === true;

  const [openKind, setOpenKind] = useState<AttendancePopoverOpenKind>(null);
  const { cancelClose, scheduleClose } = useAttendancePopoverHoverClose(
    setOpenKind,
  );

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl bg-gray-1300",
        "px-4 pt-4 pb-8 flex flex-col gap-4",
      )}
    >
      <AttendanceSummaryStatusRow
        kind="attend"
        count={attendCount}
        totalVoters={totalVoters}
        rows={attendPopoverRows}
        openKind={openKind}
        setOpenKind={setOpenKind}
        prefersHoverOpen={prefersHoverOpen}
        cancelClose={cancelClose}
        scheduleClose={scheduleClose}
        fillClassName="bg-Fill_AccentPrimary"
      />
      <AttendanceSummaryStatusRow
        kind="absent"
        count={absent.length}
        totalVoters={totalVoters}
        rows={absentPopoverRows}
        openKind={openKind}
        setOpenKind={setOpenKind}
        prefersHoverOpen={prefersHoverOpen}
        cancelClose={cancelClose}
        scheduleClose={scheduleClose}
        fillClassName="bg-gray-700"
      />
    </div>
  );
}
