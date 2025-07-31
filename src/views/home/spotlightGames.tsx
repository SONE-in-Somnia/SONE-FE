import Card from "@/components/card";
import CardGame from "./cardGame";
import { Info } from "lucide-react";
import Button from "@/components/button";

const SpotLightGames = () => {
  return (
    <Card>
      <div>
        <h2>Spotlight Games</h2>
        <p className="text-text/75">
          Dive in the Somnia network with supreme games
        </p>
      </div>
      <div className="mb-6 mt-9 grid grid-cols-3 gap-4">
        <CardGame />
        <CardGame />
        <CardGame />
      </div>
      <Card className="flex items-center justify-between !bg-background p-4">
        <div className="text-text/50 flex items-center gap-2">
          <Info />
          <p>
            Want to join us, and have your games published on Sone? We are happy
            to do that
          </p>
        </div>
        <Button>Contact us</Button>
      </Card>
    </Card>
  );
};

export default SpotLightGames;
