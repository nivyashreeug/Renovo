import ContactSection from "@/components/home/ContactSection";
import Hero from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import LiveTrackingSection from "@/components/home/LiveTrackingSection";
import Navbar from "@/components/home/Navbar";
import ReviewsSection from "@/components/home/ReviewsSection";
import ServicesMegaMenu from "@/components/home/ServicesMegaMenu";
import ServicesSection from "@/components/home/ServicesSection";
import TechnicianSection from "@/components/home/TechnicianSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-[#5227FF] selection:text-white">
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <ServicesMegaMenu />
      <section id="services">
        <ServicesSection />
      </section>
      <section id="technicians">
        <TechnicianSection />
      </section>
      <HowItWorksSection />
      <LiveTrackingSection />
      <section id="reviews">
        <ReviewsSection />
      </section>
      <section id="contacts">
        <ContactSection />
      </section>
    </main>
  );
}
