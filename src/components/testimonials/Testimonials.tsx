"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Quotes } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// `position` lets each photo's crop be tuned individually so people
// aren't cut off — format "horizontal% vertical%". Lower vertical %
// keeps more headroom. Adjust per-photo once you see how each one crops.
const TESTIMONIALS = [
  {
    quote:
      "I had the privilege of working with Pera for several years during my time with the Black Ferns Sevens, where he served as my Strength and Conditioning Coach. Throughout that period, he consistently prepared me to perform at the highest level of international rugby.",
    name: "Sarah Hirini (Goss)",
    role: "Black Ferns Sevens",
    photo: "/testimonials/Sarah Hirini.jpeg",
    position: "50% 20%",
  },
  {
    quote:
      "I had the privilege of being coached by Pera across the 2021, 2022 and 2023 ANZ Premiership seasons as well as between seasons leading into Silver Ferns campaigns. In my time with him, my fitness testing numbers shifted considerably and those improved results became my new baseline. These results gained me selection for the 2022 Commonwealth Games and the 2023 Netball World Cup.",
    name: "Grace Nweke",
    role: "Silver Fern",
    photo: "/testimonials/Grace.jpg",
    position: "50% 15%",
  },
  {
    quote:
      "I have been lucky enough to work with Pera over many stages through both my amateur and professional rugby career. He's clearly very well educated and confident in what he is teaching is right for me specifically at that time as his messaging around what we do and why we do it is always super clear. I've always trusted Pera to get me fit and firing as an athlete to perform at the highest level when healthy and have also been lucky enough to have his guidance through injury and rehab periods of my career as well.",
    name: "Brad Weber",
    role: "All Black",
    photo: "/testimonials/Brad Weber.jpg",
    position: "50% 20%",
  },
  {
    quote:
      "I've known Pera for over 20 years and have jumped into plenty of sessions with him over that time, so I've seen first-hand how he operates. He's got an unreal growth mindset and is seriously competitive. His energy rubs off on those around him and undoubtedly brings out the best in people. Everything he does has a purpose, and he keeps things simple.",
    name: "Jamison Gibson-Park",
    role: "Irish International Rugby | Leinster Rugby",
    photo: "/testimonials/Jamison Gibson Park.webp",
    position: "50% 15%",
  },
  {
    quote:
      "Before training with Pera I felt pretty fit and decent at footy. After working together I noticed I wasn't as fit or as skilled as I thought, and his attention to detail and ability to teach skillsets is impressive.",
    name: "Harry Speight",
    role: "North Harbour Club Rugby",
    photo: "/testimonials/Harry Speight.jpg",
    position: "50% 20%",
  },
];

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
        <div className="text-center">
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
            What athletes <span className="text-ember">say.</span>
          </h2>
        </div>
      </div>

      {/* Full-bleed marquee */}
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
            <div
              key={`${t.name}-${i}`}
              className="flex h-[480px] w-[600px] shrink-0 overflow-hidden rounded-2xl border border-paper/10 bg-panel md:h-[520px] md:w-[680px]"
            >
              {/* Photo — bigger column, per-photo crop control, full color */}
              <div className="relative w-[48%] shrink-0">
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  sizes="340px"
                  className="object-cover"
                  style={{ objectPosition: t.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>

              {/* Quote */}
              <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
                <div>
                  <Quotes size={22} weight="fill" className="text-ember" />
                  <p className="mt-3 font-body text-sm leading-relaxed text-paper/85 md:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-5 border-t border-paper/10 pt-4">
                  <p className="font-head text-sm font-semibold uppercase tracking-widest text-paper">
                    {t.name}
                  </p>
                  <p className="mt-1 font-body text-xs text-paper/50">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}