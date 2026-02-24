import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import RentalCatalogSection from "@/components/RentalCatalogSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <HeroSection />
    <PortfolioSection />
    <RentalCatalogSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
