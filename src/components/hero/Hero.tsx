"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SocialRail from "./SocialRail";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  window.history.scrollRestoration = "manual";
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      window.scrollTo(0, 0);

      gsap.set(imageWrapRef.current, { scale: 1.08, opacity: 0 });
      gsap.set(maskRef.current, { overflow: "hidden" });
      gsap.set(headlineRef.current, { yPercent: 100 });
      gsap.set(subRef.current, { opacity: 0, y: 12 });
      gsap.set(ruleRef.current, { scaleX: 0 });
      gsap.set(scrollCueRef.current, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
      tl.to(imageWrapRef.current, { scale: 1, opacity: 1, duration: 1.6 })
        .to(headlineRef.current, { yPercent: 0, duration: 1.1, ease: "power4.out" }, "-=1.1")
        .to(ruleRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.5")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, "-=0.2");

      // ---- Scroll-tied depth: single filter-free scale, no compositing fights ----
      gsap.to(imageWrapRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to([headlineRef.current, subRef.current, ruleRef.current], {
        opacity: 0,
        y: -16,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "35% top",
          scrub: 0.6,
        },
      });

      gsap.to(scrollCueRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "15% top",
          scrub: 0.6,
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-ink"
    >
      <div ref={imageWrapRef} className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/hero3.jpg"
          alt="Pera Gibbs, strength and conditioning coach"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_12%]"
          style={{ filter: "grayscale(1) contrast(1.1) brightness(0.95)" }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-ink) 80%, transparent) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 md:px-16 md:pb-20">
        <div ref={maskRef} className="max-w-4xl">
          <h1
            ref={headlineRef}
            className="font-head text-[clamp(2.6rem,7vw,5.5rem)] font-semibold uppercase leading-[0.95] tracking-tightest text-paper"
          >
            Built to Perform.
          </h1>
        </div>

        <span ref={ruleRef} className="mt-6 h-px w-16 origin-left bg-ember md:mt-8" />

        <p ref={subRef} className="mt-5 max-w-md font-body text-lg text-paper/75 md:text-xl">
          Strength &amp; conditioning for the next generation of athletes.
        </p>
      </div>

      <SocialRail />

      <div
        ref={scrollCueRef}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2"
      />
    </section>
  );
}