import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  CompareCellKind,
  TierTreatment,
} from "@prisma/client";

// ---------------------------------------------------------------------------
// Shapes handed to the public client components. Kept plain and serialisable.
// ---------------------------------------------------------------------------

export type ServicesSectionCopy = {
  eyebrow: string;
  heading: string;
  weeklyLabel: string;
  upfrontLabel: string;
  weeklyNote: string;
  upfrontNote: string;
  upfrontDiscount: number;
  upfrontWeeks: number;
  compareOpenLabel: string;
  compareOpenSub: string;
  compareCloseLabel: string;
  compareCloseSub: string;
  inPersonTitle: string;
  inPersonDescription: string;
  inPersonNote: string;
  inPersonCtaLabel: string;
  inPersonCtaHref: string;
};

export type PublicTier = {
  id: string;
  name: string;
  price: number;
  fee: string;
  tagline: string;
  features: string[];
  bestFor: string;
  treatment: TierTreatment;
  badge: string | null;
  spotsLeft: number | null;
  spotsLabel: string | null;
  ctaLabel: string;
  ctaHref: string;
  isRecommended: boolean;
};

export type PublicStep = { id: string; title: string; description: string };

export type PublicCompareCell = { kind: CompareCellKind; text: string | null };

export type PublicCompareGroup = {
  id: string;
  title: string;
  rows: { id: string; label: string; cells: PublicCompareCell[] }[];
};

export type PublicInPersonOption = {
  id: string;
  label: string;
  price: string;
  unit: string;
};

export type ServicesData = {
  section: ServicesSectionCopy;
  tiers: PublicTier[];
  steps: PublicStep[];
  compareGroups: PublicCompareGroup[];
  inPerson: PublicInPersonOption[];
};

export type PublicSkill = {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlights: {
    id: string;
    title: string;
    detail: string;
    badge: string | null;
  }[];
};

export type SkillsData = {
  section: { eyebrow: string; heading: string };
  skills: PublicSkill[];
};

export type PublicTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  photoUrl: string;
  photoPosition: string;
};

export type TestimonialsData = {
  section: {
    eyebrow: string;
    heading: string;
    viewAllLabel: string;
    pageEyebrow: string;
    pageHeading: string;
  };
  testimonials: PublicTestimonial[];
};

export type PublicGuide = {
  id: string;
  slug: string;
  tag: string;
  title: string;
  description: string;
  fileUrl: string;
  imageUrl: string;
  imagePosition: string;
  ctaLabel: string;
};

export type GuidesData = {
  section: { eyebrow: string; heading: string };
  guides: PublicGuide[];
};

// ---------------------------------------------------------------------------
// Defaults, used when the singleton copy row has not been created yet so the
// site still renders on a fresh database.
// ---------------------------------------------------------------------------

const SERVICES_FALLBACK: ServicesSectionCopy = {
  eyebrow: "Coaching Offerings",
  heading: "Programs built around you.",
  weeklyLabel: "Pay weekly",
  upfrontLabel: "Pay upfront",
  weeklyNote:
    "Rolling weekly billing after a 12-week minimum commitment. Cancel any time.",
  upfrontNote: "12 weeks paid upfront - save {discount}% vs. weekly.",
  upfrontDiscount: 8,
  upfrontWeeks: 12,
  compareOpenLabel: "Compare all details",
  compareOpenSub: "See every tier side by side",
  compareCloseLabel: "Hide full comparison",
  compareCloseSub: "Collapse the table below",
  inPersonTitle: "In-Person - 1:1 & Small Group",
  inPersonDescription:
    "Skills, speed, movement quality, strength and conditioning - tailored to your goals.",
  inPersonNote: "Groups of 4+.",
  inPersonCtaLabel: "Enquire directly",
  inPersonCtaHref: "#contact",
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getServicesData(): Promise<ServicesData> {
  const [section, tiers, steps, groups, inPerson] = await Promise.all([
    prisma.servicesSection.findUnique({ where: { id: "singleton" } }),
    prisma.coachingTier.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.serviceStep.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.compareGroup.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        rows: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          include: { cells: true },
        },
      },
    }),
    prisma.inPersonOption.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const publicTiers: PublicTier[] = tiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    fee: t.fee,
    tagline: t.tagline,
    features: t.features,
    bestFor: t.bestFor,
    treatment: t.treatment,
    badge: t.badge,
    spotsLeft: t.spotsLeft,
    spotsLabel: t.spotsLabel,
    ctaLabel: t.ctaLabel,
    ctaHref: t.ctaHref,
    isRecommended: t.isRecommended,
  }));

  // Align every row's cells to the visible tier order so the table lines up
  // even when tiers are reordered or a tier has no cell for a row yet.
  const compareGroups: PublicCompareGroup[] = groups.map((group) => ({
    id: group.id,
    title: group.title,
    rows: group.rows.map((row) => {
      const byTier = new Map(row.cells.map((c) => [c.tierId, c]));
      return {
        id: row.id,
        label: row.label,
        cells: publicTiers.map((tier) => {
          const cell = byTier.get(tier.id);
          return {
            kind: cell?.kind ?? ("NO" as CompareCellKind),
            text: cell?.text ?? null,
          };
        }),
      };
    }),
  }));

  return {
    section: section
      ? {
          eyebrow: section.eyebrow,
          heading: section.heading,
          weeklyLabel: section.weeklyLabel,
          upfrontLabel: section.upfrontLabel,
          weeklyNote: section.weeklyNote,
          upfrontNote: section.upfrontNote,
          upfrontDiscount: section.upfrontDiscount,
          upfrontWeeks: section.upfrontWeeks,
          compareOpenLabel: section.compareOpenLabel,
          compareOpenSub: section.compareOpenSub,
          compareCloseLabel: section.compareCloseLabel,
          compareCloseSub: section.compareCloseSub,
          inPersonTitle: section.inPersonTitle,
          inPersonDescription: section.inPersonDescription,
          inPersonNote: section.inPersonNote,
          inPersonCtaLabel: section.inPersonCtaLabel,
          inPersonCtaHref: section.inPersonCtaHref,
        }
      : SERVICES_FALLBACK,
    tiers: publicTiers,
    steps: steps.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
    })),
    compareGroups,
    inPerson: inPerson.map((o) => ({
      id: o.id,
      label: o.label,
      price: o.price,
      unit: o.unit,
    })),
  };
}

export async function getSkillsData(): Promise<SkillsData> {
  const [section, skills] = await Promise.all([
    prisma.skillsSection.findUnique({ where: { id: "singleton" } }),
    prisma.skill.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        highlights: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
  ]);

  return {
    section: {
      eyebrow: section?.eyebrow ?? "Skills & Expertise",
      heading: section?.heading ?? "Every discipline covered.",
    },
    skills: skills.map((s) => ({
      id: s.id,
      tag: s.tag,
      title: s.title,
      description: s.description,
      highlights: s.highlights.map((h) => ({
        id: h.id,
        title: h.title,
        detail: h.detail,
        badge: h.badge,
      })),
    })),
  };
}

/**
 * @param pinnedOnly true for the home page marquee, false for /testimonials.
 */
export async function getTestimonialsData(
  pinnedOnly: boolean,
): Promise<TestimonialsData> {
  const [section, testimonials] = await Promise.all([
    prisma.testimonialsSection.findUnique({ where: { id: "singleton" } }),
    prisma.testimonial.findMany({
      where: {
        isPublished: true,
        ...(pinnedOnly ? { isPinned: true } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    section: {
      eyebrow: section?.eyebrow ?? "Testimonials",
      heading: section?.heading ?? "What athletes say.",
      viewAllLabel: section?.viewAllLabel ?? "View all",
      pageEyebrow: section?.pageEyebrow ?? "Testimonials",
      pageHeading: section?.pageHeading ?? "What athletes say.",
    },
    testimonials: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      quote: t.quote,
      photoUrl: t.photoUrl,
      photoPosition: t.photoPosition,
    })),
  };
}

export async function getGuidesData(): Promise<GuidesData> {
  const [section, guides] = await Promise.all([
    prisma.guidesSection.findUnique({ where: { id: "singleton" } }),
    prisma.guide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    section: {
      eyebrow: section?.eyebrow ?? "Programme Guides",
      heading: section?.heading ?? "Know exactly what you are getting.",
    },
    guides: guides.map((g) => ({
      id: g.id,
      slug: g.slug,
      tag: g.tag,
      title: g.title,
      description: g.description,
      fileUrl: g.fileUrl,
      imageUrl: g.imageUrl,
      imagePosition: g.imagePosition,
      ctaLabel: g.ctaLabel,
    })),
  };
}
