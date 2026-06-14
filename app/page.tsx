import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full h-16 md:w-[20%] md:h-screen">
        <Sidebar></Sidebar>
      </div>
      <div className="flex-col">
        <Hero></Hero>
      </div>
    </div>
  );
}
