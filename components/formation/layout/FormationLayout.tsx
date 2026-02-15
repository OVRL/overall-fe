import React from "react";
import { cn } from "@/lib/utils";

interface FormationLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

const FormationLayout: React.FC<FormationLayoutProps> = ({
  children,
  sidebar,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl justify-center items-center lg:items-start 2xl:max-w-none mx-auto",
        className,
      )}
    >
      {/* Left Section (Match Info + Field) */}
      <section className="w-full lg:w-156 xl:w-225 2xl:w-225 h-full flex flex-col gap-4 shrink-0 transition-all duration-300">
        {children}
      </section>

      {/* Right Section (Sidebar / Player List) */}
      {sidebar && (
        <aside className="max-lg:w-full h-full flex justify-center shrink-0">
          <div className="w-full md:w-92 lg:w-84 xl:w-90 2xl:w-98.25 transition-all duration-300">
            {sidebar}
          </div>
        </aside>
      )}
    </div>
  );
};

export default FormationLayout;
