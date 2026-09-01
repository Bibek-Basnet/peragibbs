"use client";

import { useEffect, useRef } from "react";
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

const AUTO_SCROLL_SPEED = 0.4; // px per frame - tune for pace
const RESUME_DELAY = 2500; // ms after user stops interacting before auto-scroll resumes

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

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
    },
    { scope: sectionRef }
  );

  // Auto-scroll loop, driven by real scrollLeft so it coexists with
  // native touch/trackpad scroll and click-drag on the same element.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!pausedRef.current && !isDraggingRef.current) {
        track.scrollLeft += AUTO_SCROLL_SPEED;

        // Seamless loop: content is rendered twice back-to-back, so once
        // we've scrolled past the first copy's width, jump back by that
        // exact amount with no visible seam.
        const halfWidth = track.scrollWidth / 2;
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function pauseAutoScroll() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }

  // Click-and-drag support for desktop (mouse users, who have no native
  // horizontal touch gesture)
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    pauseAutoScroll();
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current || !trackRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    trackRef.current.scrollLeft = dragStartScrollRef.current - dx;
  }

  function handlePointerUp() {
    isDraggingRef.current = false;
    scheduleResume();
  }

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
              <span className="text-navy">What athletes say.</span>
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
        className="relative mt-14 md:mt-16"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={scheduleResume}
          onTouchStart={pauseAutoScroll}
          onTouchEnd={scheduleResume}
          className="scrollbar-hide flex w-full cursor-grab gap-6 overflow-x-auto px-6 active:cursor-grabbing md:gap-8 md:px-16"
          style={{ scrollBehavior: "auto" }}
        >
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