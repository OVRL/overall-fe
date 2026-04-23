type Props = {
  label: string;
  value: string;
};

const PlayerStatRow = ({ label, value }: Props) => {
  return (
    <dl className="flex justify-between">
      <dt className="text-gray-500 text-[0.8125rem]">{label}</dt>
      <dd className="text-white font-semibold text-[0.8125rem]">{value}</dd>
    </dl>
  );
};

export default PlayerStatRow;
