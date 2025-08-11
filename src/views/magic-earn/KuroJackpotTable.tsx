"use client";
import { ChevronsUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import HistoryTable from "@/app/kuro/round-history/history-table";
import { useEffect, useState } from "react";
import JackpotHistoryTable from "./JackpotHistoryTable";
import { useSearchParams } from "next/navigation";

const KuroJackpotTable = () => {
  const [typeSelected, setTypeSelected] = useState<"Kuro" | "Jackpot">("Kuro");
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  useEffect(() => {
    console.log(type);

    if (type === "jackpot") {
      setTypeSelected("Jackpot");
    } else {
      setTypeSelected("Kuro");
    }
  }, [type]);
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="all">
        <div className="flex w-full items-center justify-between">
          <TabsList className="mb-5">
            <TabsTrigger value="all" className="w-[139px]">
              All
            </TabsTrigger>
            <TabsTrigger value="youWin" className="w-[139px]">
              You Win
            </TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 rounded-sm border bg-[#8371E940] px-2 py-1 text-xs transition-all hover:bg-[#8371E980]`}
            >
              <div className="flex flex-col gap-1 text-start font-medium">
                <span className="text-xs">Type: {typeSelected}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex flex-col gap-2 bg-[#8371E940] backdrop-blur-md"
              align="start"
            >
              <DropdownMenuItem
                className="cursor-pointer text-white transition-all"
                onClick={() => setTypeSelected("Kuro")}
              >
                Kuro
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-white transition-all"
                onClick={() => setTypeSelected("Jackpot")}
              >
                Jackpot
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsContent value="all">
          <Card className="pb-3 shadow-[inset_0px_0px_24px_0px_#8371E980]">
            {typeSelected === "Kuro" && <HistoryTable type="all" />}
            {typeSelected === "Jackpot" && <JackpotHistoryTable type="all" />}
          </Card>
        </TabsContent>
        <TabsContent value="youWin">
          <Card className="pb-3 shadow-[inset_0px_0px_24px_0px_#8371E980]">
            {typeSelected === "Kuro" && <HistoryTable type="youWin" />}
            {typeSelected === "Jackpot" && (
              <JackpotHistoryTable type="youWin" />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KuroJackpotTable;
