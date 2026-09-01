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

function MaskedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="mask-word inline-block overflow-hidden pb-[0.12em]">
      <span className="word-inner inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      window.scrollTo(0, 0);

      const wordInners = headlineRef.current
        ? headlineRef.current.querySelectorAll(".word-inner")
        : [];

      // ---- Initial states ----
      gsap.set(imageWrapRef.current, { scale: 1.08, opacity: 0 });
      gsap.set(wordInners, { yPercent: 120 });
      gsap.set(taglineRef.current, { opacity: 0, y: 10 });
      gsap.set(subRef.current, { opacity: 0, y: 12 });
      gsap.set(ruleRef.current, { scaleX: 0 });

      // ---- Entrance timeline (on load) ----
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
      tl.to(imageWrapRef.current, { scale: 1, opacity: 1, duration: 1.6 })
        .to(
          wordInners,
          { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.07 },
          "-=1.15"
        )
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(ruleRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.4")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

      // ---- Pinned scroll story ----
      tl.eventCallback("onComplete", () => {
        const scrollTl = gsap.timeline({
          defaults: { ease: "power2.in", duration: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=90%",
            scrub: 0.7,
            pin: true,
            pinSpacing: true,
          },
        });

        scrollTl
          .to(imageWrapRef.current, { scale: 1.18, y: "-4%", ease: "none" }, 0)
          .to(wordInners, { yPercent: -140, opacity: 0, stagger: 0.05 }, 0)
          .to(taglineRef.current, { y: -24, opacity: 0 }, 0.08)
          .to(ruleRef.current, { scaleX: 0 }, 0.12)
          .to(subRef.current, { y: 26, opacity: 0 }, 0.12);

        ScrollTrigger.refresh();
      });
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

      {/* Top scrim — keeps the fixed navbar legible over bright areas of the photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 md:h-48"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 55%, transparent) 0%, transparent 100%)",
        }}
      />

      {/* Bottom scrim — grounds the headline/subtext over the shoulders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-ink) 80%, transparent) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 md:px-16 md:pb-20">
        {/* Whole content group (headline, tagline, rule, paragraph) shifts
            up together on mobile — existing margins between them (mt-2,
            mt-5, mt-4) stay untouched, so their gaps remain equal. */}
        <div className="-translate-y-16 sm:translate-y-0">
          <div ref={maskRef} className="max-w-2xl md:max-w-3xl">
            <h1
              ref={headlineRef}
              className="font-head text-[clamp(2rem,5.2vw,3.75rem)] font-semibold uppercase leading-[1.05] tracking-tightest text-navy"
            >
              <span className="flex flex-wrap gap-x-3 md:gap-x-4">
                <MaskedWord>Move</MaskedWord>
                <MaskedWord>well,</MaskedWord>
              </span>
              <span className="flex flex-wrap gap-x-3 md:gap-x-4">
                <MaskedWord>perform</MaskedWord>
                <MaskedWord>better.</MaskedWord>
              </span>
            </h1>
            <p
              ref={taglineRef}
              className="mt-2 font-head text-[clamp(0.9rem,2vw,1.15rem)] font-normal uppercase tracking-widest text-paper/60"
            >
              Kia Neke Pai
            </p>
          </div>

          <span ref={ruleRef} className="mt-5 h-px w-16 origin-left bg-navy md:mt-6" />

          <p
            ref={subRef}
            className="mt-4 max-w-md font-body text-base text-paper/75 md:text-lg"
          >
            Developing athletes from the ground up - structured S&C coaching from self-managed programming to fully tailored weekly support and in-person sessions in Auckland.
          </p>
        </div>
      </div>

      <SocialRail />
    </section>
  );
}