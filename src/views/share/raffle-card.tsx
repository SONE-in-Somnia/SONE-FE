import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CountdownBoxes from "@/components/ui/time-out";
import TimeOut from "@/components/ui/time-out";
import Image from "next/image";
import Link from "next/link";

const RaffleCard = () => {
  return (
    <Card className="p-6 h-full flex gap-10 flex-col overflow-hidden shadow-[inset_0px_0px_24px_0px_#8371E980]">
      <div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="h-5 w-5 rounded-full absolute -bottom-1 -right-1 bg-slate-600">
              <Image src="/images/usdc.svg" height={20} width={20} alt="" />
            </div>
          </div>

          <p className="text-sm font-semibold">ZkLend USDC Raffle</p>

          <Badge className="gap-1 ml-auto">
            <p className="font-semibold text-sm text-white">USDC</p>
            <Image src="/images/usdc.svg" height={20} width={20} alt="" />
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p>Time left</p>
        <CountdownBoxes deadline="2025-02-15 23:59:59" />
        </div>

      <div className="flex text-sm items-center justify-between w-full  text-white">
        <div className="flex flex-col items-start gap-2">
          <p className="text-foreground opacity-50 ">Raffle TVL</p>
          <p className=" font-semibold">21.6k USDC</p>
        </div>

        <Separator orientation="vertical"></Separator>

        <div className="flex flex-col gap-2">
          <p className="text-foreground opacity-50 ">APY</p>
          <p className=" font-semibold">14.6%</p>
        </div>

        <Separator orientation="vertical"></Separator>

        <div className="flex flex-col gap-2">
          <p className="text-foreground opacity-50 ">Yield Source</p>
          <p className=" font-semibold ">ZkLend</p>
        </div>
      </div>

      <div className="-pt-8">
        <Link href="/raffle/1" className="text-sm">
          <Button className="w-full">Participate</Button>
        </Link>
      </div>
    </Card>
  );
};

export default RaffleCard;
