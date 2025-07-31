"use client";
import Deposit from "../../views/magic-earn/Deposit";
import RoundHistory from "@/views/magic-earn/RoundHistory";
import RoundState from "@/views/magic-earn/RoundState";
import PoolWheelOrigin from "@/views/magic-earn/PoolWheelOrigin";
import PoolPlayers from "@/views/magic-earn/PoolPlayers";
import { useEffect } from "react";
import { useKuro } from "@/context/KuroContext";
import Title from "@/views/magic-earn/title";

const Kuro = () => {
  const { registerKuroListener, unRegisterKuroListener } = useKuro();

  useEffect(() => {
    registerKuroListener();
    return () => {
      unRegisterKuroListener();
    };
  }, [registerKuroListener, unRegisterKuroListener]);

  return (
    <>
      {/* <DialogWarningKuro /> */}
      <div className="flex animate-fade flex-col gap-4">
        <Title />
        <div className="overflow-hidden rounded-2xl bg-[#10054E]">
          <RoundState />
          <div className="flex items-center justify-evenly">
            <PoolWheelOrigin />
            <Deposit />
          </div>
          <PoolPlayers />
        </div>
        <RoundHistory />
        {/* <div className="bg-[#190B4D26]">
          <RoundState />

          <TotalPlayer />
          <Deposit />

          <div className="col-span-4 flex h-[838px] max-h-[838px] flex-col gap-4">
            <PoolPlayers />
            <RoundHistory />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Kuro;
