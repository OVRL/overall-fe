"use client";

import React from "react";
import QuarterButton from "@/components/ui/QuarterButton";

export default function QuarterChipTestPage() {
  return (
    <div className="min-h-screen bg-surface-primary p-8 flex flex-col gap-8 text-white">
      <h1 className="text-2xl font-bold">Quarter Button Test</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold border-b border-gray-700 pb-2">
          Variants
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span>Default</span>
            <QuarterButton variant="default">1Q</QuarterButton>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Selected</span>
            <QuarterButton variant="selected">1Q</QuarterButton>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Add</span>
            <QuarterButton variant="add" size="sm">
              +
            </QuarterButton>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Assistive (Type 4)</span>
            <QuarterButton variant="assistive" size="sm">
              CAM
            </QuarterButton>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold border-b border-gray-700 pb-2">
          Interactive Demo
        </h2>
        <div className="flex gap-2 p-4 bg-surface-secondary rounded-xl">
          <QuarterButton variant="selected">1Q</QuarterButton>
          <QuarterButton variant="default">2Q</QuarterButton>
          <QuarterButton variant="default">3Q</QuarterButton>
          <QuarterButton variant="add" size="sm">
            +
          </QuarterButton>
        </div>
      </section>
    </div>
  );
}
