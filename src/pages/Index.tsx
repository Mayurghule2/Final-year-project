
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CompaniesSection from "@/components/landing/CompaniesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AboutSection from "@/components/landing/AboutSection";
import StatisticsSection from "@/components/landing/StatisticsSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CompaniesSection />
      <AboutSection />
      <StatisticsSection />
      <Footer />
    </div>
  );
};

export default Index;
