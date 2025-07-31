import Banner from "@/views/home/banner";
import SpotLightGames from "@/views/home/spotlightGames";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Banner />
      <SpotLightGames />
    </div>
  );
}
