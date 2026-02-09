const AddressItem = ({
  address,
  onClick,
}: {
  address: string;
  onClick: () => void;
}) => (
  <li
    className="w-full py-3.5 text-Label-Tertiary cursor-pointer hover:text-Label-Primary transition-colors"
    onClick={onClick}
  >
    {address}
  </li>
);

export default AddressItem;
