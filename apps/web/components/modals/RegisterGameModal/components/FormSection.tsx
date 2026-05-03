import { cn } from "@/lib/utils";

interface FormSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FormSection({ label, children, className }: FormSectionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className="text-sm font-semibold text-Label-Primary">{label}</span>
      {children}
    </div>
  );
}

export default FormSection;
