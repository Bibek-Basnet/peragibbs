"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund & Cancellation", href: "/refund-and-cancellation" },
];

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr] md:gap-8">
          
          <div>
            <Link href="/" className="relative block h-8 w-32 md:h-9 md:w-36">
              <Image
                src="/logo.png"
                alt="Pera Gibbs Movement"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-paper/60">
              Strength &amp; conditioning and rugby skills coaching for youth
              athletes ready to perform at the next level.
            </p>

            <Link
             href="https://form.jotform.com/261601330383043"
  target="_blank"
  rel="noreferrer"
              className="mt-6 inline-block rounded-full border border-paper/30 px-6 py-2.5 font-head text-[13px] font-medium uppercase tracking-wide text-paper transition-colors duration-300 hover:border-ember hover:bg-navy hover:text-ink"
            >
              Apply Now
            </Link>
          </div>

          <div>
            <p className="mb-5 font-head text-xs font-semibold uppercase tracking-widest text-paper/40">
              Navigate
            </p>
            <ul className="space-y-3 font-head text-[15px] font-medium">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-head text-xs font-semibold uppercase tracking-widest text-paper/40">
              Get in touch
            </p>
            <ul className="space-y-3 font-body text-[15px] text-paper/75">
              <li>
                <a
                  href="mailto:admin@peragibbsmovement.com"
                  className="transition-colors duration-300 hover:text-navy"
                >
                  admin@peragibbsmovement.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/64220470407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-navy"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="mailto:admin@peragibbsmovement.com" label="Email">
                <MailIcon />
              </SocialIcon>
              <SocialIcon href="https://wa.me/64220470407" label="WhatsApp">
                <WhatsAppIcon />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/peragibbs_mvmt/" label="Instagram">
                <InstagramIcon />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/10 pt-6 font-body text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Pera Gibbs Movement. All rights reserved.</p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-300 hover:text-navy"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-block py-0.5 text-paper/75 transition-colors duration-300 hover:text-navy"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-navy transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/75 transition-colors hover:border-ember hover:text-navy"
    >
      {children}
    </a>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm5.83 14.16c-.25.7-1.23 1.28-2.01 1.44-.53.11-1.23.2-3.58-.77-3.01-1.24-4.95-4.29-5.1-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.75-2.17 1.02-2.47.27-.3.58-.37.78-.37.19 0 .39 0 .55.01.18.01.42-.07.65.5.25.6.86 2.06.93 2.21.07.15.12.32.02.52-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.29.29-.12.57.16.28.72 1.19 1.55 1.92 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.61-.07.16-.2.7-.81.89-1.09.19-.28.37-.23.62-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.32.07.12.07.66-.18 1.36Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.9-.421-.419-.69-.824-.9-1.38-.165-.42-.36-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.06-1.17.255-1.814.42-2.235.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z" />
    </svg>
  );
}