"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const background = useTransform(
    scrollY,
    [0, 120],
    ["rgba(10,10,10,0)", "rgba(10,10,10,0.92)"]
  );
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, 120], [0, 12]);
  const blurFilter = useTransform(backdropBlur, (v) => `blur(${v}px)`);

  useGSAP(() => {
    if (!headerRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.15,
    });

    tl.fromTo(
      headerRef.current,
      { yPercent: -100 },
      { yPercent: 0, duration: 0.7, ease: "power4.out" }
    );

    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.35"
      );
    }

    if (linksRef.current) {
      tl.fromTo(
        linksRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
        "-=0.3"
      );
    }

    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.3"
      );
    }
  }, []);

  return (
    <>
      <motion.header
        ref={headerRef}
        style={{
          backgroundColor: background,
          backdropFilter: blurFilter,
          WebkitBackdropFilter: blurFilter,
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Always-on scrim so nav stays legible before the scroll-triggered
            solid background kicks in, regardless of what's behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 100%)",
          }}
        />

        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute inset-x-0 bottom-0 h-px bg-paper/10"
        />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            ref={logoRef}
            href="/"
            className="relative z-50 h-8 w-32 shrink-0 md:h-9 md:w-36"
          >
            <Image
              src="/logo.png"
              alt="Pera Gibbs Movement"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          <ul
            ref={linksRef}
            className="hidden items-center gap-9 font-head text-[16px] font-medium text-paper md:flex"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>

          <Link
            ref={ctaRef}
            href="#apply"
            className="hidden rounded-full border border-paper/30 px-6 py-2.5 font-head text-[15px] font-medium uppercase tracking-wide text-paper transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-ink md:inline-block"
          >
            Apply Now
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="group relative z-50 flex h-8 w-8 flex-col items-end justify-center gap-[7px] md:hidden"
          >
            <span
              className={`h-px bg-paper transition-all duration-300 ease-out group-hover:bg-navy ${
                isMenuOpen ? "w-6 translate-y-[4px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-paper transition-all duration-300 ease-out group-hover:bg-navy ${
                isMenuOpen ? "w-6 -translate-y-[4px] -rotate-45" : "w-4"
              }`}
            />
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative py-1 text-paper/75 transition-colors duration-300 hover:text-navy"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-navy transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
    </Link>
  );
}