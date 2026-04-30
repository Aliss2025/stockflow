import Navbar from "@/sections/landing/Navbar";
import Hero from "@/sections/landing/Hero";
import Features from "@/sections/landing/Features";
import HowItWorks from "@/sections/landing/HowItWorks";
import Pricing from "@/sections/landing/Pricing";
import Testimonials from "@/sections/landing/Testimonials";
import CTA from "@/sections/landing/CTA";
import Footer from "@/sections/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
