import AddressItem from "./AddressItem";

const DefaultAddressList = ({
  onSelect,
  selectedCode,
}: {
  onSelect: (address: string, code: string) => void;
  selectedCode?: string | null;
}) => {
  const defaultAddresses = [
    { name: "서울특별시 강남구 역삼동", code: "1168010100" },
    { name: "서울특별시 중구 광희동", code: "1114059000" },
    { name: "서울특별시 강서구 가양동", code: "1150010400" },
  ];

  return (
    <ul>
      {defaultAddresses.map(({ name, code }) => (
        <AddressItem
          key={code}
          address={name}
          onClick={() => onSelect(name, code)}
          selected={selectedCode === code}
        />
      ))}
    </ul>
  );
};

export default DefaultAddressList;
