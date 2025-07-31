"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Player, Round } from "@/types/round";
import { convertWeiToEther } from "@/utils/string";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { Share2, Download } from "lucide-react";

interface SharePnlPopupProps {
  round: Round;
  playerDeposit: string;
  children: React.ReactNode;
}

const SharePnlPopup: React.FC<SharePnlPopupProps> = ({
  round,
  playerDeposit,
  children,
}) => {
  const [open, setOpen] = useState(true);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const totalValue = Number(convertWeiToEther(round.totalValue));
  const deposit = Number(convertWeiToEther(playerDeposit));

  const profitPercentage =
    deposit > 0 ? Math.floor((totalValue / deposit - 1) * 100) : 0;

  const monWon = totalValue - deposit;

  const leverage = deposit > 0 ? Math.floor(totalValue / deposit) : 0;

  const handleDownload = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          allowTaint: true,
          onclone: (clonedDoc, element) => {
            // Đảm bảo element clone có cùng kích thước với element gốc
            element.style.width = `${shareCardRef.current?.offsetWidth}px`;
            element.style.height = `${shareCardRef.current?.offsetHeight}px`;
            element.style.transform = "none";
          },
        });

        const dataUrl = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = `kuro-win-round-${round.roundId}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Đã tải xuống ảnh thành công!");
      } catch (error) {
        console.error("Lỗi khi tạo ảnh:", error);
        toast.error("Không thể tải xuống ảnh, vui lòng thử lại sau!");
      }
    }
  };

  const handleShare = async () => {
    if (shareCardRef.current && navigator.share) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          allowTaint: true,
          onclone: (clonedDoc, element) => {
            // Đảm bảo element clone có cùng kích thước với element gốc
            element.style.width = `${shareCardRef.current?.offsetWidth}px`;
            element.style.height = `${shareCardRef.current?.offsetHeight}px`;
            element.style.transform = "none";
          },
        });

        const dataUrl = canvas.toDataURL("image/png", 1.0);
        // Convert base64 to blob
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `kuro-win-round-${round.roundId}.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: "KURO Win Result",
          text: `Tôi vừa thắng ${convertWeiToEther(round.totalValue)} MON ở KURO!`,
          files: [file],
        });

        toast.success("Đã chia sẻ thành công!");
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Không thể chia sẻ, vui lòng thử lại sau!");
        }
      }
    } else {
      toast.info("Trình duyệt của bạn không hỗ trợ chia sẻ!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Result</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div
            ref={shareCardRef}
            className="relative aspect-[2/1] w-full max-w-md overflow-hidden rounded-xl p-4"
          >
            {/* Banner image background */}
            <div
              className="absolute inset-0 h-full w-full"
              style={{
                backgroundImage: "url(/images/banner_share.webp)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Content overlay */}
            <div className="relative z-10 flex h-full flex-col justify-between">
              {/* Top spacing element - replaced KURO logo */}
              <div className="h-8"></div>

              {/* PNL Results */}
              <div className="-mt-4 flex flex-1 flex-col items-center justify-center">
                <h2
                  className="mb-4 text-[80px] font-black leading-none"
                  style={{
                    color: "#1ef853",
                    textShadow: `
                                            -1px -1px 0 #000,  
                                            1px -1px 0 #000,
                                            -1px 1px 0 #000,
                                            1px 1px 0 #000,
                                            0 0 20px rgba(30, 248, 83, 0.5),
                                            0 0 40px rgba(30, 248, 83, 0.3)
                                        `,
                    WebkitTextStroke: "2px #11b33c",
                  }}
                >
                  {profitPercentage.toLocaleString()}%
                </h2>
                <div
                  className="flex items-center gap-3"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <span
                    className="text-3xl font-bold text-white"
                    style={{
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    +{monWon.toFixed(2)} MON
                  </span>
                </div>
              </div>

              {/* Bottom Branding */}
              <div className="flex items-end justify-end">
                {/* <div className="flex items-center gap-2">
                                    <Image
                                        src="/images/fuku-logo.png"
                                        alt="FUKU"
                                        width={100}
                                        height={30}
                                    />
                                </div> */}
                <div
                  className="rounded-lg px-3 py-1 text-sm text-white/90"
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Round #{round.roundId}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button
              onClick={handleDownload}
              className="flex-1 gap-2"
              variant="secondary"
            >
              <Download size={16} />
              Download
            </Button>
            <Button onClick={handleShare} className="flex-1 gap-2">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePnlPopup;
