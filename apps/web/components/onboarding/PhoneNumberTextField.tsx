import { ComponentProps } from "react";
import TextField from "@/components/ui/TextField";

type Props = Omit<ComponentProps<typeof TextField>, "label"> & {
  label?: string;
};

/** 숫자만/이미 하이픈 포함 값 모두 동일한 표시 형태(010-0000-0000)로 맞춤. readOnly·프리필 시에도 사용 */
function formatKoreanMobileDisplay(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

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

  const displayValue = formatKoreanMobileDisplay(String(value ?? ""));

  return (
    <TextField
      {...props}
      type="tel"
      label={label}
      placeholder="전화번호를 입력해주세요."
      maxLength={13}
      value={displayValue}
      onChange={handlePhoneChange}
    />
  );
};

export default PhoneNumberTextField;
