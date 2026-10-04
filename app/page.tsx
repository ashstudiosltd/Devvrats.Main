import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Fundamentals from "./components/fundamentals";
import Footer from "./components/footer";
import AboutDevvrats from "./components/aboutdevvrats";
import ScrollImageSection from "./components/Scrollimagesection";
import BottomProgressiveBlur from "@/components/BottomProgressiveBlur";
import SabhaSection from "./components/Sabhasection";
import DID from "./components/didsection";
import SmoothScroll from "@/components/SmoothScroll";

export default function Page() {
  return (
    <SmoothScroll>
      <Navbar />

      <Hero />

      <div data-slow>
        <AboutDevvrats />
      </div>

      <ScrollImageSection />

      <Fundamentals />

      <DID />

      <div data-slow>
        <SabhaSection />
      </div>

      <BottomProgressiveBlur />

      <Footer />
    </SmoothScroll>
  );
}