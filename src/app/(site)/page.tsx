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

import {
  getGuidesData,
  getServicesData,
  getSkillsData,
  getTestimonialsData,
} from "@/lib/content";

// Rendered statically and refreshed hourly. Admin edits call revalidatePath
// so changes appear on the next request rather than waiting this out.
export const revalidate = 3600;

export default async function Home() {
  const [services, guides, testimonials, skills] = await Promise.all([
    getServicesData(),
    getGuidesData(),
    // Only pinned testimonials appear in the home page marquee.
    getTestimonialsData(true),
    getSkillsData(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <LogoStrip />
      <Services data={services} />
      <ProgrammeGuides data={guides} />

      <Testimonials data={testimonials} />

      <Skills data={skills} />
      <InstagramFeed />
      <FAQ />
      <CTABand />

      <Contact />
    </main>
  );
}
