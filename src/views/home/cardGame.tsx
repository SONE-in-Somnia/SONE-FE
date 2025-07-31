import Button from "@/components/button";
import Image from "next/image";

const CardGame = () => {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="aspect-video h-auto w-full bg-black">
        <Image
          src="/images/card-game.png"
          alt="card game"
          width={400}
          height={400}
          className="h-full w-full"
        />
      </div>
      <div className="flex items-center justify-between bg-background p-4">
        <div className="flex items-center gap-4">
          <div className="aspect-square h-9 w-9 rounded-full bg-black"></div>
          <p>Game Name</p>
        </div>
        <Button>Play</Button>
      </div>
    </div>
  );
};

export default CardGame;
