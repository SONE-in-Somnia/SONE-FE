import Card from "@/components/card";
import { ChevronLeft } from "lucide-react";

const Title = () => {
  return (
    <Card className="flex items-center gap-4">
      <ChevronLeft size={24} />
      <div>
        <h2>Wheel of Fortunes</h2>
        <p className="text-text/75">
          1 winner takes all the pool! Lucky is in your hand
        </p>
      </div>
    </Card>
  );
};

export default Title;
