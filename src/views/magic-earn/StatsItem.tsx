import Image from "next/image";

interface StateItemProps {
  statistics: string;
  title: string;
}

const StatsItem: React.FC<StateItemProps> = ({ statistics, title }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Image src="/images/monad_logo.svg" alt="" width={24} height={24} />
        <p className="text-xl font-semibold">{statistics}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-foreground opacity-50">
        {title}
      </p>
    </div>
  );
};

export default StatsItem;
