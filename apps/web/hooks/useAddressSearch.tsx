import { useState, useEffect } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";

interface UseAddressSearchProps {
  onComplete: (result: { address: string; code: string }) => void;
}

export const useAddressSearch = ({ onComplete }: UseAddressSearchProps) => {
  const { hideModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    code: string;
  } | null>(null);

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedValue(value);
  }, 300);

  useEffect(() => {
    debouncedUpdate(inputValue);
  }, [inputValue, debouncedUpdate]);

  const handleSelect = (address: string, code: string) => {
    setSelectedAddress({ address, code });
  };

  const handleComplete = () => {
    if (selectedAddress) {
      onComplete(selectedAddress);
      hideModal();
    }
  };

  const keyword = String(debouncedValue ?? "").trim();

  return {
    inputValue,
    setInputValue,
    keyword,
    handleSelect,
    handleComplete,
    hideModal,
    selectedAddress,
  };
};
