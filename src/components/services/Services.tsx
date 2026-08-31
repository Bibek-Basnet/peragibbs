"use client";

import { useRef, useState, Fragment } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, CaretDown, ArrowRight } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Confirm this with Pera before shipping - currently placeholder assumptions.
const UPFRONT_DISCOUNT = 0.08;
const ADVANCED_SPOTS_LEFT = 3;

type Tier = {
  name: string;
  price: number;
  fee: string;
  tagline: string;
  features: string[];
  bestFor: string;
  treatment: "dark" | "light-accent" | "dark-accent";
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: "Foundation",
    price: 49,
    fee: "$50 onboarding fee",
    tagline: "You're buying a focused program",
    features: [
      "Single-discipline programming - strength or conditioning based",
      "Structured block, self-managed",
    ],
    bestFor:
      "Athletes with one clear focus, or just getting started and want to keep it simple.",
    treatment: "dark",
  },
  {
    name: "Intermediate",
    price: 79,
    fee: "$50 onboarding fee",
    tagline: "You're buying complete, balanced programming",
    features: [
      "Strength and conditioning combined into one structured block",
      "Built for well-rounded athletic development",
      "Structured block, self-managed",
    ],
    bestFor:
      "Athletes who want proper all-around development without needing hands-on coaching.",
    treatment: "light-accent",
    badge: "Recommended",
  },
  {
    name: "Advanced",
    price: 119,
    fee: "$100 onboarding fee",
    tagline: "You're buying me",
    features: [
      "Gym and conditioning focused programming",
      "Fully tailored and mapped out week to week",
      "Weekly check-ins and adjustments where needed",
    ],
    bestFor:
      "Athletes chasing a specific performance target or needing specialised support (e.g. injury rehab).",
    treatment: "dark-accent",
    badge: "Full Coaching",
  },
];

const IN_PERSON = [
  { label: "1:1", price: "150" },
  { label: "2 athletes", price: "200" },
  { label: "3 athletes", price: "250" },
];

const STEPS = [
  {
    title: "Apply",
    desc: "A 2-minute form - no payment needed yet.",
  },
  {
    title: "Onboarding call",
    desc: "We map your goals and confirm the right tier.",
  },
  {
    title: "Start training",
    desc: "Your program lands on day one of your block.",
  },
];

type CompareValue = string | boolean;
type CompareRow = { label: string; values: CompareValue[] };
type CompareGroup = { title: string; rows: CompareRow[] };

const RECOMMENDED_INDEX = 1;

const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: "Pricing",
    rows: [
      { label: "Weekly price", values: ["$49", "$79", "$119"] },
      { label: "Onboarding fee", values: ["$50", "$50", "$100"] },
    ],
  },
  {
    title: "Programming",
    rows: [
      {
        label: "Programming style",
        values: ["Single discipline", "Strength + conditioning", "Fully tailored"],
      },
      {
        label: "Program adjustments",
        values: ["At start only", "At start only", "Ongoing, weekly"],
      },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Weekly check-ins", values: [false, false, true] },
      { label: "Injury rehab / specific targets", values: [false, false, true] },
    ],
  },
];

function upfrontTotal(weeklyPrice: number) {
  return Math.round(weeklyPrice * 12 * (1 - UPFRONT_DISCOUNT));
}

function cardShellClass(treatment: Tier["treatment"]) {
  if (treatment === "dark") {
    return "bg-ink text-paper border border-paper/10";
  }
  if (treatment === "dark-accent") {
    return "bg-ink text-paper border-2 border-ember shadow-2xl shadow-ink/20 md:-translate-y-3";
  }
  return "bg-white text-ink border-2 border-navy/30";
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsWrapRef = useRef<HTMLDivElement>(null);
  const stepsLineRef = useRef<HTMLDivElement>(null);
  const inPersonRef = useRef<HTMLDivElement>(null);

  const [billing, setBilling] = useState<"weekly" | "upfront">("weekly");
  const [showCompare, setShowCompare] = useState(false);

  const pillRef = useRef<HTMLDivElement>(null);
  const priceRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const priceValues = useRef<number[]>(TIERS.map((t) => t.price));
  const compareWrapRef = useRef<HTMLDivElement>(null);
  const compareInnerRef = useRef<HTMLDivElement>(null);
  const stepItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stepDotRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const introTl = gsap.timeline({
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        defaults: { ease: "power3.out" },
      });

      introTl
        .fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.25"
        )
        .fromTo(
          noticeRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35"
        );

      gsap.fromTo(
        cardsRef.current ? cardsRef.current.children : [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        }
      );

      gsap.set(stepsLineRef.current, { scaleX: 0 });
      gsap.set(stepDotRefs.current, { scale: 0.6, opacity: 0.4 });

      gsap.to(stepsLineRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: stepsWrapRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      stepDotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: stepItemRefs.current[i],
            start: "top 78%",
          },
        });
      });

      gsap.fromTo(
        stepItemRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: stepsWrapRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        inPersonRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: inPersonRef.current, start: "top 85%" },
        }
      );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      gsap.to(pillRef.current, {
        xPercent: billing === "weekly" ? 0 : 100,
        duration: 0.45,
        ease: "power3.inOut",
      });

      TIERS.forEach((tier, i) => {
        const el = priceRefs.current[i];
        if (!el) return;
        const target = billing === "weekly" ? tier.price : upfrontTotal(tier.price);
        const counter = { val: priceValues.current[i] };

        gsap.to(counter, {
          val: target,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = "$" + Math.round(counter.val);
          },
          onComplete: () => {
            priceValues.current[i] = target;
          },
        });
      });
    },
    { dependencies: [billing], scope: sectionRef }
  );

  useGSAP(
    () => {
      const wrap = compareWrapRef.current;
      const inner = compareInnerRef.current;
      if (!wrap || !inner) return;

      if (showCompare) {
        const targetHeight = inner.scrollHeight;
        gsap.fromTo(
          wrap,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: () => {
              gsap.set(wrap, { height: "auto" });
            },
          }
        );
      } else {
        gsap.to(wrap, { height: 0, duration: 0.4, ease: "power3.inOut" });
      }
    },
    { dependencies: [showCompare], scope: sectionRef }
  );

  function setPriceRef(el: HTMLSpanElement | null, i: number) {
    priceRefs.current[i] = el;
  }

  function setStepItemRef(el: HTMLDivElement | null, i: number) {
    stepItemRefs.current[i] = el;
  }

  function setStepDotRef(el: HTMLDivElement | null, i: number) {
    stepDotRefs.current[i] = el;
  }

  return (
    <section id="services" ref={sectionRef} className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <p
            ref={eyebrowRef}
            className="mb-4 font-head text-xs font-bold uppercase tracking-[0.25em] text-black"
          >
            Coaching Offerings
          </p>
          <h2
  ref={headingRef}
  className="font-head text-5xl font-black uppercase leading-[0.92] tracking-tightest text-navy md:text-6xl"
>
  Programs built around you.
</h2>
        </div>

        <div ref={noticeRef} className="mx-auto mt-10 flex flex-col items-center gap-4 md:mt-12">
          <div className="relative flex w-full max-w-xs rounded-full border border-ink/10 bg-white p-1">
            <div
              ref={pillRef}
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink"
              style={{ willChange: "transform" }}
            />
            <button
              type="button"
              onClick={() => setBilling("weekly")}
              className={
                "relative z-10 flex-1 rounded-full py-2.5 font-head text-xs font-bold uppercase tracking-widest transition-colors duration-300 " +
                (billing === "weekly" ? "text-paper" : "text-ink/60")
              }
            >
              Pay weekly
            </button>
            <button
              type="button"
              onClick={() => setBilling("upfront")}
              className={
                "relative z-10 flex-1 rounded-full py-2.5 font-head text-xs font-bold uppercase tracking-widest transition-colors duration-300 " +
                (billing === "upfront" ? "text-paper" : "text-ink/60")
              }
            >
              Pay upfront
            </button>
          </div>
          <p className="font-body text-sm text-ink/60">
            {billing === "upfront"
              ? "12 weeks paid upfront - save " + Math.round(UPFRONT_DISCOUNT * 100) + "% vs. weekly."
              : "Rolling weekly billing after a 12-week minimum commitment. Cancel any time."}
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="mx-auto mt-14 grid max-w-6xl gap-6 md:mt-16 md:grid-cols-3 md:gap-6">
          {TIERS.map((tier, i) => {
            const isLight = tier.treatment === "light-accent";

            return (
              <div
                key={tier.name}
                className={
                  "relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl " +
                  cardShellClass(tier.treatment)
                }
              >
                {tier.badge ? (
                  <span
                    className={
                      "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 font-head text-[11px] font-bold uppercase tracking-widest " +
                      (isLight ? "bg-navy text-paper" : "bg-navy text-ink")
                    }
                  >
                    {tier.badge}
                  </span>
                ) : null}

                <p
                  className={
                    "font-head text-sm font-bold uppercase tracking-widest " +
                    (isLight ? "text-grey" : "text-paper/60")
                  }
                >
                  {tier.name}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    ref={(el) => setPriceRef(el, i)}
                    className="font-head text-5xl font-black tracking-tightest tabular-nums"
                  >
                    {"$" + tier.price}
                  </span>
                  <span className={"font-body text-base " + (isLight ? "text-ink/50" : "text-paper/60")}>
                    {billing === "weekly" ? "/week" : "/12 weeks"}
                  </span>
                </div>
                <p className={"mt-1 font-body text-sm " + (isLight ? "text-ink/45" : "text-paper/50")}>
                  {"+ " + tier.fee}
                </p>

                <p className={"mt-6 font-head text-lg font-bold leading-snug " + (isLight ? "text-ink" : "text-paper")}>
                  {tier.tagline}
                </p>

                <ul className="mt-5 flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        weight="bold"
                        className={"mt-0.5 shrink-0 " + (isLight ? "text-navy" : "text-navy")}
                      />
                      <span
                        className={
                          "font-body text-sm leading-relaxed " +
                          (isLight ? "text-ink/70" : "text-paper/80")
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={"mt-6 border-t pt-5 " + (isLight ? "border-ink/10" : "border-paper/15")}>
                  <p className={"font-body text-sm leading-relaxed " + (isLight ? "text-ink/55" : "text-paper/60")}>
                    <span className="font-semibold">Best for:</span> {tier.bestFor}
                  </p>
                  {tier.treatment === "dark-accent" ? (
                    <p className="mt-2 font-head text-xs font-bold uppercase tracking-widest text-navy">
                      {ADVANCED_SPOTS_LEFT + " spots left this intake"}
                    </p>
                  ) : null}
                </div>

                <a
                 
  href="https://form.jotform.com/261601330383043"
  target="_blank"
  rel="noreferrer"
  className={
    "mt-8 inline-flex items-center justify-center rounded-full py-3 font-head text-sm font-bold uppercase tracking-wide transition-colors duration-300 " +
    (isLight
      ? "bg-ink text-paper hover:bg-navy hover:text-paper"
      : "bg-navy text-ink hover:bg-paper")
  }
>
  Apply Now
</a>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div ref={stepsWrapRef} className="mx-auto mt-20 max-w-4xl md:mt-24">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-ink/10 md:block" />
            <div
              ref={stepsLineRef}
              className="absolute left-0 top-[22px] hidden h-px w-full origin-left bg-navy md:block"
            />

            <div className="grid gap-10 md:grid-cols-3 md:gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  ref={(el) => setStepItemRef(el, i)}
                  className="group relative flex flex-col items-center text-center md:items-start md:text-left"
                >
                  <div
                    ref={(el) => setStepDotRef(el, i)}
                    className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-navy bg-paper font-head text-sm font-bold text-ink transition-colors duration-300 group-hover:bg-navy group-hover:text-paper"
                  >
                    {i + 1}
                  </div>
                  <p className="mt-4 font-head text-lg font-bold tracking-tight text-ink">{step.title}</p>
                  <p className="mt-1.5 font-body text-sm text-ink/60">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compare table */}
        <div className="mx-auto mt-16 max-w-6xl md:mt-20">
          <button
            type="button"
            onClick={() => setShowCompare((v) => !v)}
            aria-expanded={showCompare}
            className={
              "group mx-auto flex w-full max-w-md items-center justify-between rounded-2xl border-2 px-6 py-4 transition-all duration-300 " +
              (showCompare
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-white text-ink hover:border-navy hover:bg-navy/5")
            }
          >
            <span className="text-left">
              <span className="block font-head text-sm font-bold uppercase tracking-widest">
                {showCompare ? "Hide full comparison" : "Compare all details"}
              </span>
              <span
                className={
                  "mt-0.5 block font-body text-xs " +
                  (showCompare ? "text-paper/60" : "text-ink/50")
                }
              >
                {showCompare ? "Collapse the table below" : "See every tier side by side"}
              </span>
            </span>
            <span
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 " +
                (showCompare
                  ? "border-paper/30"
                  : "border-ink/15 group-hover:border-navy group-hover:bg-navy group-hover:text-paper")
              }
            >
              <CaretDown
                size={16}
                weight="bold"
                className={"transition-transform duration-300 " + (showCompare ? "rotate-180" : "")}
              />
            </span>
          </button>

          <div ref={compareWrapRef} className="overflow-hidden" style={{ height: 0 }}>
            <div ref={compareInnerRef} className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="sticky left-0 z-10 bg-white p-4 text-left font-head text-xs font-bold uppercase tracking-widest text-grey">
                      {" "}
                    </th>
                    {TIERS.map((tier, i) => (
                      <th
                        key={tier.name}
                        className={
                          "p-4 text-left font-head text-xs font-bold uppercase tracking-widest " +
                          (i === RECOMMENDED_INDEX ? "bg-navy/5 text-navy" : "text-ink")
                        }
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_GROUPS.map((group) => (
                    <Fragment key={group.title}>
                      <tr className="border-b border-ink/5">
                        <td
                          colSpan={4}
                          className="sticky left-0 bg-ink/[0.03] p-3 font-head text-[11px] font-bold uppercase tracking-widest text-ink/50"
                        >
                          {group.title}
                        </td>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={row.label} className="border-b border-ink/5 last:border-0">
                          <td className="sticky left-0 z-10 bg-white p-4 font-body text-sm text-ink/70">
                            {row.label}
                          </td>
                          {row.values.map((val, i) => (
                            <td
                              key={i}
                              className={
                                "p-4 font-body text-sm text-ink " +
                                (i === RECOMMENDED_INDEX ? "bg-navy/5" : "")
                              }
                            >
                              {typeof val === "boolean" ? (
                                val ? (
                                  <Check size={16} weight="bold" className="text-navy" />
                                ) : (
                                  <span className="text-ink/25">-</span>
                                )
                              ) : (
                                val
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* In-person coaching */}
        <div
          ref={inPersonRef}
          className="mx-auto mt-8 max-w-6xl rounded-2xl border border-ink/10 bg-white p-8 md:mt-10 md:p-10"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-sm">
              <p className="font-head text-sm font-bold uppercase tracking-widest text-grey">
                In-Person - 1:1 &amp; Small Group
              </p>
              <p className="mt-3 font-body text-lg leading-relaxed text-ink/75">
                Skills, speed, movement quality, strength and conditioning -
                tailored to your goals.
              </p>
              <p className="mt-2 font-body text-sm text-ink/50">Groups of 4+.</p>

              <a
                href="#contact"
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 font-head text-sm font-bold uppercase tracking-wide text-ink transition-all duration-300 hover:bg-ink hover:text-paper"
              >
                Enquire directly
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {IN_PERSON.map((option) => (
                <div
                  key={option.label}
                  className="flex flex-col items-center rounded-xl border border-ink/10 px-4 py-5 text-center transition-colors duration-300 hover:border-navy/40 md:px-6"
                >
                  <span className="font-head text-2xl font-bold text-ink md:text-3xl">
                    {"$" + option.price}
                  </span>
                  <span className="mt-1 font-body text-xs text-ink/50">per hour</span>
                  <span className="mt-3 font-head text-[11px] font-bold uppercase tracking-widest text-grey">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}