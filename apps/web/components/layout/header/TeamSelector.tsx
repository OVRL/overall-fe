"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Icon from "@/components/ui/Icon";
import { isSameTeamId } from "@/lib/relay/parseRelayGlobalId";
import { cn } from "@/lib/utils";
import arrow_down from "@/public/icons/arrow_down.svg";
import arrow_up from "@/public/icons/arrow_up.svg";
import plus from "@/public/icons/plus.svg";

export interface TeamOption {
  id: string;
  name: string;
  imageUrl?: string;
}

interface TeamSelectorProps {
  /** 팀 목록 */
  teams: TeamOption[];
  /** 현재 선택된 팀 ID (null이면 팀 없음) */
  selectedTeamId: string | null;
  /** 팀 선택 시 */
  onSelect: (teamId: string) => void;
  /** 팀 만들기 클릭 시 (선택 사항) */
  onCreateTeam?: () => void;
}

const DEFAULT_TEAM_IMAGE = "/images/ovr.png";

/**
 * 팀 선택 드롭다운 (Figma OVR 디자인: 160-1286, 209-1356, 209-1310)
 */
function TeamSelector({
  teams,
  selectedTeamId,
  onSelect,
  onCreateTeam,
}: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isKeyboardRef = useRef(false);

  const selectedTeam = selectedTeamId
    ? teams.find((t) => isSameTeamId(selectedTeamId, t.id))
    : null;
  const hasTeams = teams.length > 0;
  const optionCount = teams.length + (onCreateTeam ? 1 : 0);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useClickOutside(dropdownRef, close);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      close();
    },
    [onSelect, close],
  );

  const handleCreateTeam = useCallback(() => {
    onCreateTeam?.();
    close();
  }, [onCreateTeam, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        const idx = selectedTeamId
          ? teams.findIndex((t) => isSameTeamId(selectedTeamId, t.id))
          : 0;
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        isKeyboardRef.current = true;
        setFocusedIndex((prev) => (prev < optionCount - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        isKeyboardRef.current = true;
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < teams.length) {
          handleSelect(teams[focusedIndex].id);
        } else if (onCreateTeam && focusedIndex === teams.length) {
          handleCreateTeam();
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  // 키보드 포커스 시 해당 옵션으로 스크롤
  useEffect(() => {
    if (
      isOpen &&
      focusedIndex >= 0 &&
      listRef.current &&
      isKeyboardRef.current
    ) {
      const list = listRef.current;
      const options = list.querySelectorAll("[role=option]");
      const target = options[focusedIndex];
      if (target) {
        (target as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, focusedIndex]);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="team-selector-listbox"
      aria-label="팀 선택"
    >
      {/* 트리거: Figma 160-1286 (닫힌 상태) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            const idx = selectedTeamId
              ? teams.findIndex((t) => isSameTeamId(selectedTeamId, t.id))
              : 0;
            setFocusedIndex(idx >= 0 ? idx : 0);
          }
        }}
        className={cn(
          "flex items-center rounded-[1.25rem] border border-border-card bg-surface-card px-3 py-1.5 transition-colors relative",
          "hover:bg-surface-elevated",
          "w-38",
        )}
        aria-controls="team-selector-listbox"
      >
        {!hasTeams || !selectedTeam ? (
          <>
            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
              <Icon src={plus} alt="" width={24} height={24} />
            </div>
            <span className="truncate text-sm font-semibold text-Label-Primary">
              팀 만들기
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={selectedTeam.imageUrl ?? DEFAULT_TEAM_IMAGE}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <span className="truncate text-sm font-semibold text-white leading-normal">
                {selectedTeam.name}
              </span>
            </div>

            <Icon
              src={isOpen ? arrow_up : arrow_down}
              alt=""
              width={24}
              height={24}
              className="text-Fill_Tertiary absolute right-1 top-1/2 -translate-y-1/2"
            />
          </>
        )}
      </button>

      {/* 드롭다운 패널: Figma 209-1356 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="team-selector-listbox"
            role="listbox"
            ref={listRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-50 mt-1 min-w-38 rounded-[1.25rem] border border-border-card bg-surface-card px-4 pb-3 pt-4 shadow-lg"
          >
            {/* 팀 목록 */}
            <div className="flex flex-col gap-3">
              {teams.map((team, index) => (
                <TeamOptionRow
                  key={team.id}
                  name={team.name}
                  imageUrl={team.imageUrl ?? DEFAULT_TEAM_IMAGE}
                  isSelected={isSameTeamId(selectedTeamId, team.id)}
                  isFocused={focusedIndex === index}
                  onSelect={() => handleSelect(team.id)}
                  onFocus={() => {
                    isKeyboardRef.current = false;
                    setFocusedIndex(index);
                  }}
                />
              ))}
            </div>

            {/* 구분선 + 팀 만들기: Figma 209-1354, 209-1344 */}
            {onCreateTeam && (
              <>
                <div
                  className="mb-1.5 mt-3 h-px w-full shrink-0 bg-gray-1000"
                  role="separator"
                />
                <button
                  type="button"
                  onClick={handleCreateTeam}
                  onMouseEnter={() => setFocusedIndex(teams.length)}
                  className={cn(
                    "flex items-center gap-1 rounded-[1.25rem] transition-colors w-full",
                    " font-semibold text-Label-AccentPrimary",
                    "hover:bg-surface-elevated",
                    focusedIndex === teams.length && "bg-surface-elevated",
                  )}
                >
                  <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    <Icon
                      src={plus}
                      alt="plus icon"
                      width={24}
                      height={24}
                      aria-hidden
                    />
                  </div>
                  <span className="truncate text-[0.8125rem] font-semibold text-Label-AccentPrimary flex-1 text-left">
                    팀 만들기
                  </span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 옵션 한 줄: Figma 209-1310 */
function TeamOptionRow({
  name,
  imageUrl,
  isSelected,
  isFocused,
  onSelect,
  onFocus,
}: {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  isFocused: boolean;
  onSelect: () => void;
  onFocus: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      onClick={onSelect}
      onMouseEnter={onFocus}
      className={cn(
        "flex w-full items-center gap-1 rounded-[1.25rem] text-left transition-colors",
        "text-sm font-semibold",
        isSelected ? "text-Label-Primary" : "text-Label-Primary",
        (isFocused || isSelected) && "bg-surface-elevated",
      )}
    >
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
        <Image src={imageUrl} alt="" fill className="object-cover" />
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-Label-Primary">
        {name}
      </span>
      {isSelected && (
        <span
          className="h-1 w-1 shrink-0 rounded-full bg-Label-AccentPrimary"
          aria-hidden
        />
      )}
    </button>
  );
}

export default TeamSelector;
