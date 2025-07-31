import { useSocket } from "@/context/SocketContext";
import { convertWeiToEther } from "@/utils/string";
import Image from "next/image";
import Link from "next/link";

const JackpotPool = () => {
  const { jackpotRoundData } = useSocket();

  return (
    <Link
      href={"/kuro/round-history?type=" + "jackpot"}
      className="relative h-[44px] w-[221px]"
    >
      <p className="text-stroke absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-gajraj text-2xl font-normal">
        {jackpotRoundData
          ? Number(convertWeiToEther(jackpotRoundData?.totalPool))
          : 0}
      </p>
      <Image
        src="/images/background_jackpot.png"
        alt="Jackpot Background"
        width={221}
        height={44}
        className=""
      />
      <Image
        src="/images/jackpot_meow.png"
        alt="Jackpot Meow"
        width={103}
        height={87}
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </Link>
  );
};

export default JackpotPool;
