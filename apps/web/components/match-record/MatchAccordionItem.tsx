"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { MatchRecord } from "./types";
import { MatchSummaryHeader } from "./MatchSummaryHeader";
import { MatchDetailContent } from "./MatchDetailContent";

/** 높이 애니메이션 duration(ms)과 맞춰 펼친 뒤 스크롤 */
const OPEN_SCROLL_DELAY_MS = 300;

type MatchAccordionItemProps = {
  record: MatchRecord;
  className?: string;
};

/** 단일 경기 아코디언: 열림 애니메이션 + 펼침 후 스크롤 정렬 */
export function MatchAccordionItem({
  record,
  className,
}: MatchAccordionItemProps) {
  const contentId = useId();
  const headingId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => {
      rootRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, OPEN_SCROLL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  return (
    <section
      ref={rootRef}
      className={cn(
        "scroll-mt-4 overflow-hidden rounded-xl border border-border-card bg-surface-card shadow-card",
        className,
      )}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        {record.dateLabel} vs {record.opponentName} {record.ourScore} 대{" "}
        {record.theirScore}
      </h2>
      <button
        type="button"
        className="w-full cursor-pointer text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={`match-trigger-${record.id}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <MatchSummaryHeader record={record} isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={contentId}
            key="detail"
            role="region"
            aria-labelledby={`match-trigger-${record.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <MatchDetailContent record={record} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
