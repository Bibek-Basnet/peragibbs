"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = [
  { src: "/gallery/gallery1.jpg" },
  { src: "/gallery/gallery2.jpg" },
  { src: "/gallery/gallery3.jpg" },
  { src: "/gallery/gallery4.jpg" },
  { src: "/gallery/gallery5.jpg" },
  { src: "/gallery/gallery6.jpg" },
  { src: "/gallery/gallery7.jpg" },
  { src: "/gallery/gallery8.jpg" },
  { src: "/gallery/gallery9.jpg" },
  { src: "/gallery/gallery10.jpg" },
];

// Slower overall cycle + slower crossfade
const SLIDE_DURATION = 7; // seconds each slide holds
const FADE_DURATION = 2.2; // seconds for the crossfade itself

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const currentIndex = useRef(0);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
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

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
      });
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    const advance = () => {
      const slides = slideRefs.current;
      const total = slides.length;
      const current = currentIndex.current;
      const next = (current + 1) % total;

      const currentSlide = slides[current];
      const nextSlide = slides[next];
      if (!currentSlide || !nextSlide) return;

      gsap.set(nextSlide, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(currentSlide, { opacity: 0, duration: FADE_DURATION, ease: "power2.inOut" }, 0)
        .to(nextSlide, { opacity: 1, duration: FADE_DURATION, ease: "power2.inOut" }, 0);

      currentIndex.current = next;
    };

    const interval = setInterval(advance, SLIDE_DURATION * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              ref={eyebrowRef}
              className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-paper/50"
            >
              Gallery
            </p>
            <h2
              ref={headingRef}
              className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-paper md:text-5xl"
            >
              Moments from <span className="text-ember">the field.</span>
            </h2>
          </div>

          <InstagramButton href="https://www.instagram.com/peragibbs_mvmt/" />
        </div>
      </div>

      <div className="relative mt-12 h-[75vh] w-full overflow-hidden bg-black md:mt-16 md:h-[85vh]">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            {/* Blurred cover backdrop - fills the full-bleed frame edge to edge
                so there's never letterboxing, regardless of the source photo's
                orientation or aspect ratio. */}
            <Image
              src={img.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="scale-110 object-cover opacity-70 blur-2xl"
            />

            {/* Actual photo - object-contain so portrait and landscape shots
                both display in full, uncropped, centered in the frame. */}
            <Image
              src={img.src}
              alt={`Pera Gibbs coaching gallery photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/40 via-transparent to-ink/10" />
      </div>
    </section>
  );
}

function InstagramButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-5 py-2.5 font-head text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:border-paper/40 hover:bg-paper/10"
    >
      <InstagramIcon className="h-4 w-4" />
      Follow along
    </a>
  );
}

// Official Simple Icons Instagram glyph + brand gradient, so it reads as the
// real logo rather than a generic outline icon.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED576" />
          <stop offset="25%" stopColor="#F47133" />
          <stop offset="50%" stopColor="#BC3081" />
          <stop offset="75%" stopColor="#4C63D2" />
          <stop offset="100%" stopColor="#4C63D2" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ig-gradient)"
        d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.9-.421-.419-.69-.824-.9-1.38-.165-.42-.36-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.06-1.17.255-1.814.42-2.235.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"
      />
    </svg>
  );
}