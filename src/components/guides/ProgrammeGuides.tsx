"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GUIDES = [
  {
    tag: "Team Sport Edition",
    title: "Rugby, netball & team athletes.",
    description:
      "TeamBuildr setup, your 12-week block breakdown, the PGMVMT Big Five testing benchmarks - Bronco, Broad Jump, Push Up, Bench Press, Trap Bar Deadlift, Chin Up - RIR/RPE load guidance, and speed & conditioning protocols.",
    href: "/guides/pdf1.pdf",
    image: "/gallery/guide1.jpg",
  },
  {
    tag: "Runner Edition",
    title: "Distance & endurance athletes.",
    description:
      "TeamBuildr setup, your 12-week block breakdown, 5km/10km/half/marathon time trial testing, RPE effort guidance, how to run a proper time trial, and how strength training integrates into your week.",
    href: "/guides/pdf2.pdf",
    image: "/gallery/guide2.jpg",
  },
];

function GuideBlock({
  guide,
  index,
}: {
  guide: (typeof GUIDES)[number];
  index: number;
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const reversed = index % 2 === 1;

  useGSAP(() => {
    gsap.set(imageMaskRef.current, { overflow: "hidden" });
    gsap.set(imageRef.current, { scale: 1.15 });

    gsap.fromTo(
      imageMaskRef.current,
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger: { trigger: blockRef.current, start: "top 82%" },
      }
    );

    gsap.to(imageRef.current, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: blockRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    gsap.fromTo(
      textRef.current ? textRef.current.children : [],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: blockRef.current, start: "top 78%" },
      }
    );
  }, [index]);

  return (
    <div
      ref={blockRef}
      className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 md:items-stretch md:gap-16 md:py-24"
    >
      <div
        className={"relative " + (reversed ? "md:order-2" : "md:order-1")}
      >
        <div
          ref={imageMaskRef}
          className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full"
        >
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div
        ref={textRef}
        className={
          "flex flex-col justify-center " +
          (reversed ? "md:order-1" : "md:order-2")
        }
      >
        <span className="w-fit font-head text-[11px] font-semibold uppercase tracking-[0.25em] text-navy">
          {guide.tag}
        </span>

        <h3 className="mt-4 font-head text-4xl font-semibold uppercase leading-[1.02] tracking-tightest text-navy md:text-5xl">
          {guide.title}
        </h3>

        <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-paper/65 md:text-xl">
          {guide.description}
        </p>

        <a
          href={guide.href}
          download
          className="group/btn mt-9 inline-flex w-fit items-center gap-3 rounded-full border-2 border-paper px-7 py-3.5 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-all duration-300 hover:bg-navy hover:text-ink"
        >
          Download guide
          <ArrowDown
            size={16}
            weight="bold"
            className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}

export default function ProgrammeGuides() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

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

  return (
    <section ref={sectionRef} className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <p
            ref={eyebrowRef}
            className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-paper/50"
          >
            Programme Guides
          </p>
          <h2
            ref={headingRef}
            className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-navy md:text-5xl"
          >
            Know exactly what you're getting.
          </h2>
        </div>

        <div className="mt-14 divide-y divide-paper/10 border-t border-paper/10 md:mt-16">
          {GUIDES.map((guide, i) => (
            <GuideBlock key={guide.tag} guide={guide} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}