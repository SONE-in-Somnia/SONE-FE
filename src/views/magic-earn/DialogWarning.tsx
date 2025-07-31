"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { CONST_TYPE } from "@/utils/cookie";
import { useEffect, useState } from "react";
import { TimeEnum } from "@/context/KuroContext";

const DialogWarningKuro = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    localStorage.setItem(
      CONST_TYPE.KURO_WARNING,
      JSON.stringify({ iat: Date.now() + TimeEnum._1DAY }),
    );
    setIsOpen(false);
  };

  useEffect(() => {
    const _localStorageWarning = localStorage.getItem(CONST_TYPE.KURO_WARNING);
    if (!_localStorageWarning) {
      setIsOpen(true);
    } else if (
      _localStorageWarning &&
      JSON.parse(_localStorageWarning).iat < Date.now()
    ) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        style={{
          boxShadow: "inset 0 0 24px #E9717380",
        }}
        className="flex w-full max-w-[540px] flex-col gap-6 rounded-lg border border-[#823536] bg-devil p-6"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            alt=""
            src={"/images/devilmode.png"}
            className="mb-5 mt-3 aspect-[3] h-[72px] w-auto"
            width={300}
            height={72}
          />
          <p className="py-3 text-xl font-semibold">Entering DEVIL MODE</p>
          <p className="max-w-[340px] text-gray">
            You are entering DEVIL MODE ,which means you can earn XNXX but can
            lose the fund also. <br />
            <br />
            👹 Have gut to join? 👹
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button
            className="w-full bg-red-400 hover:bg-red-400/90"
            onClick={handleClose}
          >
            LFG!
          </Button>
          <Link href="/" className="w-full">
            <Button className="w-full bg-red-400/50 hover:bg-red-400">
              Go back
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWarningKuro;
