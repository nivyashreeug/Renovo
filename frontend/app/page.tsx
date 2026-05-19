import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ServicesMegaMenu from "@/components/ServicesMegaMenu";
import TechnicianSection from "@/components/TechnicianSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import LiveTrackingSection from "@/components/LiveTrackingSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";

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
