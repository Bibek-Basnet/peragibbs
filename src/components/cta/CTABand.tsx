"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WhatsappLogo, InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINKS = [
  {
    label: "WhatsApp",
    value: "Message directly",
    href: "https://wa.me/64220470407",
    icon: WhatsappLogo,
  },
  {
    label: "Instagram",
    value: "@peragibbs_mvmt",
    href: "https://www.instagram.com/peragibbs_mvmt/",
    icon: InstagramLogo,
  },
];

export default function CTABand() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll("[data-fade]") ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="bg-paper px-6 py-4 md:px-16 md:py-6">
      <div
        ref={sectionRef}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-8 py-14 md:px-14 md:py-16"
      >
        {/* Decorative dot-grid texture, right side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.15] md:block"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 100% 50%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 100% 50%, black 20%, transparent 75%)",
          }}
        />

        <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md text-center md:text-left">
            <p
              data-fade
              className="font-head text-xs font-semibold uppercase tracking-widest text-paper/50"
            >
              Still have questions?
            </p>
            <p
              data-fade
              className="mt-3 font-head text-2xl font-semibold uppercase leading-tight tracking-tight text-paper md:text-3xl"
            >
              Reach out <span className="text-navy">directly.</span>
            </p>
            <p
              data-fade
              className="mt-3 font-body text-sm leading-relaxed text-paper/60 md:text-base"
            >
              Message on WhatsApp or Instagram and Pera will get back to you
              personally.
            </p>
          </div>

          <div data-fade className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            {LINKS.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-paper/15 bg-panel px-5 py-4 transition-colors duration-300 hover:border-navy"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/10 text-navy">
                  <Icon size={20} weight="light" />
                </span>
                <span className="flex-1">
                  <span className="block font-head text-xs font-semibold uppercase tracking-widest text-paper/50">
                    {label}
                  </span>
                  <span className="block font-body text-sm text-paper">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="text-paper/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}