"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Role = "athlete" | "parent" | "";

const STEPS = [
  { title: "Tell me about you", body: "A couple of details on where you're at and what you're chasing." },
  { title: "I'll follow up personally", body: "No forms disappearing into a queue - you'll hear from me directly." },
  { title: "We book your first call", body: "A quick chat to map out the right program before anything's signed." },
];

export default function ContactForm() {
  const [role, setRole] = useState<Role>("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      role,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
      setRole("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[0.85fr_1fr] md:gap-24 md:px-16">
        {/* Left: framing copy + how-it-works, fills the column naturally */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="mb-4 font-head text-xs font-semibold uppercase tracking-widest text-grey">
              Get in touch
            </p>
            <h2 className="font-head text-4xl font-semibold uppercase leading-[1] tracking-tightest text-ink md:text-[2.75rem]">
              Let&apos;s build<br /> <span className="text-navy">your program.</span>
            </h2>
            <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-grey">
              Tell me a bit about yourself and I&apos;ll follow up personally
              to talk through the right path - whether that&apos;s you as
              the athlete, or a parent getting things started.
            </p>

            <ol className="mt-10 space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 font-head text-xs font-semibold text-ink">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-head text-sm font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-grey">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex items-center gap-3 md:mt-0">
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

        {/* Right: the form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-ink/10 bg-white p-8 shadow-[0_1px_3px_rgba(10,10,10,0.06),0_12px_32px_-16px_rgba(10,10,10,0.15)] sm:p-10"
        >
          <fieldset>
            <legend className="mb-3 font-head text-xs font-semibold uppercase tracking-widest text-grey">
              I&apos;m reaching out as
            </legend>
            <div className="flex gap-3">
              {(["athlete", "parent"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  aria-pressed={role === option}
                  className={`rounded-full border px-5 py-2 font-body text-sm capitalize transition-colors ${
                    role === option
                      ? "border-navy bg-navy text-paper"
                      : "border-ink/15 text-ink hover:border-navy/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <FormField id="name" label="Full name" type="text" required />
          <FormField id="email" label="Email address" type="email" required />
          <FormField id="phone" label="Phone / WhatsApp" type="tel" />

          <div>
            <label
              htmlFor="message"
              className="mb-2 block font-head text-xs font-semibold uppercase tracking-widest text-grey"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="What are you looking to achieve?"
              className="w-full resize-none rounded-lg border border-ink/15 bg-paper/60 px-4 py-3 font-body text-base text-ink placeholder:text-grey/50 transition-colors focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10"
            />
          </div>

          <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-ink px-8 py-3.5 font-head text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-navy disabled:opacity-50 sm:w-auto"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>

            {status === "sent" && (
              <p className="font-body text-sm text-ink">
                Thanks - I&apos;ll be in touch shortly.
              </p>
            )}
            {status === "error" && (
              <p className="font-body text-sm text-navy">
                Something went wrong. Try WhatsApp instead?
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  type,
  required,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-head text-xs font-semibold uppercase tracking-widest text-grey"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full rounded-lg border border-ink/15 bg-paper/60 px-4 py-3 font-body text-base text-ink placeholder:text-grey/50 transition-colors focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10"
      />
    </div>
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-navy hover:text-navy"
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