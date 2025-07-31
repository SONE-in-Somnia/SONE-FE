import SelectAsset from "@/components/select-asset";
import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RaffleCard from "./raffle-card";

const DialogRaffleContent = () => {
  return (
    <div className="">
      <DialogHeader>
        <DialogTitle>My Raffles</DialogTitle>
        <DialogDescription>
          here you can see all raffles you’re currently participating in
        </DialogDescription>
      </DialogHeader>
      <div className="mt-8">
        <Tabs defaultValue="inprogress">
          <TabsList className="grid w-[350px] grid-cols-2 bg-secondary border-none">
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <Badge className="h-7 rounded-full">All</Badge>
              <Badge className="h-7 rounded-full bg-secondary">
                Exclusive Only
              </Badge>
            </div>

            <div className="">
              <SelectAsset />
            </div>
          </div>

          <TabsContent
            value="inprogress"
            className="pt-4 grid grid-cols-2 gap-4"
          >
            {[...Array(2)].map((_, i) => (
              <RaffleCard />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DialogRaffleContent;
