import { Controller, Control, FieldValues, Path } from "react-hook-form";
import AuthTextField from "@/components/login/AuthTextField";

interface ControlledAuthTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "password" | "email";
}

export default function ControlledAuthTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
}: ControlledAuthTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <AuthTextField
          label={label}
          placeholder={placeholder}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onClear={() => onChange("")}
        />
      )}
    />
  );
}
