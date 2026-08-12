import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStatement from "@/components/landing/TrustStatement";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import LargeFeature from "@/components/landing/LargeFeature";
import Security from "@/components/landing/Security";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased selection:bg-orange-500/20 selection:text-orange-100">
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <TrustStatement />
        <Features />
        <Workflow />
        <LargeFeature />
        <Security />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}