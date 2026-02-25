import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField from "@/components/ui/TextField";

interface ControlledTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "password" | "email";
  showBorderBottom?: boolean;
}

export default function ControlledTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  showBorderBottom = true,
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TextField
          label={label}
          placeholder={placeholder}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onClear={() => onChange("")}
          showBorderBottom={showBorderBottom}
        />
      )}
    />
  );
}
