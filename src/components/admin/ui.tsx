import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";

/** Shape every admin server action resolves to. */
export type ActionState = {
  ok: boolean;
  message: string;
  /** Unique per result, so a repeated message still remounts a reset form. */
  token?: string;
} | null;

export const initialActionState: ActionState = null;

export type IconType = ComponentType<{
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}>;

const inputBase =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 font-ui text-sm text-ink shadow-[0_1px_2px_rgba(15,17,21,0.04)] transition-colors placeholder:text-grey/60 focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10 disabled:bg-canvas";

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(15,17,21,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  icon: Icon,
  title,
  description,
  count,
  actions,
}: {
  icon?: IconType;
  title: string;
  description?: string;
  count?: number;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
            <Icon size={17} weight="bold" />
          </span>
        ) : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-ui text-base font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {typeof count === "number" ? (
              <span className="rounded-full bg-canvas px-2 py-0.5 font-ui text-xs font-semibold tabular-nums text-grey">
                {count}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 max-w-2xl font-ui text-sm leading-relaxed text-grey">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-5 md:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
}: {
  icon?: IconType;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        {Icon ? (
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-paper md:flex">
            <Icon size={21} weight="bold" />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="mb-1 font-ui text-xs font-semibold uppercase tracking-[0.14em] text-navy">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-ui text-2xl font-semibold tracking-tight text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl font-ui text-sm leading-relaxed text-grey">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Tabs - URL driven, so a save keeps you on the same tab
// ---------------------------------------------------------------------------

export type TabItem = {
  key: string;
  label: string;
  icon: IconType;
  count?: number;
};

export function Tabs({
  items,
  active,
  basePath,
}: {
  items: TabItem[];
  active: string;
  basePath: string;
}) {
  return (
    <nav
      aria-label="Section"
      className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1 shadow-[0_1px_2px_rgba(15,17,21,0.04)]"
    >
      {items.map((item) => {
        const isActive = item.key === active;
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={
              item.key === items[0]?.key
                ? basePath
                : `${basePath}?tab=${item.key}`
            }
            aria-current={isActive ? "page" : undefined}
            className={
              "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 font-ui text-sm font-medium transition-colors " +
              (isActive
                ? "bg-ink text-paper"
                : "text-grey hover:bg-canvas hover:text-ink")
            }
          >
            <Icon size={16} weight={isActive ? "fill" : "regular"} />
            {item.label}
            {typeof item.count === "number" ? (
              <span
                className={
                  "rounded-full px-1.5 py-0.5 font-ui text-[11px] font-semibold tabular-nums " +
                  (isActive ? "bg-paper/20 text-paper" : "bg-canvas text-grey")
                }
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Form controls
// ---------------------------------------------------------------------------

export function Field({
  label,
  name,
  hint,
  children,
  className = "",
}: {
  label: string;
  name?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block font-ui text-[13px] font-medium text-ink"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1.5 font-ui text-xs leading-relaxed text-grey">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputBase} ${className}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className = "", ...rest } = props;
  return (
    <textarea {...rest} className={`${inputBase} resize-y ${className}`} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <select {...rest} className={`${inputBase} pr-8 ${className}`}>
      {children}
    </select>
  );
}

/**
 * Vertical framing for a photo, in words rather than CSS. The values are
 * object-position strings; the labels describe what the viewer ends up seeing.
 */
export const PHOTO_POSITIONS = [
  { value: "50% 0%", label: "Top of the photo" },
  { value: "50% 15%", label: "Head and shoulders" },
  { value: "50% 20%", label: "Head and shoulders (lower)" },
  { value: "50% 30%", label: "Upper body" },
  { value: "50% 50%", label: "Centre" },
  { value: "50% 70%", label: "Lower body" },
  { value: "50% 100%", label: "Bottom of the photo" },
];

export function PositionSelect({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  // Keep any hand-entered value working rather than silently resetting it.
  const known = PHOTO_POSITIONS.some((p) => p.value === defaultValue);
  return (
    <Select name={name} defaultValue={defaultValue}>
      {PHOTO_POSITIONS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
      {known ? null : (
        <option value={defaultValue}>Custom ({defaultValue})</option>
      )}
    </Select>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-3.5 py-3 transition-colors hover:border-navy/40 hover:bg-navy/[0.02]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-navy"
      />
      <span className="min-w-0">
        <span className="block font-ui text-sm font-medium text-ink">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block font-ui text-xs leading-relaxed text-grey">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Buttons & indicators
// ---------------------------------------------------------------------------

type ButtonTone = "primary" | "secondary" | "danger" | "ghost";

const toneClass: Record<ButtonTone, string> = {
  primary:
    "bg-ink text-paper hover:bg-navy disabled:opacity-45 disabled:hover:bg-ink",
  secondary:
    "border border-line bg-white text-ink hover:border-navy hover:text-navy disabled:opacity-45",
  danger:
    "border border-red-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50 disabled:opacity-45",
  ghost: "text-grey hover:bg-canvas hover:text-ink disabled:opacity-45",
};

export function buttonClass(tone: ButtonTone = "primary") {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 font-ui text-sm font-medium transition-colors ${toneClass[tone]}`;
}

export function LinkButton({
  href,
  icon: Icon,
  children,
  tone = "secondary",
  external,
}: {
  href: string;
  icon?: IconType;
  children: ReactNode;
  tone?: ButtonTone;
  external?: boolean;
}) {
  const content = (
    <>
      {Icon ? <Icon size={16} weight="bold" /> : null}
      {children}
    </>
  );

  if (external) {
    return (
      <a href={href} className={buttonClass(tone)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(tone)}>
      {content}
    </Link>
  );
}

export function Badge({
  children,
  tone = "neutral",
  icon: Icon,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  icon?: IconType;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-canvas text-grey ring-1 ring-inset ring-line",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
    info: "bg-navy/10 text-navy ring-1 ring-inset ring-navy/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-ui text-[11px] font-semibold ${tones[tone]}`}
    >
      {Icon ? <Icon size={12} weight="bold" /> : null}
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon?: IconType;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-canvas/60 px-6 py-12 text-center">
      {Icon ? (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-grey ring-1 ring-line">
          <Icon size={20} weight="regular" />
        </span>
      ) : null}
      {title ? (
        <p className="font-ui text-sm font-semibold text-ink">{title}</p>
      ) : null}
      {children ? (
        <p className="mt-1 max-w-sm font-ui text-sm text-grey">{children}</p>
      ) : null}
    </div>
  );
}

/**
 * Disclosure block for one record in a list. Native details/summary, so it
 * works without client JavaScript and keeps long lists scannable.
 */
export function Collapsible({
  title,
  subtitle,
  meta,
  leading,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  leading?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      {...(defaultOpen ? { open: true } : {})}
      className="group overflow-hidden rounded-xl border border-line bg-white transition-colors [&[open]]:border-navy/30 [&[open]]:shadow-[0_1px_3px_rgba(15,17,21,0.08)]"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3.5 transition-colors hover:bg-canvas/70 md:px-5">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-sm font-semibold text-ink">
              {title}
            </span>
            {meta}
          </div>
          {subtitle ? (
            <p className="mt-0.5 truncate font-ui text-xs text-grey">
              {subtitle}
            </p>
          ) : null}
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-grey transition-transform group-open:rotate-180 group-hover:bg-white group-hover:text-ink">
          <CaretDownIcon size={15} weight="bold" />
        </span>
      </summary>
      <div className="border-t border-line bg-canvas/40 px-4 py-5 md:px-5">
        {children}
      </div>
    </details>
  );
}

/** "Add new" disclosure, visually distinct from the record list above it. */
export function AddPanel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <details className="group mt-4 overflow-hidden rounded-xl border border-dashed border-navy/35 bg-navy/[0.03]">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3.5 font-ui text-sm font-semibold text-navy transition-colors hover:bg-navy/[0.06] md:px-5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy text-paper transition-transform group-open:rotate-45">
          <PlusIcon size={13} weight="bold" />
        </span>
        {label}
      </summary>
      <div className="border-t border-navy/20 bg-white px-4 py-5 md:px-5">
        {children}
      </div>
    </details>
  );
}
