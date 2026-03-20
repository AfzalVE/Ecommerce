import HeroSection from "../../shared/components/home/HeroSection";
import CategorySection from "../../shared/components/home/CategorySection";
import FeaturedProducts from "../../shared/components/home/FeaturedProducts";
import Newsletter from "../../shared/components/home/Newsletter";

// NEW
import TrustSection from "../../shared/components/home/TrustSection";
import PromoBanner from "../../shared/components/home/PromoBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />     {/* 🔥 NEW */}
      <CategorySection />
      <PromoBanner />      {/* 🔥 NEW */}
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}