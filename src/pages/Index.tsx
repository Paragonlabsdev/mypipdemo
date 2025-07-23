import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-hero-bg flex flex-col">
      <Header />
      <HeroSection />
      {!isMobile && <Footer />}
    </div>
  );
};

export default Index;
