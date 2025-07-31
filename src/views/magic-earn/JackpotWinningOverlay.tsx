import FuzzyText from "@/blocks/TextAnimations/FuzzyText/FuzzyText";
import GradientText from "@/components/ui/gradient-text";
import { useSocket } from "@/context/SocketContext";
import { convertWeiToEther } from "@/utils/string";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const JackpotWinningOverlay = () => {
  const { jackpotWinnerData, setJackpotWinnerData } = useSocket();

  const skipAnimationTime = 7000;
  const loadingRef = useRef<HTMLDivElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (!jackpotWinnerData) {
      return;
    }

    if (currentPhase === 0) {
      setTimeout(() => {
        setCurrentPhase(1);
      }, 3000);
    }

    if (currentPhase === 1) {
      setTimeout(() => {
        setCurrentPhase(2);
      }, 4500);
    }

    if (currentPhase === 2) {
      if (loadingRef) {
        const loading = loadingRef.current;
        if (loading) {
          loading.style.transitionDuration = skipAnimationTime + "ms";
          loading.style.width = window.innerWidth + "px";
        }
      }

      const timeout = setTimeout(() => {
        setShowSkip(true);
      }, skipAnimationTime);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [jackpotWinnerData, currentPhase]);

  if (!jackpotWinnerData) return <></>;

  return (
    <div className="fixed left-0 top-0 z-[100] animate-fade duration-1000">
      {currentPhase === 0 && (
        <div className="fixed z-[100] grid h-screen w-screen place-items-center">
          <GradientText
            colors={["#D2FF93", "#DCBCFE", "#FFDF94"]}
            animationSpeed={3}
            showBorder={false}
            className="animate-jump-in bg-transparent font-gajraj text-7xl font-bold"
          >
            Jackpot has a winner!
          </GradientText>
        </div>
      )}

      {currentPhase == 1 && (
        <>
          <div className="animate-flash fixed left-0 top-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-black/40 bg-white opacity-0 backdrop-blur-sm"></div>
          <div className="animate-scale-up grid h-screen w-screen place-items-center">
            <Image
              src={"/images/money-jar.png"}
              alt="money-jar"
              width={600}
              height={600}
              className="animate-shake-strong animate-infinite"
            />
          </div>
        </>
      )}

      {currentPhase == 2 && (
        <div className="fixed left-0 top-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0 -z-[1] animate-pulse bg-[radial-gradient(circle_at_center,_#FBE276,_#FFDC6A,_#FFCF70,_#F2C83E,_#F8C860,_#FCCB4F)] transition-all"></div>
          <div className="absolute inset-0 -z-[1] animate-pulse bg-[conic-gradient(at_center,_#FFE57D,_#393124,_#393124,_#FFE57D,_#393124,_#FFE57D,_#393124,_#393124,_#FFE57D)] mix-blend-difference transition-all delay-200"></div>
          <div className="absolute inset-0 -z-[1] animate-pulse bg-[conic-gradient(at_center,_#F9E990,_#172303,_#172303,_#F9E990,_#172303,_#F9E990,_#172303,_#F9E990,_#172303,_#F9E990)] mix-blend-screen transition-all delay-500"></div>

          <Image
            src={"/images/meow-jackpot.png"}
            alt="jackpot meow"
            width={695}
            height={587}
            className="aspect-[695/587] animate-jump duration-500"
          />

          <div className="relative">
            <Image
              src={"/images/background_jackpot_1.png"}
              alt="jackpot bg"
              width={538}
              height={147}
              className="animate-fade-up duration-1000"
            />
            <p className="text-stroke absolute left-1/2 top-1/2 -mt-3 -translate-x-1/2 -translate-y-1/2 font-gajraj text-7xl">
              {convertWeiToEther(jackpotWinnerData.totalPool)}
            </p>
          </div>
          <div className="absolute top-10 animate-flip-up">
            <FuzzyText fontSize={60}>{jackpotWinnerData.winner}</FuzzyText>
          </div>

          <div
            ref={loadingRef}
            className="absolute left-0 top-0 h-1 w-0 bg-primary transition-all"
          ></div>
          {showSkip && (
            <p
              onClick={() => setJackpotWinnerData(null)}
              className="absolute right-4 top-4 cursor-pointer text-2xl font-bold text-white"
            >
              skip
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JackpotWinningOverlay;
