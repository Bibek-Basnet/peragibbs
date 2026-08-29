"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const LOGOS = [
  { src: "/logos/logo1.png", alt: "All Blacks Sevens" },
  { src: "/logos/logo3.png", alt: "Black Ferns Sevens" },
  { src: "/logos/logo2.png", alt: "Northern Mystics" },
  { src: "/logos/logo4.png", alt: "Dilworth School" },
];

export default function LogoStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!trackRef.current) return;

    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section className="bg-ink py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <p className="mb-3 text-center font-head text-[10px] font-semibold uppercase tracking-widest text-paper/50 md:mb-4">
          Trusted by teams &amp; institutions
        </p>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
          onMouseEnter={() => tweenRef.current?.pause()}
          onMouseLeave={() => tweenRef.current?.play()}
        >
          <div ref={trackRef} className="flex w-max items-center gap-14 md:gap-20">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="relative h-16 w-36 shrink-0 opacity-90 transition-opacity duration-300 hover:opacity-100 md:h-20 md:w-44"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="176px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}