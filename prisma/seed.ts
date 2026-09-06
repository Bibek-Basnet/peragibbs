/**
 * Seeds the database with the content that used to be hard-coded in the
 * components, plus the first admin user.
 *
 * Safe to re-run: every write is an upsert keyed on a stable slug/id, so
 * edits made in the admin panel to rows you have since changed will be
 * overwritten, but nothing is duplicated.
 *
 * Run with: npm run db:seed
 */
import path from "node:path";
import { PrismaClient, TierTreatment, CompareCellKind } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

try {
  process.loadEnvFile(path.join(process.cwd(), ".env"));
} catch {
  // Fall back to the ambient environment.
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env before seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// ---------------------------------------------------------------------------

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@peragibbsmovement.com")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Pera Gibbs";

  if (!password) {
    const existing = await prisma.adminUser.count();
    if (existing > 0) {
      console.log("- admin: ADMIN_PASSWORD not set, leaving existing users alone");
      return;
    }
    throw new Error(
      "No admin user exists and ADMIN_PASSWORD is not set. Add ADMIN_EMAIL and ADMIN_PASSWORD to .env, then re-run the seed.",
    );
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name, isActive: true },
    create: { email, passwordHash, name },
  });
  console.log(`- admin: ${email}`);
}

// ---------------------------------------------------------------------------

const TIERS = [
  {
    slug: "foundation",
    name: "Foundation",
    price: 49,
    fee: "$50 onboarding fee",
    tagline: "You're buying a focused program",
    features: [
      "Single-discipline programming - strength or conditioning based",
      "Structured block, self-managed",
    ],
    bestFor:
      "Athletes with one clear focus, or just getting started and want to keep it simple.",
    treatment: TierTreatment.DARK,
    badge: null as string | null,
    spotsLeft: null as number | null,
    isRecommended: false,
    sortOrder: 0,
  },
  {
    slug: "intermediate",
    name: "Intermediate",
    price: 79,
    fee: "$50 onboarding fee",
    tagline: "You're buying complete, balanced programming",
    features: [
      "Strength and conditioning combined into one structured block",
      "Built for well-rounded athletic development",
      "Structured block, self-managed",
    ],
    bestFor:
      "Athletes who want proper all-around development without needing hands-on coaching.",
    treatment: TierTreatment.LIGHT_ACCENT,
    badge: "Recommended",
    spotsLeft: null as number | null,
    isRecommended: true,
    sortOrder: 1,
  },
  {
    slug: "advanced",
    name: "Advanced",
    price: 119,
    fee: "$100 onboarding fee",
    tagline: "You're buying me",
    features: [
      "Gym and conditioning focused programming",
      "Fully tailored and mapped out week to week",
      "Weekly check-ins and adjustments where needed",
    ],
    bestFor:
      "Athletes chasing a specific performance target or needing specialised support (e.g. injury rehab).",
    treatment: TierTreatment.DARK_ACCENT,
    badge: null as string | null,
    spotsLeft: 3,
    isRecommended: false,
    sortOrder: 2,
  },
];

const APPLY_URL = "https://form.jotform.com/261601330383043";

const STEPS = [
  { title: "Apply", description: "A 2-minute form - no payment needed yet." },
  {
    title: "Onboarding call",
    description:
      "We go over your training history, map out your goals and confirm the best programme tier.",
  },
  {
    title: "Start training",
    description:
      "Once payment is received your personalised program will be acessable via the app Teambuildr.",
  },
];

type CellSpec = { kind: CompareCellKind; text?: string };

const text = (value: string): CellSpec => ({
  kind: CompareCellKind.TEXT,
  text: value,
});
const yes: CellSpec = { kind: CompareCellKind.YES };
const no: CellSpec = { kind: CompareCellKind.NO };

/** Cells are listed in the same order as TIERS above. */
const COMPARE_GROUPS: {
  title: string;
  rows: { label: string; cells: CellSpec[] }[];
}[] = [
  {
    title: "Pricing",
    rows: [
      { label: "Weekly price", cells: [text("$49"), text("$79"), text("$119")] },
      { label: "Onboarding fee", cells: [text("$50"), text("$50"), text("$100")] },
    ],
  },
  {
    title: "Programming",
    rows: [
      {
        label: "Programming style",
        cells: [
          text("Single discipline"),
          text("Strength + conditioning"),
          text("Fully tailored"),
        ],
      },
      {
        label: "Program adjustments",
        cells: [
          text("At start only"),
          text("At start only"),
          text("Ongoing, weekly"),
        ],
      },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Weekly check-ins", cells: [no, no, yes] },
      { label: "Injury rehab / specific targets", cells: [no, no, yes] },
    ],
  },
];

const IN_PERSON = [
  { label: "1:1", price: "150" },
  { label: "2 athletes", price: "200" },
  { label: "3 athletes", price: "250" },
];

async function seedOfferings() {
  await prisma.servicesSection.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const tierIds: string[] = [];
  for (const tier of TIERS) {
    const saved = await prisma.coachingTier.upsert({
      where: { slug: tier.slug },
      update: {
        name: tier.name,
        price: tier.price,
        fee: tier.fee,
        tagline: tier.tagline,
        features: tier.features,
        bestFor: tier.bestFor,
        treatment: tier.treatment,
        badge: tier.badge,
        spotsLeft: tier.spotsLeft,
        isRecommended: tier.isRecommended,
        ctaHref: APPLY_URL,
        sortOrder: tier.sortOrder,
        isActive: true,
      },
      create: {
        slug: tier.slug,
        name: tier.name,
        price: tier.price,
        fee: tier.fee,
        tagline: tier.tagline,
        features: tier.features,
        bestFor: tier.bestFor,
        treatment: tier.treatment,
        badge: tier.badge,
        spotsLeft: tier.spotsLeft,
        isRecommended: tier.isRecommended,
        ctaHref: APPLY_URL,
        sortOrder: tier.sortOrder,
      },
    });
    tierIds.push(saved.id);
  }
  console.log(`- offerings: ${tierIds.length} tiers`);

  await prisma.serviceStep.deleteMany({});
  await prisma.serviceStep.createMany({
    data: STEPS.map((step, i) => ({ ...step, sortOrder: i })),
  });
  console.log(`- offerings: ${STEPS.length} steps`);

  // Rebuild the comparison table from scratch; cells cascade with the rows.
  await prisma.compareGroup.deleteMany({});
  for (const [gi, group] of COMPARE_GROUPS.entries()) {
    const savedGroup = await prisma.compareGroup.create({
      data: { title: group.title, sortOrder: gi },
    });
    for (const [ri, row] of group.rows.entries()) {
      await prisma.compareRow.create({
        data: {
          groupId: savedGroup.id,
          label: row.label,
          sortOrder: ri,
          cells: {
            create: row.cells.map((cell, ci) => ({
              tierId: tierIds[ci],
              kind: cell.kind,
              text: cell.text ?? null,
            })),
          },
        },
      });
    }
  }
  console.log(`- offerings: ${COMPARE_GROUPS.length} comparison groups`);

  await prisma.inPersonOption.deleteMany({});
  await prisma.inPersonOption.createMany({
    data: IN_PERSON.map((option, i) => ({ ...option, sortOrder: i })),
  });
  console.log(`- offerings: ${IN_PERSON.length} in-person options`);
}

// ---------------------------------------------------------------------------

const SKILLS = [
  {
    tag: "Programming",
    title: "Strength & conditioning",
    description:
      "Program design built on high-performance principles - periodised strength blocks adapted for developing athletes.",
    highlights: [
      {
        title: "Periodised programming",
        detail:
          "Structured across macro and micro training blocks to build load progressively without burnout.",
      },
      {
        title: "Load management",
        detail:
          "Volume and intensity tailored to each athlete's training age and recovery capacity.",
      },
      {
        title: "Gym-based strength",
        detail:
          "Foundational lifts and accessory work built for long-term strength development.",
      },
    ],
  },
  {
    tag: "Technical",
    title: "Rugby skills development",
    description:
      "Specialises in the technical detail that separates good ball-players from great ones - built through repetition and game-realistic pressure.",
    highlights: [
      {
        title: "Catch & pass technical development",
        detail:
          "Handling and passing mechanics broken down and rebuilt for accuracy under pressure.",
      },
      {
        title: "Kicking",
        detail:
          "All forms specific to your game - technique built around your position and role.",
      },
      {
        title: "Off-load development",
        detail:
          "Contact-based off-loading technique trained for timing, control, and decision-making.",
      },
    ],
  },
  {
    tag: "Movement",
    title: "Speed & agility",
    description:
      "Acceleration mechanics, change-of-direction, and reactive speed work tailored to each athlete's movement profile.",
    highlights: [
      {
        title: "Sprint mechanics",
        detail:
          "Acceleration and top-speed technique broken down and rebuilt for efficiency.",
      },
      {
        title: "Change of direction",
        detail:
          "Deceleration control and cutting technique for safer, faster direction changes.",
      },
      {
        title: "Reactive agility",
        detail:
          "Speed and agility trained against live, game-like stimulus rather than fixed patterns.",
      },
    ],
  },
  {
    tag: "Recovery",
    title: "Injury prevention & rehab",
    description:
      "Return-to-play programming and prehab work that keeps athletes training through the seasons that matter.",
    highlights: [
      {
        title: "Return to play",
        detail:
          "Structured, staged progressions that rebuild capacity safely after injury.",
      },
      {
        title: "Movement screening",
        detail:
          "Regular screening to catch and correct issues before they become injuries.",
      },
      {
        title: "Ongoing mobility",
        detail:
          "Joint health and mobility work built into every training block, not bolted on.",
      },
    ],
  },
  {
    tag: "Development",
    title: "Youth athlete development",
    description:
      "Long-term athletic development frameworks - building physical literacy before chasing specialisation.",
    highlights: [
      {
        title: "Long-term planning",
        detail:
          "Age-appropriate development frameworks that build a base before specialising.",
      },
      {
        title: "Physical literacy",
        detail:
          "Fundamental movement competency prioritised before sport-specific demands.",
      },
      {
        title: "Clear communication",
        detail:
          "Coaching language and delivery matched to the athlete's age and stage.",
      },
    ],
  },
  {
    tag: "Analysis",
    title: "Performance monitoring",
    description:
      "Tracking load, progress, and readiness week to week so programming stays responsive, not static.",
    highlights: [
      {
        title: "Weekly tracking",
        detail:
          "Available on the Advanced tier - load and readiness monitored every week to guide programming decisions.",
        badge: "Advanced tier",
      },
      {
        title: "Progress reviews",
        detail:
          "Regular check-ins that keep athletes and programming aligned to real progress.",
      },
      {
        title: "Data-led adjustments",
        detail:
          "Programming shifts based on how the athlete is actually responding, not assumptions.",
      },
    ],
  },
];

async function seedSkills() {
  await prisma.skillsSection.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  await prisma.skill.deleteMany({});
  for (const [i, skill] of SKILLS.entries()) {
    await prisma.skill.create({
      data: {
        tag: skill.tag,
        title: skill.title,
        description: skill.description,
        sortOrder: i,
        highlights: {
          create: skill.highlights.map((h, hi) => ({
            title: h.title,
            detail: h.detail,
            badge: "badge" in h ? (h.badge as string) : null,
            sortOrder: hi,
          })),
        },
      },
    });
  }
  console.log(`- skills: ${SKILLS.length} skills`);
}

// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    quote:
      "I had the privilege of working with Pera for several years during my time with the Black Ferns Sevens, where he served as my Strength and Conditioning Coach. Throughout that period, he consistently prepared me to perform at the highest level of international rugby.",
    name: "Sarah Hirini (Goss)",
    role: "Black Ferns Sevens",
    photoUrl: "/testimonials/Sarah Hirini.jpeg",
    photoPosition: "50% 20%",
  },
  {
    quote:
      "I had the privilege of being coached by Pera across the 2021, 2022 and 2023 ANZ Premiership seasons as well as between seasons leading into Silver Ferns campaigns. These results gained me selection for the 2022 Commonwealth Games and the 2023 Netball World Cup.",
    name: "Grace Nweke",
    role: "Silver Fern",
    photoUrl: "/testimonials/Grace.jpg",
    photoPosition: "50% 15%",
  },
  {
    quote:
      "I have been lucky enough to work with Pera over many stages through both my amateur and professional rugby career. He's clearly very well educated and confident in what he is teaching is right for me specifically at that time as his messaging around what we do and why we do it is always super clear.",
    name: "Brad Weber",
    role: "All Black",
    photoUrl: "/testimonials/Brad Weber.jpg",
    photoPosition: "50% 20%",
  },
  {
    quote:
      "I've known Pera for over 20 years and have jumped into plenty of sessions with him over that time, so I've seen first-hand how he operates. He's got an unreal growth mindset and is seriously competitive. His energy rubs off on those around him and undoubtedly brings out the best in people.",
    name: "Jamison Gibson-Park",
    role: "Irish International Rugby | Leinster Rugby",
    photoUrl: "/testimonials/Jamison Gibson Park.webp",
    photoPosition: "50% 15%",
  },
  {
    quote:
      "Before training with Pera I felt pretty fit and decent at footy. After working together I noticed I wasn't as fit or as skilled as I thought, and his attention to detail and ability to teach skillsets is impressive.",
    name: "Harry Speight",
    role: "North Harbour Club Rugby",
    photoUrl: "/testimonials/Harry Speight.jpg",
    photoPosition: "50% 20%",
  },
];

async function seedTestimonials() {
  await prisma.testimonialsSection.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const existing = await prisma.testimonial.count();
  if (existing > 0) {
    console.log(`- testimonials: ${existing} already present, skipping`);
    return;
  }

  await prisma.testimonial.createMany({
    data: TESTIMONIALS.map((t, i) => ({
      ...t,
      sortOrder: i,
      // Everything the site currently shows on the home page marquee.
      isPinned: true,
      isPublished: true,
    })),
  });
  console.log(`- testimonials: ${TESTIMONIALS.length} seeded and pinned`);
}

// ---------------------------------------------------------------------------

const GUIDES = [
  {
    slug: "team-sport",
    tag: "Team Sport Edition",
    title: "Rugby, netball & team athletes.",
    description:
      "TeamBuildr setup, your 12-week block breakdown, the PGMVMT Big Five testing benchmarks - Bronco, Broad Jump, Push Up, Bench Press, Trap Bar Deadlift, Chin Up - RIR/RPE load guidance, and speed & conditioning protocols.",
    fileUrl: "/guides/pdf1.pdf",
    imageUrl: "/gallery/guide1.jpg",
    imagePosition: "50% 30%",
    sortOrder: 0,
  },
  {
    slug: "runner",
    tag: "Runner Edition",
    title: "Distance & endurance athletes.",
    description:
      "TeamBuildr setup, your 12-week block breakdown, 5km/10km/half/marathon time trial testing, RPE effort guidance, how to run a proper time trial, and how strength training integrates into your week.",
    fileUrl: "/guides/pdf2.pdf",
    imageUrl: "/gallery/guide2.jpg",
    imagePosition: "50% 40%",
    sortOrder: 1,
  },
];

async function seedGuides() {
  await prisma.guidesSection.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  for (const guide of GUIDES) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: guide,
      create: guide,
    });
  }
  console.log(`- guides: ${GUIDES.length} guides`);
}

// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding Pera Gibbs Movement content...");
  await seedAdmin();
  await seedOfferings();
  await seedSkills();
  await seedTestimonials();
  await seedGuides();
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
