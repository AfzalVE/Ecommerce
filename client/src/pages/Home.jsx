import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Newsletter from "../components/home/Newsletter";

export default function Home() {

  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <Newsletter />
    </>
  );

}