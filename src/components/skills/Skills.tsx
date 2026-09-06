"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { PublicSkill, SkillsData } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function SkillRow({ skill, index }: { skill: PublicSkill; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    if (!rowRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: rowRef.current, start: "top 82%" },
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      rowRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6 },
    ).fromTo(
      listRef.current?.children ?? [],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
      "-=0.35",
    );
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 gap-8 border-b border-ink/10 py-10 last:border-0 md:grid-cols-[280px_1fr] md:gap-16 md:py-12"
    >
      <div className="flex items-start gap-4">
        <span className="font-head text-sm font-semibold text-navy/20">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="font-head text-xs font-semibold uppercase tracking-widest text-navy">
            {skill.tag}
          </p>
          <h3 className="mt-2 font-head text-xl font-semibold tracking-tight text-ink md:text-2xl">
            {skill.title}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-grey md:text-base">
            {skill.description}
          </p>
        </div>
      </div>

      <ul ref={listRef} className="space-y-2">
        {skill.highlights.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-4 rounded-lg border border-ink/5 px-4 py-3 transition-all duration-200 hover:border-navy/20 hover:bg-navy/[0.02]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/40" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-head text-sm font-medium text-ink">
                  {item.title}
                </p>
                {item.badge ? (
                  <span className="rounded-full bg-navy/10 px-2 py-0.5 font-head text-[10px] font-semibold uppercase tracking-widest text-navy">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="font-body text-sm leading-relaxed text-grey">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills({ data }: { data: SkillsData }) {
  const { section, skills } = data;
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

  if (skills.length === 0) return null;

  return (
    <section id="skills" ref={sectionRef} className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="mb-3 font-head text-xs font-semibold uppercase tracking-widest text-grey"
          >
            {section.eyebrow}
          </p>
          <h2
            ref={headingRef}
            className="font-head text-3xl font-semibold uppercase leading-[0.95] tracking-tightest text-navy md:text-4xl"
          >
            {section.heading}
          </h2>
        </div>

        <div className="mt-12 border-t border-ink/10 md:mt-14">
          {skills.map((skill, i) => (
            <SkillRow key={skill.id} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
