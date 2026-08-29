"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FAQS = [
  {
    question: "What's the minimum commitment for online coaching?",
    answer:
      "Online coaching runs on a 12-week minimum commitment, then moves to a rolling monthly subscription that you can cancel any time.",
  },
  {
    question: "Can I pay monthly instead of upfront?",
    answer:
      "Yes — both options are available. You can pay weekly on a rolling basis, or pay the full 12-week block upfront.",
  },
  {
    question: "What's the difference between the coaching tiers?",
    answer:
      "Foundation is single-discipline, self-managed programming. Intermediate combines strength and conditioning into one balanced block. Advanced is fully tailored with weekly check-ins and adjustments — the most hands-on option.",
  },
  {
    question: "Do you offer in-person sessions as well as online?",
    answer:
      "Yes — 1:1 and small group in-person sessions are available from $150/hour, covering skills, speed, movement quality, strength and conditioning. Groups of 4 or more can enquire directly for group rates.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "You'll fill out a short application, then we'll organise an onboarding call to map your goals and confirm the right tier before your program starts.",
  },
  {
    question: "Can my program change if my goals or schedule change?",
    answer:
      "On the Advanced tier, yes — programming is adjusted weekly based on check-ins. On Foundation and Intermediate, the block is structured at the start; if your goals shift significantly, you can move tiers between blocks.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!answerRef.current || !innerRef.current) return;

    if (isOpen) {
      const height = innerRef.current.scrollHeight;
      gsap.to(answerRef.current, {
        height,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => gsap.set(answerRef.current, { height: "auto" }),
      });
      gsap.to(iconRef.current, { rotate: 45, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(answerRef.current, {
        height: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
      gsap.to(iconRef.current, { rotate: 0, duration: 0.35, ease: "power2.out" });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-ink/10 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
      >
        <span className="font-head text-lg font-semibold text-ink md:text-xl">
          {item.question}
        </span>
        <span
          ref={iconRef}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink"
        >
          <Plus size={16} weight="bold" />
        </span>
      </button>

      <div ref={answerRef} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={innerRef} className="pb-6 md:pb-7">
          <p className="max-w-2xl font-body text-base leading-relaxed text-ink/65">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section id="faq" ref={sectionRef} className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-16">
        <div>
          <p
            ref={eyebrowRef}
            className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-grey"
          >
            FAQ
          </p>
          <h2
            ref={headingRef}
            className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-ink md:text-5xl"
          >
            Questions, <span className="text-ember">answered.</span>
          </h2>
        </div>

        <div className="mt-14 border-t border-ink/10 md:mt-16">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}