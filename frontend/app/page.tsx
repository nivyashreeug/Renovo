import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-[#5227FF] selection:text-white">
      <Navbar />
      <Hero />
      
      {/* Spacer for scroll demonstration */}
      <div className="h-[500px] w-full bg-[#050816]" />
    </main>
  );
}
