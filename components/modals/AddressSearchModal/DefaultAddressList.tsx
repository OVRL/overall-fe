import AddressItem from "./AddressItem";

const DefaultAddressList = ({
  onSelect,
}: {
  onSelect: (address: string) => void;
}) => {
  const defaultAddresses = [
    "서울특별시 강남구 역삼동",
    "서울특별시 중구 광희동",
    "서울특별시 강서구 가양동",
  ];

  return (
    <ul>
      {defaultAddresses.map((address) => (
        <AddressItem
          key={address}
          address={address}
          onClick={() => onSelect(address)}
        />
      ))}
    </ul>
  );
};

export default DefaultAddressList;
