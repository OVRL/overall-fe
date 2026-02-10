import { useId } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "@/lib/relay/environment";
import { useAddressSearch } from "@/hooks/useAddressSearch";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import SearchInputSection from "./SearchInputSection";
import AddressListSection from "./AddressListSection";

interface AddressSearchModalProps {
  onComplete: (result: { address: string; code: string }) => void;
}

const AddressSearchModal = ({ onComplete }: AddressSearchModalProps) => {
  const id = useId();
  const {
    inputValue,
    setInputValue,
    keyword,
    handleSelect,
    handleComplete,
    selectedAddress,
  } = useAddressSearch({ onComplete });

  const environment = getClientEnvironment();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ModalLayout title="활동 지역">
        <div className="flex-1 flex flex-col gap-y-12">
          <SearchInputSection
            id={id}
            value={inputValue}
            onChange={setInputValue}
          />
          <AddressListSection
            keyword={keyword}
            onSelect={handleSelect}
            selectedCode={selectedAddress?.code}
          />
          <Button
            variant="primary"
            size="xl"
            onClick={handleComplete}
            disabled={!selectedAddress}
          >
            완료
          </Button>
        </div>
      </ModalLayout>
    </RelayEnvironmentProvider>
  );
};

export default AddressSearchModal;
