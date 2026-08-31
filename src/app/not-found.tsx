"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "@phosphor-icons/react";

const ASCII_404 = [
  " ██╗  ██╗ ██████╗ ██╗  ██╗",
  " ██║  ██║██╔═████╗██║  ██║",
  " ███████║██║██╔██║███████║",
  " ╚════██║████╔╝██║╚════██║",
  "      ██║╚██████╔╝     ██║",
  "      ╚═╝ ╚═════╝      ╚═╝",
];

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = charRefs.current.filter(Boolean);

      gsap.set(chars, { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.set(glowRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(glowRef.current, { opacity: 1, duration: 1.2 })
        .to(
          chars,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: {
              each: 0.012,
              from: "random",
            },
          },
          "-=0.9"
        )
        .fromTo(
          containerRef.current?.querySelectorAll("[data-fade]") ?? [],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.3"
        );

      // Ambient flicker on random characters
      const flicker = () => {
        const el = chars[Math.floor(Math.random() * chars.length)];
        if (!el) return;
        gsap.to(el, {
          opacity: 0.25,
          duration: 0.06,
          yoyo: true,
          repeat: 1,
          ease: "none",
        });
      };
      const flickerInterval = setInterval(flicker, 220);

      // Slow scanline sweep
      if (scanlineRef.current) {
        gsap.to(scanlineRef.current, {
          yPercent: 2000,
          duration: 6,
          repeat: -1,
          ease: "none",
        });
      }

      // Slow ambient glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });

      return () => clearInterval(flickerInterval);
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden overflow-y-hidden bg-ink px-4 pt-24 text-center sm:px-6 sm:pt-28 md:pt-32"
    >
      {/* Ambient ember glow behind the ASCII block */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute h-[45vh] w-[45vh] rounded-full bg-navy/20 blur-[100px] md:h-[60vh] md:w-[60vh] md:blur-[120px]"
      />

      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanline sweep */}
      <div
        ref={scanlineRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-transparent via-paper/[0.04] to-transparent"
      />

      <div className="relative z-10 flex w-full max-w-full flex-col items-center px-2">
        <pre
          className="select-none overflow-hidden font-mono leading-[1.15] text-navy"
          style={{ fontSize: "clamp(0.85rem, 5.4vw, 4.5rem)" }}
        >
          {ASCII_404.map((line, lineIndex) => (
            <div key={lineIndex} aria-hidden={lineIndex !== 2}>
              {line.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  ref={(el) => {
                    charRefs.current[lineIndex * 100 + charIndex] = el;
                  }}
                  className="inline-block"
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </pre>
        <span className="sr-only">404</span>

        <p
          data-fade
          className="mt-8 font-body text-sm text-paper/55 sm:mt-10 sm:text-base md:text-lg"
        >
          This page doesn&apos;t exist.
        </p>

        <Link
          data-fade
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-paper px-6 py-2.5 font-head text-xs font-semibold uppercase tracking-wide text-paper transition-colors duration-300 hover:border-ember hover:bg-navy hover:text-ink sm:mt-8 sm:px-7 sm:py-3 sm:text-sm"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to home
        </Link>
      </div>
    </main>
  );
}