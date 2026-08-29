"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InstagramLogo, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";

const LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/peragibbs_mvmt/",
    icon: InstagramLogo,
    external: true,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/64220470407",
    icon: WhatsappLogo,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:admin@peragibbsmovement.com",
    icon: EnvelopeSimple,
    external: false,
  },
];

export default function SocialRail() {
  const railRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!railRef.current) return;
    gsap.fromTo(
      railRef.current,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.8, delay: 1.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={railRef}
      className="pointer-events-none absolute inset-y-0 right-6 z-20 hidden flex-col items-center justify-center gap-5 opacity-0 md:right-10 md:flex"
    >
      <span className="h-16 w-px bg-paper/40" /> {/* Increased opacity */}
      {LINKS.map(({ label, href, icon: Icon, external }) => (
        <a
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          aria-label={label}
          className="pointer-events-auto text-paper/90 transition-colors duration-300 hover:text-ember hover:scale-110" // Increased opacity, added scale
        >
          <Icon size={28} weight="regular" /> {/* Increased size to 28, changed to regular weight */}
        </a>
      ))}
      <span className="h-16 w-px bg-paper/40" /> {/* Increased opacity */}
    </div>
  );
}