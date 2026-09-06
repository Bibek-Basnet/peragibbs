"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DownloadSimple } from "@phosphor-icons/react";

import type { GuidesData, PublicGuide } from "@/lib/content";
import LeadCaptureModal from "./LeadCaptureModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GuideRow({
  guide,
  index,
  onSelect,
}: {
  guide: PublicGuide;
  index: number;
  onSelect: (guide: PublicGuide) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  const reversed = index % 2 === 1;

  useGSAP(() => {
    gsap.set(imageMaskRef.current, { overflow: "hidden" });
    gsap.set(imageRef.current, { scale: 1.15 });
    gsap.set(ruleRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: rowRef.current, start: "top 80%" },
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      imageMaskRef.current,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" },
    )
      .fromTo(
        numberRef.current,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.7",
      )
      .fromTo(
        textRef.current ? textRef.current.children : [],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 },
        "-=0.35",
      )
      .to(
        ruleRef.current,
        { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.3",
      );

    const counter = { val: 0 };
    gsap.to(counter, {
      val: index + 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: rowRef.current, start: "top 80%" },
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = String(
            Math.round(counter.val),
          ).padStart(2, "0");
        }
      },
    });

    gsap.to(imageRef.current, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: rowRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 items-center gap-10 border-b border-paper/10 py-16 last:border-0 md:grid-cols-2 md:gap-20 md:py-20"
    >
      <div className={reversed ? "md:order-2" : "md:order-1"}>
        <div
          ref={imageMaskRef}
          className="group relative aspect-[6/5] w-full overflow-hidden rounded-sm"
        >
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={guide.imageUrl}
              alt={guide.title}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover transition-all duration-700 ease-out md:grayscale md:group-hover:grayscale-0"
              style={{ objectPosition: guide.imagePosition }}
            />
          </div>
        </div>
      </div>

      <div
        ref={textRef}
        className={"flex flex-col " + (reversed ? "md:order-1" : "md:order-2")}
      >
        <div className="flex items-baseline gap-4">
          <span
            ref={numberRef}
            className="font-head text-2xl font-semibold tabular-nums text-paper/25"
          >
            00
          </span>
          <span className="font-head text-[11px] font-semibold uppercase tracking-[0.25em] text-navy">
            {guide.tag}
          </span>
        </div>

        <h3 className="mt-5 font-head text-3xl font-semibold uppercase leading-[1.05] tracking-tightest text-navy md:text-4xl">
          {guide.title}
        </h3>

        <span ref={ruleRef} className="mt-5 h-px w-12 origin-left bg-navy" />

        <p className="mt-5 max-w-md font-body text-base leading-relaxed text-paper/60 md:text-lg">
          {guide.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect(guide)}
          className="group/btn mt-8 inline-flex w-fit items-center gap-3 rounded-full border-2 border-paper px-7 py-3.5 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-all duration-300 hover:bg-navy hover:border-navy"
        >
          <DownloadSimple
            size={18}
            weight="bold"
            className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
          />
          {guide.ctaLabel}
        </button>
      </div>
    </div>
  );
}

export default function ProgrammeGuides({ data }: { data: GuidesData }) {
  const { section, guides } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [selectedGuide, setSelectedGuide] = useState<PublicGuide | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
      ).fromTo(
        headingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.25",
      );
    },
    { scope: sectionRef },
  );

  if (guides.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <p
            ref={eyebrowRef}
            className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-paper/50"
          >
            {section.eyebrow}
          </p>
          <h2
            ref={headingRef}
            className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-navy md:text-5xl"
          >
            {section.heading}
          </h2>
        </div>

        <div className="mt-16 border-t border-paper/10 md:mt-20">
          {guides.map((guide, i) => (
            <GuideRow
              key={guide.id}
              guide={guide}
              index={i}
              onSelect={setSelectedGuide}
            />
          ))}
        </div>
      </div>

      {/* Keying on the slug remounts the modal, which resets the multi-step
          form whenever a different guide is opened. */}
      <LeadCaptureModal
        key={selectedGuide?.slug ?? "closed"}
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
      />
    </section>
  );
}
