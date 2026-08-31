"use client";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export default function InstagramFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      // Process any Instagram embeds
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
      }
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll(
        'script[src="//www.instagram.com/embed.js"]'
      );
      scripts.forEach((s) => s.remove());
    };
  }, []);

  // Instagram post URLs - replace these with your client's actual post URLs
  const posts = [
    "https://www.instagram.com/p/DVrhEyZkgDC/?img_index=1",
    "https://www.instagram.com/p/DROR7k2EgpA/",
    "https://www.instagram.com/p/DajowasgvFy/",
    "https://www.instagram.com/p/DcH_cEOAncN/",
    "https://www.instagram.com/p/DcaX6u_g8Sy/",
    "https://www.instagram.com/p/Dch_-80Ajt1/",
  ];

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-16">
        <p className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-paper/50">
          Instagram
        </p>
        <h2 className="font-head text-4xl font-semibold uppercase leading-[0.95] tracking-tightest text-paper md:text-5xl">
          Follow the <span className="text-navy">journey.</span>
        </h2>

        <div ref={containerRef} className="relative mt-14 md:mt-16">
          {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-paper/10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-ember/20 border-t-ember" />
            </div>
          )}

          <div 
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${isLoading ? 'hidden' : ''}`}
          >
            {posts.map((postUrl, index) => (
              <div 
                key={index}
                className="overflow-hidden rounded-2xl border border-paper/10 bg-paper/5 transition-transform hover:scale-[1.02]"
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={postUrl}
                  data-instgrm-version="14"
                  style={{
                    background: 'transparent',
                    border: 0,
                    borderRadius: '12px',
                    margin: 0,
                    maxWidth: '100%',
                    minWidth: 'auto',
                    padding: 0,
                    width: '100%',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <InstagramButton href="https://www.instagram.com/peragibbs_mvmt/" />
        </div>
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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ig-gradient-feed" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED576" />
          <stop offset="25%" stopColor="#F47133" />
          <stop offset="50%" stopColor="#BC3081" />
          <stop offset="75%" stopColor="#4C63D2" />
          <stop offset="100%" stopColor="#4C63D2" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ig-gradient-feed)"
        d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.9-.421-.419-.69-.824-.9-1.38-.165-.42-.36-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.06-1.17.255-1.814.42-2.235.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"
      />
    </svg>
  );
}