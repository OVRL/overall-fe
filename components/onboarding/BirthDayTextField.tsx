import { ComponentProps } from "react";
import AuthTextField from "@/components/login/AuthTextField";

type Props = Omit<ComponentProps<typeof AuthTextField>, "label"> & {
  label?: string;
};

const BirthDayTextField = ({
  value,
  onChange,
  label = "생년월일",
  ...props
}: Props) => {
  const handleBirthDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    let formatted = rawValue;
    if (rawValue.length > 4 && rawValue.length <= 6) {
      formatted = `${rawValue.slice(0, 4)}-${rawValue.slice(4)}`;
    } else if (rawValue.length > 6) {
      formatted = `${rawValue.slice(0, 4)}-${rawValue.slice(4, 6)}-${rawValue.slice(6, 8)}`;
    }

    const newEvent = {
      target: {
        value: formatted,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(newEvent);
  };

  return (
    <AuthTextField
      {...props}
      type="text"
      inputMode="numeric"
      label={label}
      placeholder="YYYY-MM-DD"
      maxLength={10}
      value={value}
      onChange={handleBirthDayChange}
    />
  );
};

export default BirthDayTextField;
