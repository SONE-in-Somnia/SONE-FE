import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import StatsItem from "./StatsItem";

const PoolStats = () => {
  return (
    <Card className="p-6 shadow-[inset_0px_0px_24px_0px_#8371E980]">
      <div className="flex items-center justify-between">
        <p className="text-foreground opacity-50">Stats</p>
        <div className="flex items-center gap-2 text-primary">
          <Eye />
          <p>77 Watching</p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-7">
        <StatsItem statistics="3,456" title="Prize Pool" />
        <StatsItem statistics="36/50" title="Players" />
        <StatsItem statistics="0" title="Your Entries" />
        <StatsItem statistics="10%" title="Your Win Chance" />
      </div>
    </Card>
  );
};
export default PoolStats;
