import { Suspense } from "react";
import SearchResultList from "./SearchResultList";
import DefaultAddressList from "./DefaultAddressList";

const AddressListSection = ({
  keyword,
  onSelect,
  selectedCode,
}: {
  keyword: string;
  onSelect: (address: string, code: string) => void;
  selectedCode?: string | null;
}) => (
  <div className="flex flex-col pl-3">
    <span className="font-semibold text-sm leading-4 text-Label-Primary mb-2">
      {keyword ? "검색 결과" : "추천"}
    </span>
    {keyword ? (
      <Suspense
        fallback={
          <div className="py-10 text-center text-Label-Tertiary">
            검색 중...
          </div>
        }
      >
        <SearchResultList
          keyword={keyword}
          onSelect={onSelect}
          selectedCode={selectedCode}
        />
      </Suspense>
    ) : (
      <DefaultAddressList onSelect={onSelect} selectedCode={selectedCode} />
    )}
  </div>
);

export default AddressListSection;
