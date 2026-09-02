"use client";

import Image from "next/image";
import { Quotes } from "@phosphor-icons/react";
import type { Testimonial } from "@/data/testimonials";

export default function TestimonialCard({
  testimonial,
  className = "",
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  const t = testimonial;
  return (
    <div
      className={`flex flex-col rounded-2xl border border-paper/10 bg-panel sm:flex-row sm:overflow-hidden ${className}`}
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-t-2xl sm:h-auto sm:w-[42%] sm:rounded-none">
        <Image
          src={t.photo}
          alt={t.name}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="object-cover"
          style={{ objectPosition: t.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
      </div>

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
          <p className="mt-1 font-body text-xs text-paper/50">{t.role}</p>
        </div>
      </div>
    </div>
  );
}