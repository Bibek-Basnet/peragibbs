"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "@phosphor-icons/react";
import { TESTIMONIALS } from "@/data/testimonials";
import TestimonialCard from "./TestimonialCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 }
      ).fromTo(
        headingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.25"
      );

      if (trackRef.current) {
        tweenRef.current = gsap.to(trackRef.current, {
          xPercent: -50,
          duration: 55,
          ease: "none",
          repeat: -1,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section id="testimonials" ref={sectionRef} className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p
              ref={eyebrowRef}
              className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-paper/50"
            >
              Testimonials
            </p>
            <h2
              ref={headingRef}
              className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-paper md:text-5xl"
            >
              What athletes <span className="text-navy">say.</span>
            </h2>
          </div>

          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-2 rounded-full border border-paper/20 px-6 py-3 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-colors duration-300 hover:border-ember hover:bg-navy hover:text-ink"
          >
            View all
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div
        className="relative mt-14 overflow-hidden md:mt-16"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        }}
        onMouseEnter={() => tweenRef.current?.pause()}
        onMouseLeave={() => tweenRef.current?.play()}
      >
        <div ref={trackRef} className="flex w-max gap-6 px-6 md:gap-8 md:px-16">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <TestimonialCard
              key={`${t.name}-${i}`}
              testimonial={t}
              className="h-[480px] w-[600px] shrink-0 md:h-[520px] md:w-[680px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}