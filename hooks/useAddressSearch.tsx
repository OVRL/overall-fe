import { useState, useEffect } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";

interface UseAddressSearchProps {
  onComplete: (address: string) => void;
}

export const useAddressSearch = ({ onComplete }: UseAddressSearchProps) => {
  const { hideModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedValue(value);
  }, 300);

  useEffect(() => {
    debouncedUpdate(inputValue);
  }, [inputValue, debouncedUpdate]);

  const handleSelect = (address: string) => {
    onComplete(address);
    hideModal();
  };

  const keyword = String(debouncedValue ?? "").trim();

  return {
    inputValue,
    setInputValue,
    keyword,
    handleSelect,
    hideModal,
  };
};
