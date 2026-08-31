import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { TESTIMONIALS } from "@/data/testimonials";
import TestimonialCard from "@/components/testimonials/TestimonialCard";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from the athletes and teams Pera Gibbs has coached — from Black Ferns Sevens and All Blacks to club and youth level athletes.",
};

export default function TestimonialsPage() {
  return (
    <main className="bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:text-navy"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to home
        </Link>

        <p className="mb-4 mt-8 font-head text-xs font-semibold uppercase tracking-widest text-ink">
          Testimonials
        </p>
        <h1 className="max-w-2xl font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-ink md:text-5xl">
          <span className="text-navy"> What athletes say.</span>
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              testimonial={t}
              className="h-[420px] w-full md:h-[460px]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}