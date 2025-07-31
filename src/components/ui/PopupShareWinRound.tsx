"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Round } from "@/types/round";
import { convertWeiToEther } from "@/utils/string";
import { getTotalUserEntries } from "@/views/magic-earn/RoundHistory";
import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface PopupShareWinRoundProps {
  round: Round;
  children: React.ReactNode;
}

const getPercentage = (round: Round): number => {
  const totalValue = Number(convertWeiToEther(round.totalValue));
  const winner = round.participants.find(
    (p) => p.address.toLowerCase() === round.winner.toLowerCase(),
  );
  const deposit = winner
    ? Number(
        convertWeiToEther(
          getTotalUserEntries(round, winner.address).toString(),
        ),
      )
    : 0;
  return (totalValue / deposit) * 100;
};

const PopupShareWinRound: React.FC<PopupShareWinRoundProps> = ({
  round,
  children,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(
    `/ogPnL?percentage=${getPercentage(round).toFixed(2)}%&amount=${convertWeiToEther(round.totalValue)}%20MON`,
  );

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleDownload = async () => {
    if (imageRef.current) {
      try {
        const response = await fetch(imageRef.current.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.download = `kuro-win-round-${round.roundId}.png`;
        link.href = url;
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.error("Error downloading image");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="mx-auto aspect-video w-full max-w-[1200px] border-none p-0 max-md:w-[90%]">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="relative text-[10px] max-[1200px]:text-[0.8vw]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Share win round"
            width={1198}
            height={692}
            className="h-full w-full object-cover"
            onLoad={handleImageLoad}
          />

          {/* Download Button */}
          <div
            className="download-button group absolute bottom-[12px] right-[20px] aspect-square cursor-pointer rounded border-2 border-white p-[8px] backdrop-blur-md transition-all hover:border-primary/70 hover:bg-primary/70"
            onClick={handleDownload}
          >
            <Download width={20} height={20} className="" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupShareWinRound;
