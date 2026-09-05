"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CREDENTIALS = [
  { label: "Coaching focus", value: "Strength, Conditioning, Speed, Skills" },
  {
    label: "Specialty",
    value: "Team Sports (Rugby, Netball, Basketball, Football)",
  },
  { label: "Level", value: "Youth, Emerging Athletes" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRefs = useRef<HTMLParagraphElement[]>([]);
  const credRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(imageMaskRef.current, { overflow: "hidden" });
      gsap.set(imageRef.current, { scale: 1.15 });

      gsap.fromTo(
        imageMaskRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: imageMaskRef.current,
            start: "top 85%",
          },
        },
      );

      gsap.to(imageRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        defaults: { ease: "power3.out" },
      });

      textTl
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.25",
        )
        .fromTo(
          paraRefs.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
          "-=0.35",
        )
        .fromTo(
          credRef.current?.children ?? [],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.3",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section id="about" ref={sectionRef} className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:gap-16 md:px-16">
        {/* Photo */}
        <div
          ref={imageMaskRef}
          className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full"
        >
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src="/about-1.jpg"
              alt="Pera Gibbs coaching on the field"
              fill
              sizes="(max-width: 768px) 90vw, 40vw"
              className="object-cover grayscale"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col justify-center md:pl-4">
          <p
            ref={eyebrowRef}
            className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-grey"
          >
            About Pera
          </p>

          <h2
            ref={headingRef}
            className="font-head text-4xl font-semibold uppercase leading-[1.05] tracking-tightest text-navy md:text-5xl"
          >
            Kia ora, I'm Pera.
          </h2>

          <p
            ref={(el) => {
              if (el) paraRefs.current[0] = el;
            }}
            className="mt-7 font-body text-lg leading-relaxed text-ink/75"
          >
            A qualified strength and conditioning coach from Gisborne, now based
            in Auckland, NZ. I have over 10 years of experience in
            high-performance sport and have coached some of the best athletes
            New Zealand has produced.
            <br />
            <br />
            Health and fitness isn't just my profession - it's fundamental to
            how I live. Injury unfortunately ended my own rugby playing journey
            early, but it strengthened my passion to apply what I've learned to
            every athlete and team I work with. I try to lead by example in
            everything I do - applying the same training and science on myself,
            so I understand exactly what I'm asking of my athletes.
            <br />
            <br />
            These days, my focus is youth development - building the physical
            foundation and sport-specific skill that carries an athlete from
            junior level toward representative and national pathways.
          </p>

          <div
            ref={credRef}
            className="mt-10 grid grid-cols-1 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-3 sm:gap-6"
          >
            {CREDENTIALS.map((item) => (
              <div key={item.label}>
                <p className="font-head text-xs font-semibold uppercase tracking-widest text-grey">
                  {item.label}
                </p>
                <p className="mt-2 font-body text-[15px] leading-snug text-ink">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
