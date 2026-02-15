import { PropsWithChildren } from "react";

type Props = {
  title: string;
};

const MatchInfoRow = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <dl className="flex h-7.5 items-center gap-3">
      <dt className="text-Label-Tertiary text-sm leading-6 w-15 whitespace-nowrap">
        {title}
      </dt>
      <dd className="flex-1 flex items-center">{children}</dd>
    </dl>
  );
};

export default MatchInfoRow;
