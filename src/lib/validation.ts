import { z } from "zod";

const trimmed = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null));

export const enquiryRoleSchema = z.enum(["ATHLETE", "PARENT", "OTHER"]);

// ---------------------------------------------------------------------------
// Public forms
// ---------------------------------------------------------------------------

/** Programme Guide lead capture modal. */
export const guideLeadSchema = z.object({
  name: trimmed(2, 120),
  email: z.email().max(200),
  phone: optionalText(60),
  role: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(enquiryRoleSchema),
  interest: trimmed(1, 80),
  consent: z.boolean(),
  guideSlug: trimmed(1, 120),
  guideTitle: optionalText(200),
  // Honeypot: real users never fill this in.
  company: z.string().max(200).optional(),
});

export type GuideLeadInput = z.infer<typeof guideLeadSchema>;

/** Main contact form. */
export const contactSchema = z.object({
  name: trimmed(2, 120),
  email: z.email().max(200),
  phone: optionalText(60),
  role: z
    .string()
    .trim()
    .transform((v) => (v ? v.toUpperCase() : ""))
    .pipe(z.union([enquiryRoleSchema, z.literal("")]))
    .transform((v) => (v === "" ? null : v)),
  message: trimmed(5, 5000),
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Admin form helpers
// ---------------------------------------------------------------------------

/** Checkboxes arrive as "on" or are absent entirely. */
export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("false"), z.null()])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const intField = (fallback = 0) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => {
      if (!v) return fallback;
      const n = Number.parseInt(v, 10);
      return Number.isFinite(n) ? n : fallback;
    });

export const nullableIntField = z
  .string()
  .trim()
  .optional()
  .transform((v) => {
    if (!v) return null;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  });

/** Textarea with one item per line, blank lines dropped. */
export const linesField = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

export const slugField = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only.",
  );

// ---------------------------------------------------------------------------
// Admin entity schemas
// ---------------------------------------------------------------------------

export const tierTreatmentSchema = z.enum([
  "DARK",
  "LIGHT_ACCENT",
  "DARK_ACCENT",
]);

export const coachingTierSchema = z.object({
  name: trimmed(1, 80),
  slug: slugField,
  price: intField(0),
  fee: trimmed(1, 160),
  tagline: trimmed(1, 200),
  features: linesField,
  bestFor: trimmed(1, 600),
  treatment: tierTreatmentSchema,
  badge: optionalText(60),
  spotsLeft: nullableIntField,
  spotsLabel: optionalText(80),
  ctaLabel: trimmed(1, 60),
  ctaHref: trimmed(1, 500),
  isRecommended: checkbox,
  sortOrder: intField(0),
  isActive: checkbox,
});

export const servicesSectionSchema = z.object({
  eyebrow: trimmed(1, 120),
  heading: trimmed(1, 200),
  weeklyLabel: trimmed(1, 60),
  upfrontLabel: trimmed(1, 60),
  weeklyNote: trimmed(1, 400),
  upfrontNote: trimmed(1, 400),
  upfrontDiscount: intField(0),
  upfrontWeeks: intField(12),
  compareOpenLabel: trimmed(1, 120),
  compareOpenSub: trimmed(1, 200),
  compareCloseLabel: trimmed(1, 120),
  compareCloseSub: trimmed(1, 200),
  inPersonTitle: trimmed(1, 160),
  inPersonDescription: trimmed(1, 600),
  inPersonNote: trimmed(0, 200),
  inPersonCtaLabel: trimmed(1, 60),
  inPersonCtaHref: trimmed(1, 500),
});

export const serviceStepSchema = z.object({
  title: trimmed(1, 120),
  description: trimmed(1, 600),
  sortOrder: intField(0),
  isActive: checkbox,
});

export const compareGroupSchema = z.object({
  title: trimmed(1, 120),
  sortOrder: intField(0),
});

export const compareRowSchema = z.object({
  groupId: trimmed(1, 60),
  label: trimmed(1, 160),
  sortOrder: intField(0),
});

export const inPersonOptionSchema = z.object({
  label: trimmed(1, 80),
  price: trimmed(1, 20),
  unit: trimmed(1, 40),
  sortOrder: intField(0),
  isActive: checkbox,
});

export const skillsSectionSchema = z.object({
  eyebrow: trimmed(1, 120),
  heading: trimmed(1, 200),
});

export const skillSchema = z.object({
  tag: trimmed(1, 60),
  title: trimmed(1, 160),
  description: trimmed(1, 800),
  sortOrder: intField(0),
  isActive: checkbox,
});

export const skillHighlightSchema = z.object({
  skillId: trimmed(1, 60),
  title: trimmed(1, 160),
  detail: trimmed(1, 800),
  badge: optionalText(60),
  sortOrder: intField(0),
});

export const testimonialsSectionSchema = z.object({
  eyebrow: trimmed(1, 120),
  heading: trimmed(1, 200),
  viewAllLabel: trimmed(1, 60),
  pageEyebrow: trimmed(1, 120),
  pageHeading: trimmed(1, 200),
});

export const testimonialSchema = z.object({
  name: trimmed(1, 120),
  role: trimmed(1, 160),
  quote: trimmed(1, 2000),
  photoUrl: trimmed(1, 500),
  photoPosition: trimmed(1, 40),
  isPinned: checkbox,
  isPublished: checkbox,
  sortOrder: intField(0),
});

export const guidesSectionSchema = z.object({
  eyebrow: trimmed(1, 120),
  heading: trimmed(1, 200),
});

export const guideSchema = z.object({
  slug: slugField,
  tag: trimmed(1, 80),
  title: trimmed(1, 200),
  description: trimmed(1, 1500),
  fileUrl: trimmed(1, 500),
  imageUrl: trimmed(1, 500),
  imagePosition: trimmed(1, 40),
  ctaLabel: trimmed(1, 60),
  sortOrder: intField(0),
  isActive: checkbox,
});

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "CONVERTED",
  "ARCHIVED",
]);

export const messageStatusSchema = z.enum([
  "NEW",
  "READ",
  "REPLIED",
  "ARCHIVED",
]);

export const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
});
