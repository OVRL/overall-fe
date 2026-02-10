import { useRef, useEffect } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { SearchResultListQuery as QueryType } from "@/__generated__/SearchResultListQuery.graphql";
import AddressItem from "./AddressItem";

const ADDRESS_SEARCH_QUERY = graphql`
  query SearchResultListQuery($keyword: String!) {
    region_search(keyword: $keyword) {
      hasNextPage
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

const formatAddress = (item: {
  sidoName?: string | null;
  siggName?: string | null;
  dongName?: string | null;
  riName?: string | null;
}) => {
  return [item.sidoName, item.siggName, item.dongName, item.riName]
    .filter(Boolean)
    .join(" ");
};

const SearchResultList = ({
  keyword,
  onSelect,
  selectedCode,
}: {
  keyword: string;
  onSelect: (address: string, code: string) => void;
  selectedCode?: string | null;
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
  const hasNextPage = data.region_search?.hasNextPage;
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log(
            "Load more triggered - Pagination arguments missing in schema",
          );
          // TODO: Implement loadMore when schema supports pagination (e.g. offset, page)
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage]);

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-Label-Tertiary">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <ul className="max-h-75 overflow-y-auto scrollbar-hide">
      {items.map((item) => (
        <AddressItem
          key={item.code}
          address={formatAddress(item)}
          onClick={() => onSelect(formatAddress(item), item.code)}
          selected={selectedCode === item.code}
        />
      ))}
      <div ref={observerRef} className="h-4" />
    </ul>
  );
};
export default SearchResultList;
