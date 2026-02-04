import { ComponentProps } from "react";
import AuthTextField from "@/components/login/AuthTextField";

type Props = Omit<ComponentProps<typeof AuthTextField>, "label"> & {
  label?: string;
};

const PhoneNumberTextField = ({
  value,
  onChange,
  label = "전화번호",
  ...props
}: Props) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    let formatted = rawValue;
    if (rawValue.length > 3 && rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
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
      type="tel"
      label={label}
      placeholder="전화번호를 입력해주세요."
      maxLength={13}
      value={value}
      onChange={handlePhoneChange}
    />
  );
};

export default PhoneNumberTextField;
