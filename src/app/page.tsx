import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import LogoStrip from "@/components/logos/LogoStrip";
import Services from "@/components/services/Services";
import Skills from "@/components/skills/Skills";
import Testimonials from "@/components/testimonials/Testimonials";
import ProgrammeGuides from "@/components/guides/ProgrammeGuides";
import FAQ from "@/components/faq/FAQ";
import Contact from "@/components/contact/Contact";
import InstagramFeed from "@/components/instagram/InstagramFeed";
import CTABand from "@/components/cta/CTABand";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <LogoStrip />
      <Services />
      <ProgrammeGuides />
      
      <Testimonials />
      

      <Skills />
      <InstagramFeed />
      <FAQ />
      <CTABand />
    
      <Contact />
    </main>
  );
}