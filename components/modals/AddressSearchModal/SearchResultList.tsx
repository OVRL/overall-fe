import { graphql, useLazyLoadQuery } from "react-relay";
import { AddressSearchModalQuery as QueryType } from "@/__generated__/AddressSearchModalQuery.graphql";
import AddressItem from "./AddressItem";

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

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-Label-Tertiary">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <ul className="max-h-[300px] overflow-y-auto scrollbar-hide">
      {items.map((item) => (
        <AddressItem
          key={item.code}
          address={formatAddress(item)}
          onClick={() => onSelect(formatAddress(item))}
        />
      ))}
    </ul>
  );
};
export default SearchResultList;
