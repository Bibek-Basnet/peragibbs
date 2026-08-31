import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-widest text-grey transition-colors hover:text-navy"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to home
        </Link>

        <h1 className="mt-8 font-head text-4xl font-semibold uppercase leading-[1.05] tracking-tightest text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 font-body text-sm text-grey">
          Effective date: {effectiveDate}
        </p>

        <div className="mt-12 border-t border-ink/10 pt-12">
          <article className="legal-prose">{children}</article>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-8">
          <p className="font-body text-sm text-grey">
            Questions about this document? Contact{" "}
            <a
              href="mailto:admin@peragibbsmovement.com"
              className="font-semibold text-ink underline underline-offset-2 hover:text-navy"
            >
              admin@peragibbsmovement.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}