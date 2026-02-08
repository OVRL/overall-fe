import { useId, useState, Suspense } from "react";
import {
  graphql,
  useLazyLoadQuery,
  RelayEnvironmentProvider,
} from "react-relay";
import { getClientEnvironment } from "@/lib/relay/environment";
import ModalLayout from "./ModalLayout";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import Button from "../ui/Button";
import { useDebounce } from "@toss/react";
import search from "@/public/icons/search.svg";
import Icon from "../Icon";
import { AddressSearchModalQuery as QueryType } from "@/__generated__/AddressSearchModalQuery.graphql";

const ADDRESS_SEARCH_QUERY = graphql`
  query AddressSearchModalQuery($keyword: String!) {
    region_search(keyword: $keyword) {
      items {
        code
        sidoName
        siggName
        dongName
        riName
        name
      }
    }
  }
`;

interface AddressSearchModalProps {
  onComplete: (address: string) => void;
}

const SearchResultList = ({
  keyword,
  onSelect,
}: {
  keyword: string;
  onSelect: (address: string) => void;
}) => {
  const data = useLazyLoadQuery<QueryType>(
    ADDRESS_SEARCH_QUERY,
    { keyword },
    {
      fetchPolicy: "network-only",
      networkCacheConfig: { force: true },
    },
  );

  const items = data.region_search?.items ?? [];

  return (
    <ul className="max-h-[300px] overflow-y-auto scrollbar-hide">
      {items.map((item) => {
        const fullAddress = [
          item.sidoName,
          item.siggName,
          item.dongName,
          item.riName,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li
            className="w-full py-3.5 text-Label-Tertiary cursor-pointer hover:text-Label-Primary transition-colors"
            key={item.code}
            onClick={() => onSelect(fullAddress)}
          >
            {fullAddress}
          </li>
        );
      })}
      {items.length === 0 && (
        <li className="w-full py-10 text-center text-Label-Tertiary">
          검색 결과가 없습니다.
        </li>
      )}
    </ul>
  );
};

const AddressSearchModal = ({ onComplete }: AddressSearchModalProps) => {
  const { hideModal } = useModal();
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const debouncedKeyword = useDebounce(inputValue, 300);

  const defaultAddresses = [
    "서울특별시 강남구 역삼동",
    "서울특별시 중구 광희동",
    "서울특별시 강서구 가양동",
  ];

  const handleSelect = (address: string) => {
    onComplete(address);
    hideModal();
  };

  const environment = getClientEnvironment();

  // debouncedValue를 안전하게 문자열로 변환
  const keyword = String(debouncedKeyword ?? "").trim();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ModalLayout title="활동 지역">
        <div className="flex-1 flex flex-col gap-y-12">
          <div className="flex flex-col gap-3.75">
            <span className="font-semibold text-sm leading-4 text-Label-Primary">
              주소 검색
            </span>
            <div className="relative text-Fill_Primary">
              <div className="absolute bottom-3.25 left-0 p-0.75">
                <Icon src={search} width={24} height={24} />
              </div>
              <input
                type="text"
                id={id}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="지역이나 동네로 검색하기"
                className={cn(
                  "w-full bg-transparent pb-3.75 text-base text-Label-Tertiary placeholder:text-Label-Tertiary outline-none border-b border-Fill_Tertiary transition-colors pl-7.25",
                )}
              />
            </div>
          </div>

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
                <SearchResultList keyword={keyword} onSelect={handleSelect} />
              </Suspense>
            ) : (
              <ul>
                {defaultAddresses.map((address) => (
                  <li
                    className="w-full py-3.5 text-Label-Tertiary cursor-pointer hover:text-Label-Primary transition-colors"
                    key={address}
                    onClick={() => handleSelect(address)}
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button variant="primary" size="xl" onClick={hideModal}>
            완료
          </Button>
        </div>
      </ModalLayout>
    </RelayEnvironmentProvider>
  );
};

export default AddressSearchModal;
