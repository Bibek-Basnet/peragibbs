"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X, InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react";

const NAV_LINKS = [
  { index: "01", label: "About", href: "#about" },
  { index: "02", label: "Services", href: "#services" },
  { index: "03", label: "Skills", href: "#skills" },
  { index: "04", label: "Testimonials", href: "#testimonials" },
  { index: "05", label: "Contact", href: "#contact" },
];

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Set up the timeline once
  useGSAP(() => {
    if (!panelRef.current || !backdropRef.current) return;

    const tl = gsap.timeline({ paused: true });
    
    // Remove the hidden class and set initial display states
    tl.set(backdropRef.current, { 
      display: "block", 
      opacity: 0 
    })
    .set(panelRef.current, { 
      display: "flex", 
      xPercent: 100 
    })
    .to(backdropRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(panelRef.current, {
      xPercent: 0,
      duration: 0.55,
      ease: "power4.out"
    }, "<")
    .fromTo(
      linksRef.current?.children ?? [],
      { x: 24, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" },
      "-=0.3"
    )
    .to(footerRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

    tlRef.current = tl;

    // Ensure elements start hidden
    gsap.set(backdropRef.current, { display: "none", opacity: 0 });
    gsap.set(panelRef.current, { display: "none", xPercent: 100 });

    return () => {
      tl.kill();
    };
  }, []);

  // Control the timeline based on isOpen
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset and play forward
      tl.play();
    } else {
      document.body.style.overflow = "";
      // Reverse the animation
      tl.reverse();
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm md:hidden"
        // Remove style={{ opacity: 0 }} - GSAP handles this
      />

      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm flex-col bg-ink md:hidden"
        // Remove style={{ transform: "translateX(100%)" }} - GSAP handles this
      >
        <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5">
          <span className="font-head text-xs font-semibold tracking-widest text-grey">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-paper"
          >
            <X size={22} weight="light" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-8 pt-2">
          <div ref={linksRef} className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between border-b border-paper/10 py-5 transition-colors duration-200 active:bg-paper/5"
              >
                <span className="font-body text-xl text-paper">
                  {link.label}
                </span>
                <span className="font-head text-xs text-grey">
                  {link.index}
                </span>
              </Link>
            ))}
          </div>

          <div
            ref={footerRef}
            className="mt-8 flex flex-col gap-6 border-t border-paper/10 pt-6"
            style={{ opacity: 0 }} // Start hidden
          >
            <Link
  href="https://form.jotform.com/261601330383043"
  target="_blank"
  rel="noreferrer"
  onClick={onClose}
  className="flex items-center justify-center rounded-full border border-paper bg-paper py-4 font-head text-[15px] font-semibold uppercase tracking-wide text-ink"
>
  Apply Now
</Link>

            <div className="flex items-center justify-between">
              <a
                href="mailto:admin@peragibbsmovement.com"
                className="flex items-center gap-2 font-head text-xs text-grey"
              >
                <EnvelopeSimple size={16} weight="light" />
                Email
              </a>
              <a
                href="https://www.instagram.com/peragibbs_mvmt/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 font-head text-xs text-grey"
              >
                <InstagramLogo size={16} weight="light" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}