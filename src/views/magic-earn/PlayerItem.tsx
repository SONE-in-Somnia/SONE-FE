import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatEther } from "ethers";
import Image from "next/image";

interface PlayerItemProps {
  rank: number;
  avatar: string;
  address: string;
  winrate: string;
  totalDeposits: string;
  color?: string;
}

const PlayerItem: React.FC<PlayerItemProps> = ({
  rank,
  avatar,
  address,
  winrate,
  totalDeposits,
  color,
}) => {
  const getBorderColor = () => {
    if (color) {
      return color;
    } else return "#8371E9";
  };

  return (
    <div
      style={{ borderColor: getBorderColor() }}
      className={`flex min-w-[228px] items-center justify-between rounded border-r-4 bg-[#a8bccb] px-4 py-2`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>avt</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-[#61439A]">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-end text-xs font-semibold text-[#61439A]">
          {winrate}%
        </p>
        <div className="flex items-center justify-end gap-1">
          <p className="text-end text-sm">
            <span className="font-bold text-[#61439A]">
              {totalDeposits} STT
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerItem;
