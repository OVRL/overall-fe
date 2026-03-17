"use client";

import { useId } from "react";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { format } from "date-fns";
import { FormSection } from "../components";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { TimePicker } from "@/components/ui/date/TimePicker";
import type { RegisterGameValues } from "../schema";

interface ScheduleSectionProps {
  control: Control<RegisterGameValues>;
  setValue: UseFormSetValue<RegisterGameValues>;
  form: { getValues: (name: "startDate") => string };
}

export function ScheduleSection({
  control,
  setValue,
  form,
}: ScheduleSectionProps) {
  const id = useId();

  return (
    <FormSection label="일정">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  const next = date ? format(date, "yyyy-MM-dd") : "";
                  field.onChange(next);
                  if (next)
                    setValue("endDate", next, { shouldValidate: true });
                }}
                placeholder="시작 날짜 선택"
                className="min-w-0 h-12 w-full"
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                id={`${id}-start-time`}
                value={field.value}
                onChange={field.onChange}
                aria-label="시작 시간 선택"
                className="min-w-0 w-full"
              />
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => {
              const startDate = form.getValues("startDate");
              return (
                <DatePicker
                  value={
                    field.value ? new Date(field.value) : undefined
                  }
                  onChange={(date) => {
                    const next = date ? format(date, "yyyy-MM-dd") : "";
                    field.onChange(next);
                    if (next && startDate && next < startDate) {
                      setValue("startDate", next, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  placeholder="종료 날짜 선택"
                  className="min-w-0 h-12 w-full"
                />
              );
            }}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                id={`${id}-end-time`}
                value={field.value}
                onChange={field.onChange}
                aria-label="종료 시간 선택"
                className="min-w-0 w-full"
              />
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}
