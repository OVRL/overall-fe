"use client";

import { Controller, Control } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FormSection, UniformOption } from "../components";
import TextField from "@/components/ui/TextField";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import type { RegisterGameValues } from "../schema";

interface MatchOnlySectionProps {
  control: Control<RegisterGameValues>;
  isMatch: boolean;
  onOpponentTeamClick: () => void;
}

/**
 * 매칭 선택 시에만 노출: 상대팀 선택 + 유니폼 선택.
 * AnimatePresence를 한 번만 사용해 DRY 유지.
 */
export function MatchOnlySection({
  control,
  isMatch,
  onOpponentTeamClick,
}: MatchOnlySectionProps) {
  return (
    <AnimatePresence>
      {isMatch ? (
        <motion.div
          key="match-only"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Controller
            name="opponentName"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={onOpponentTeamClick}
                className="w-full text-left cursor-pointer"
              >
                <TextField
                  label="상대팀"
                  placeholder="상대팀을 검색하세요"
                  className="text-Fill_Primary pointer-events-none"
                  showBorderBottom={false}
                  value={field.value}
                  name={field.name}
                  readOnly
                />
              </button>
            )}
          />
          <FormSection label="유니폼">
            <Controller
              name="uniformType"
              control={control}
              render={({ field }) => (
                <div className="flex gap-6">
                  <UniformOption
                    type="HOME"
                    label="홈"
                    isSelected={field.value === "HOME"}
                    onSelect={() => field.onChange("HOME")}
                    imagePath={getUniformImagePath("SOLID_RED")}
                  />
                  <UniformOption
                    type="AWAY"
                    label="어웨이"
                    isSelected={field.value === "AWAY"}
                    onSelect={() => field.onChange("AWAY")}
                    imagePath={getUniformImagePath("SOLID_BLUE")}
                  />
                </div>
              )}
            />
          </FormSection>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
