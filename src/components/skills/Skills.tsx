"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SKILLS = [
  {
    tag: "Programming",
    title: "Strength & conditioning",
    description:
      "Program design built on high-performance principles - periodised strength blocks adapted for developing athletes.",
    highlights: [
      {
        title: "Periodised programming",
        detail: "Structured across macro and micro training blocks to build load progressively without burnout.",
      },
      {
        title: "Load management",
        detail: "Volume and intensity tailored to each athlete's training age and recovery capacity.",
      },
      {
        title: "Gym-based strength",
        detail: "Foundational lifts and accessory work built for long-term strength development.",
      },
    ],
  },
  {
    tag: "Technical",
    title: "Rugby skills development",
    description:
      "Specialises in the technical detail that separates good ball-players from great ones - built through repetition and game-realistic pressure.",
    highlights: [
      {
        title: "Catch & pass technical development",
        detail: "Handling and passing mechanics broken down and rebuilt for accuracy under pressure.",
      },
      {
        title: "Kicking",
        detail: "All forms specific to your game - technique built around your position and role.",
      },
      {
        title: "Off-load development",
        detail: "Contact-based off-loading technique trained for timing, control, and decision-making.",
      },
    ],
  },
  {
    tag: "Movement",
    title: "Speed & agility",
    description:
      "Acceleration mechanics, change-of-direction, and reactive speed work tailored to each athlete's movement profile.",
    highlights: [
      {
        title: "Sprint mechanics",
        detail: "Acceleration and top-speed technique broken down and rebuilt for efficiency.",
      },
      {
        title: "Change of direction",
        detail: "Deceleration control and cutting technique for safer, faster direction changes.",
      },
      {
        title: "Reactive agility",
        detail: "Speed and agility trained against live, game-like stimulus rather than fixed patterns.",
      },
    ],
  },
  {
    tag: "Recovery",
    title: "Injury prevention & rehab",
    description:
      "Return-to-play programming and prehab work that keeps athletes training through the seasons that matter.",
    highlights: [
      {
        title: "Return to play",
        detail: "Structured, staged progressions that rebuild capacity safely after injury.",
      },
      {
        title: "Movement screening",
        detail: "Regular screening to catch and correct issues before they become injuries.",
      },
      {
        title: "Ongoing mobility",
        detail: "Joint health and mobility work built into every training block, not bolted on.",
      },
    ],
  },
  {
    tag: "Development",
    title: "Youth athlete development",
    description:
      "Long-term athletic development frameworks - building physical literacy before chasing specialisation.",
    highlights: [
      {
        title: "Long-term planning",
        detail: "Age-appropriate development frameworks that build a base before specialising.",
      },
      {
        title: "Physical literacy",
        detail: "Fundamental movement competency prioritised before sport-specific demands.",
      },
      {
        title: "Clear communication",
        detail: "Coaching language and delivery matched to the athlete's age and stage.",
      },
    ],
  },
  {
    tag: "Analysis",
    title: "Performance monitoring",
    description:
      "Tracking load, progress, and readiness week to week so programming stays responsive, not static.",
    highlights: [
      {
        title: "Weekly tracking",
        detail: "Available on the Advanced tier - load and readiness monitored every week to guide programming decisions.",
        badge: "Advanced tier",
      },
      {
        title: "Progress reviews",
        detail: "Regular check-ins that keep athletes and programming aligned to real progress.",
      },
      {
        title: "Data-led adjustments",
        detail: "Programming shifts based on how the athlete is actually responding, not assumptions.",
      },
    ],
  },
];

function SkillRow({
  skill,
  index,
}: {
  skill: (typeof SKILLS)[number];
  index: number;
}) {
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
      { opacity: 1, y: 0, duration: 0.6 }
    ).fromTo(
      listRef.current?.children ?? [],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
      "-=0.35"
    );
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 gap-8 border-b border-ink/10 py-10 last:border-0 md:grid-cols-[280px_1fr] md:gap-16 md:py-12"
    >
      {/* Left: identity with subtle number */}
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

      {/* Right: highlights with subtle cards */}
      <ul ref={listRef} className="space-y-2">
        {skill.highlights.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-4 rounded-lg border border-ink/5 px-4 py-3 transition-all duration-200 hover:border-navy/20 hover:bg-navy/[0.02]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/40" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-head text-sm font-medium text-ink">
                  {item.title}
                </p>
                {"badge" in item && item.badge ? (
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

export default function Skills() {
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
    <section id="skills" ref={sectionRef} className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="mb-3 font-head text-xs font-semibold uppercase tracking-widest text-grey"
          >
            Skills &amp; Expertise
          </p>
          <h2
            ref={headingRef}
            className="font-head text-3xl font-semibold uppercase leading-[0.95] tracking-tightest text-navy md:text-4xl"
          >
            Every discipline covered.
          </h2>
        </div>

        <div className="mt-12 border-t border-ink/10 md:mt-14">
          {SKILLS.map((skill, i) => (
            <SkillRow key={skill.title} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}