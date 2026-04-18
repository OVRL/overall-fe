"use client";

import React, { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import fire from "@/public/icons/fire.svg";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type FormationMatchInfoAccordionProps = {
  scheduleCard: React.ReactNode;
};

export function FormationMatchInfoAccordion({
  scheduleCard,
}: FormationMatchInfoAccordionProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg py-1 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon src={fire} nofill width={24} height={24} />
          <span className="font-semibold text-base leading-6 text-Label-Primary">
            경기 정보
          </span>
        </span>
        <span className="shrink-0 text-Label-Tertiary" aria-hidden>
          {open ? (
            <ChevronUp className="size-6" strokeWidth={2} />
          ) : (
            <ChevronDown className="size-6" strokeWidth={2} />
          )}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {scheduleCard}
          </div>
        </div>
      </div>
    </div>
  );
}
