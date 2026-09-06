-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TierTreatment" AS ENUM ('DARK', 'LIGHT_ACCENT', 'DARK_ACCENT');

-- CreateEnum
CREATE TYPE "CompareCellKind" AS ENUM ('TEXT', 'YES', 'NO');

-- CreateEnum
CREATE TYPE "EnquiryRole" AS ENUM ('ATHLETE', 'PARENT', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_section" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "eyebrow" TEXT NOT NULL DEFAULT 'Coaching Offerings',
    "heading" TEXT NOT NULL DEFAULT 'Programs built around you.',
    "weeklyLabel" TEXT NOT NULL DEFAULT 'Pay weekly',
    "upfrontLabel" TEXT NOT NULL DEFAULT 'Pay upfront',
    "weeklyNote" TEXT NOT NULL DEFAULT 'Rolling weekly billing after a 12-week minimum commitment. Cancel any time.',
    "upfrontNote" TEXT NOT NULL DEFAULT '12 weeks paid upfront - save {discount}% vs. weekly.',
    "upfrontDiscount" INTEGER NOT NULL DEFAULT 8,
    "upfrontWeeks" INTEGER NOT NULL DEFAULT 12,
    "compareOpenLabel" TEXT NOT NULL DEFAULT 'Compare all details',
    "compareOpenSub" TEXT NOT NULL DEFAULT 'See every tier side by side',
    "compareCloseLabel" TEXT NOT NULL DEFAULT 'Hide full comparison',
    "compareCloseSub" TEXT NOT NULL DEFAULT 'Collapse the table below',
    "inPersonTitle" TEXT NOT NULL DEFAULT 'In-Person - 1:1 & Small Group',
    "inPersonDescription" TEXT NOT NULL DEFAULT 'Skills, speed, movement quality, strength and conditioning - tailored to your goals.',
    "inPersonNote" TEXT NOT NULL DEFAULT 'Groups of 4+.',
    "inPersonCtaLabel" TEXT NOT NULL DEFAULT 'Enquire directly',
    "inPersonCtaHref" TEXT NOT NULL DEFAULT '#contact',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "fee" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "features" TEXT[],
    "bestFor" TEXT NOT NULL,
    "treatment" "TierTreatment" NOT NULL DEFAULT 'DARK',
    "badge" TEXT,
    "spotsLeft" INTEGER,
    "spotsLabel" TEXT DEFAULT 'spots left this intake',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Apply Now',
    "ctaHref" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaching_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compare_groups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compare_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compare_rows" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compare_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compare_cells" (
    "id" TEXT NOT NULL,
    "rowId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "kind" "CompareCellKind" NOT NULL DEFAULT 'TEXT',
    "text" TEXT,

    CONSTRAINT "compare_cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "in_person_options" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'per hour',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "in_person_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills_section" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "eyebrow" TEXT NOT NULL DEFAULT 'Skills & Expertise',
    "heading" TEXT NOT NULL DEFAULT 'Every discipline covered.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_highlights" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "badge" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials_section" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "eyebrow" TEXT NOT NULL DEFAULT 'Testimonials',
    "heading" TEXT NOT NULL DEFAULT 'What athletes say.',
    "viewAllLabel" TEXT NOT NULL DEFAULT 'View all',
    "pageEyebrow" TEXT NOT NULL DEFAULT 'Testimonials',
    "pageHeading" TEXT NOT NULL DEFAULT 'What athletes say.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoPosition" TEXT NOT NULL DEFAULT '50% 20%',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides_section" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "eyebrow" TEXT NOT NULL DEFAULT 'Programme Guides',
    "heading" TEXT NOT NULL DEFAULT 'Know exactly what you are getting.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePosition" TEXT NOT NULL DEFAULT '50% 30%',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Get this guide',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_leads" (
    "id" TEXT NOT NULL,
    "guideId" TEXT,
    "guideSlug" TEXT NOT NULL,
    "guideTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "EnquiryRole" NOT NULL,
    "interest" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "EnquiryRole",
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "emailStatus" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "emailId" TEXT,
    "emailError" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_tiers_slug_key" ON "coaching_tiers"("slug");

-- CreateIndex
CREATE INDEX "coaching_tiers_sortOrder_idx" ON "coaching_tiers"("sortOrder");

-- CreateIndex
CREATE INDEX "service_steps_sortOrder_idx" ON "service_steps"("sortOrder");

-- CreateIndex
CREATE INDEX "compare_groups_sortOrder_idx" ON "compare_groups"("sortOrder");

-- CreateIndex
CREATE INDEX "compare_rows_groupId_sortOrder_idx" ON "compare_rows"("groupId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "compare_cells_rowId_tierId_key" ON "compare_cells"("rowId", "tierId");

-- CreateIndex
CREATE INDEX "in_person_options_sortOrder_idx" ON "in_person_options"("sortOrder");

-- CreateIndex
CREATE INDEX "skills_sortOrder_idx" ON "skills"("sortOrder");

-- CreateIndex
CREATE INDEX "skill_highlights_skillId_sortOrder_idx" ON "skill_highlights"("skillId", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonials_isPinned_sortOrder_idx" ON "testimonials"("isPinned", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonials_isPublished_sortOrder_idx" ON "testimonials"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_sortOrder_idx" ON "guides"("sortOrder");

-- CreateIndex
CREATE INDEX "guide_leads_createdAt_idx" ON "guide_leads"("createdAt");

-- CreateIndex
CREATE INDEX "guide_leads_status_idx" ON "guide_leads"("status");

-- CreateIndex
CREATE INDEX "guide_leads_guideSlug_idx" ON "guide_leads"("guideSlug");

-- CreateIndex
CREATE INDEX "guide_leads_email_idx" ON "guide_leads"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- AddForeignKey
ALTER TABLE "compare_rows" ADD CONSTRAINT "compare_rows_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "compare_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare_cells" ADD CONSTRAINT "compare_cells_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "compare_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare_cells" ADD CONSTRAINT "compare_cells_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "coaching_tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_highlights" ADD CONSTRAINT "skill_highlights_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_leads" ADD CONSTRAINT "guide_leads_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides"("id") ON DELETE SET NULL ON UPDATE CASCADE;
