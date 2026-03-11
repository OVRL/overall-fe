import { useId } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import SearchInputSection from "../AddressSearchModal/SearchInputSection";
import AddressItem from "../AddressSearchModal/AddressItem";
import { useNaverAddressSearch } from "@/hooks/useNaverAddressSearch";
import { NaverAddressResult } from "@/hooks/useNaverAddressSearch";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";

interface DetailAddressSearchModalProps {
  onComplete: (result: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
}

/**
 * 실제 검색 결과 목록 UI
 */
const SearchResultList = ({
  results,
  selectedAddress,
  onSelect,
}: {
  results: NaverAddressResult[];
  selectedAddress: NaverAddressResult | null;
  onSelect: (item: NaverAddressResult) => void;
}) => (
  <>
    {results.map((item) => (
      <AddressItem
        key={`${item.latitude}-${item.longitude}-${item.address}`}
        address={item.address}
        onClick={() => onSelect(item)}
        selected={selectedAddress?.address === item.address}
      />
    ))}
  </>
);

const DetailAddressSearchModal = ({
  onComplete,
}: DetailAddressSearchModalProps) => {
  const id = useId();
  const {
    inputValue,
    setInputValue,
    searchResults,
    selectedAddress,
    handleSelect,
    handleComplete,
    isLoading,
  } = useNaverAddressSearch({ onComplete });

  const renderContent = () => {
    if (isLoading) return <SearchLoadingList count={2} />;
    if (searchResults.length > 0) {
      return (
        <SearchResultList
          results={searchResults}
          selectedAddress={selectedAddress}
          onSelect={handleSelect}
        />
      );
    }
    return (
      <SearchEmptyState
        as="li"
        className="font-medium text-Label-Disable list-none"
        message={
          inputValue === ""
            ? "검색된 지역이 없습니다."
            : "일치하는 주소가 없습니다."
        }
      />
    );
  };

  return (
    <ModalLayout title="상세 위치 검색">
      <div className="flex-1 flex flex-col gap-y-12">
        <SearchInputSection
          id={id}
          value={inputValue}
          onChange={setInputValue}
        />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <span className="font-semibold text-sm leading-4 text-Label-Primary mb-2">
            검색 결과
          </span>
          <ul className="w-full grow mx-auto overflow-y-auto scrollbar-thin flex flex-col pr-1 h-3xs lg:h-40">
            {renderContent()}
          </ul>
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={handleComplete}
          disabled={!selectedAddress}
        >
          확인
        </Button>
      </div>
    </ModalLayout>
  );
};

export default DetailAddressSearchModal;
