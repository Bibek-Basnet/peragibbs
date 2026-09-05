"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  X,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Barbell,
  PersonSimpleRun,
  Football,
  Target,
  Envelope,
  Phone,
} from "@phosphor-icons/react";

export type GuideInfo = {
  tag: string;
  title: string;
  href: string;
  slug: "team-sport" | "runner";
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: "athlete" | "parent" | "";
  interest: string;
  consent: boolean;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  interest: "",
  consent: false,
};

const INTERESTS = [
  { label: "Rugby", icon: Football },
  { label: "Netball", icon: Target },
  { label: "Running", icon: PersonSimpleRun },
  { label: "General S&C", icon: Barbell },
];

const STEP_META = [
  { title: "Who's this for?", subtitle: "So Pera knows who he's talking to." },
  {
    title: "What's the focus?",
    subtitle: "Helps tailor advice when he follows up.",
  },
  {
    title: "Almost there.",
    subtitle: "One click and your guide is on its way.",
  },
];

export default function LeadCaptureModal({
  guide,
  onClose,
}: {
  guide: GuideInfo | null;
  onClose: () => void;
}) {
  const isOpen = guide !== null;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setForm(INITIAL_STATE);
      setStatus("idle");
    }
  }, [isOpen, guide?.slug]);

  useGSAP(
    () => {
      if (!backdropRef.current || !panelRef.current) return;
      if (isOpen) {
        document.body.style.overflow = "hidden";
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        );
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
        );
      } else {
        document.body.style.overflow = "";
      }
    },
    { dependencies: [isOpen] },
  );

  useGSAP(
    () => {
      if (!stepRef.current) return;
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" },
      );
    },
    { dependencies: [step] },
  );

  if (!isOpen || !guide) return null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 3));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!guide) return;
    setStatus("submitting");
    try {
      // --- BACKEND HAND-OFF ---
      // Replace with the real endpoint. Payload includes guideSlug so the
      // admin panel can filter/export by which guide (team-sport | runner)
      // each lead downloaded.
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guideSlug: guide.slug,
          guideTitle: guide.title,
          submittedAt: new Date().toISOString(),
        }),
      });

      setStatus("done");

      const link = document.createElement("a");
      link.href = guide.href;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setStatus("error");
    }
  }

  const step1Valid =
    form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email);
  const step2Valid = form.role !== "" && form.interest !== "";
  const meta = STEP_META[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-paper/10 bg-panel shadow-2xl shadow-ink/40"
      >
        <div className="h-1 w-full bg-paper/10">
          <div
            className="h-full bg-navy transition-all duration-500 ease-out"
            style={{
              width: status === "done" ? "100%" : `${(step / 3) * 100}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 text-paper/50 transition-colors hover:text-paper"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="px-7 pb-8 pt-8 md:px-10 md:pb-10">
          {status === "done" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/15">
                <CheckCircle size={36} weight="fill" className="text-navy" />
              </div>
              <p className="mt-6 font-head text-2xl font-semibold uppercase tracking-tight text-paper">
                You&rsquo;re all set.
              </p>
              <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-paper/60">
                Your guide is downloading now. Pera may reach out personally to
                see how your training&rsquo;s going - keep an eye on your inbox.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 rounded-full bg-navy px-8 py-3.5 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-transform hover:scale-[1.03]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                <p className="font-head text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
                  {guide.tag}
                </p>
              </div>

              <h2 className="mt-3 font-head text-2xl font-semibold uppercase leading-tight tracking-tight text-paper md:text-3xl">
                {meta.title}
              </h2>
              <p className="mt-1.5 font-body text-sm text-paper/55">
                {meta.subtitle}
              </p>

              <div ref={stepRef} className="mt-8">
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <IconField
                      icon={User}
                      label="Full name"
                      value={form.name}
                      onChange={(v) => update("name", v)}
                      placeholder="Your name"
                    />
                    <IconField
                      icon={Envelope}
                      label="Email address"
                      type="email"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      placeholder="you@email.com"
                    />
                    <IconField
                      icon={Phone}
                      label="Phone / WhatsApp (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                      placeholder="+64..."
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-7">
                    <div>
                      <p className="mb-3 font-head text-xs font-semibold uppercase tracking-widest text-paper/50">
                        I&rsquo;m reaching out as
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {(["athlete", "parent"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => update("role", option)}
                            className={`rounded-xl border-2 px-4 py-3.5 text-center font-body text-sm capitalize transition-all ${
                              form.role === option
                                ? "border-navy bg-navy/15 text-paper"
                                : "border-paper/10 text-paper/60 hover:border-paper/25"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 font-head text-xs font-semibold uppercase tracking-widest text-paper/50">
                        Primary interest
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {INTERESTS.map(({ label, icon: Icon }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => update("interest", label)}
                            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-body text-sm transition-all ${
                              form.interest === label
                                ? "border-navy bg-navy/15 text-paper"
                                : "border-paper/10 text-paper/60 hover:border-paper/25"
                            }`}
                          >
                            <Icon
                              size={20}
                              weight={
                                form.interest === label ? "fill" : "light"
                              }
                              className={
                                form.interest === label
                                  ? "text-navy"
                                  : "text-paper/40"
                              }
                            />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-paper/10 bg-ink p-5">
                      <SummaryItem label="Name" value={form.name} />
                      <SummaryItem label="Email" value={form.email} truncate />
                      <SummaryItem label="Role" value={form.role} capitalize />
                      <SummaryItem label="Interest" value={form.interest} />
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-paper/10 p-4 transition-colors hover:border-paper/25">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-paper/30 bg-transparent accent-navy"
                      />
                      <span className="font-body text-sm leading-relaxed text-paper/70">
                        I&rsquo;ve read and agree to the{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy underline underline-offset-2 hover:text-paper"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    {status === "error" && (
                      <p className="font-body text-sm text-red-400">
                        Something went wrong - please try again.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-wide text-paper/50 transition-colors hover:text-paper"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Back
                  </button>
                ) : (
                  <span className="font-body text-xs text-paper/30">
                    Step {step} of 3
                  </span>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={step === 1 ? !step1Valid : !step2Valid}
                    className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-all enabled:hover:scale-[1.03] disabled:opacity-30"
                  >
                    Continue
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-enabled:group-hover:translate-x-0.5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!form.consent || status === "submitting"}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 font-head text-sm font-semibold uppercase tracking-wide text-paper transition-all enabled:hover:scale-[1.03] disabled:opacity-30"
                  >
                    {status === "submitting" ? "Submitting..." : "Get my guide"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IconField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-head text-xs font-semibold uppercase tracking-widest text-paper/50">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          weight="light"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper/35"
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-paper/15 bg-ink py-3.5 pl-11 pr-4 font-body text-base text-paper placeholder:text-paper/30 transition-colors focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10"
        />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  truncate,
  capitalize,
}: {
  label: string;
  value: string;
  truncate?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div>
      <p className="font-head text-[10px] font-semibold uppercase tracking-widest text-paper/40">
        {label}
      </p>
      <p
        className={`mt-1 font-body text-sm text-paper ${truncate ? "truncate" : ""} ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
