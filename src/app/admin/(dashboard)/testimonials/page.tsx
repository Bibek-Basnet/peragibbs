import Image from "next/image";
import {
  PushPinIcon,
  PushPinSlashIcon,
  QuotesIcon,
  StarIcon,
  TextAaIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import ActionForm, {
  DeleteForm,
  QuickAction,
} from "@/components/admin/ActionForm";
import FileField from "@/components/admin/FileField";
import { uploadLimits } from "@/lib/uploads";
import {
  AddPanel,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  EmptyState,
  Field,
  Input,
  PageHeader,
  PositionSelect,
  Tabs,
  Textarea,
  type TabItem,
} from "@/components/admin/ui";
import type { Testimonial } from "@prisma/client";

import {
  createTestimonial,
  deleteTestimonial,
  saveTestimonialsSection,
  toggleTestimonialFlag,
  updateTestimonial,
} from "./actions";

const BASE = "/admin/testimonials";

function TestimonialFields({ testimonial }: { testimonial?: Testimonial }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input
            name="name"
            defaultValue={testimonial?.name}
            required
            maxLength={120}
          />
        </Field>
        <Field label="Role" hint="Team, honours or level, shown under the name.">
          <Input
            name="role"
            defaultValue={testimonial?.role}
            required
            maxLength={160}
          />
        </Field>
        <Field label="Quote" className="md:col-span-2">
          <Textarea
            name="quote"
            rows={5}
            defaultValue={testimonial?.quote}
            required
            maxLength={2000}
          />
        </Field>
      </div>

      <fieldset className="mt-5 rounded-lg border border-line bg-white p-4">
        <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
          Photo
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FileField
              label="Photo"
              fileFieldName="photoFile"
              pathFieldName="photoUrl"
              currentPath={testimonial?.photoUrl ?? ""}
              limits={uploadLimits("image")}
              kind="image"
              hint="A portrait-shaped photo works best."
            />
          </div>
          <Field
            label="Which part of the photo to show"
            hint="The card is a tall crop, so pick where the face should sit."
          >
            <PositionSelect
              name="photoPosition"
              defaultValue={testimonial?.photoPosition ?? "50% 20%"}
            />
          </Field>
          <Field label="Sort order" hint="Lower first.">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={testimonial?.sortOrder ?? 0}
            />
          </Field>
        </div>
      </fieldset>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <Checkbox
          name="isPinned"
          label="Pin to the home page"
          hint="Pinned testimonials appear in the scrolling band on the home page."
          defaultChecked={testimonial?.isPinned ?? false}
        />
        <Checkbox
          name="isPublished"
          label="Published"
          hint="Unpublished testimonials are hidden everywhere, including /testimonials."
          defaultChecked={testimonial?.isPublished ?? true}
        />
      </div>
    </>
  );
}

export default async function TestimonialsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const [section, testimonials] = await Promise.all([
    prisma.testimonialsSection.findUnique({ where: { id: "singleton" } }),
    prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const pinnedCount = testimonials.filter(
    (t) => t.isPinned && t.isPublished,
  ).length;

  const tabItems: TabItem[] = [
    { key: "copy", label: "Section copy", icon: TextAaIcon },
    {
      key: "list",
      label: "Testimonials",
      icon: QuotesIcon,
      count: testimonials.length,
    },
  ];

  const params = await searchParams;
  const tab = tabItems.some((t) => t.key === params.tab)
    ? (params.tab as string)
    : "copy";

  return (
    <>
      <PageHeader
        icon={StarIcon}
        eyebrow="Testimonials"
        title="Athlete testimonials"
        description="Pinned testimonials appear in the home page band. Every published testimonial appears on the testimonials page."
      />

      <Tabs items={tabItems} active={tab} basePath={BASE} />

      {tab === "copy" ? (
        <Card>
          <CardHeader
            icon={TextAaIcon}
            title="Section copy"
            description="Headings for both the home page band and the full testimonials page."
          />
          <CardBody>
            <ActionForm action={saveTestimonialsSection} submitLabel="Save copy">
              <fieldset className="rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  Home page band
                </legend>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Eyebrow">
                    <Input
                      name="eyebrow"
                      defaultValue={section?.eyebrow ?? "Testimonials"}
                      required
                    />
                  </Field>
                  <Field label="Heading">
                    <Input
                      name="heading"
                      defaultValue={section?.heading ?? "What athletes say."}
                      required
                    />
                  </Field>
                  <Field label="View all button">
                    <Input
                      name="viewAllLabel"
                      defaultValue={section?.viewAllLabel ?? "View all"}
                      required
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-5 rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  Testimonials page
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input
                      name="pageEyebrow"
                      defaultValue={section?.pageEyebrow ?? "Testimonials"}
                      required
                    />
                  </Field>
                  <Field label="Heading">
                    <Input
                      name="pageHeading"
                      defaultValue={section?.pageHeading ?? "What athletes say."}
                      required
                    />
                  </Field>
                </div>
              </fieldset>
            </ActionForm>
          </CardBody>
        </Card>
      ) : null}

      {tab === "list" ? (
        <Card>
          <CardHeader
            icon={QuotesIcon}
            title="Testimonials"
            count={testimonials.length}
            description={`${pinnedCount} pinned to the home page.`}
          />
          <CardBody>
            {pinnedCount === 0 && testimonials.length > 0 ? (
              <div className="mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <WarningCircleIcon
                  size={17}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="font-ui text-sm leading-relaxed text-amber-900">
                  Nothing is pinned, so the testimonials band is hidden on the
                  home page. Pin at least one to bring it back.
                </p>
              </div>
            ) : null}

            {testimonials.length === 0 ? (
              <EmptyState icon={QuotesIcon} title="No testimonials yet">
                Add your first testimonial below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="overflow-hidden rounded-xl border border-line bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-4 px-4 py-3.5 md:px-5">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-canvas ring-1 ring-line">
                        <Image
                          src={t.photoUrl}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                          style={{ objectPosition: t.photoPosition }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-ui text-sm font-semibold text-ink">
                            {t.name}
                          </span>
                          {t.isPinned ? (
                            <Badge tone="info" icon={PushPinIcon}>
                              Pinned
                            </Badge>
                          ) : null}
                          {!t.isPublished ? (
                            <Badge tone="warning">Unpublished</Badge>
                          ) : null}
                        </div>
                        <p className="truncate font-ui text-xs text-grey">
                          {t.role}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <QuickAction
                          action={toggleTestimonialFlag}
                          fields={{
                            id: t.id,
                            field: "isPinned",
                            value: String(!t.isPinned),
                          }}
                          label={t.isPinned ? "Unpin" : "Pin to home"}
                          tone={t.isPinned ? "secondary" : "primary"}
                          icon={
                            t.isPinned ? (
                              <PushPinSlashIcon size={13} weight="bold" />
                            ) : (
                              <PushPinIcon size={13} weight="bold" />
                            )
                          }
                        />
                        <QuickAction
                          action={toggleTestimonialFlag}
                          fields={{
                            id: t.id,
                            field: "isPublished",
                            value: String(!t.isPublished),
                          }}
                          label={t.isPublished ? "Unpublish" : "Publish"}
                        />
                      </div>
                    </div>

                    <details className="group border-t border-line">
                      <summary className="cursor-pointer list-none px-4 py-2.5 font-ui text-[13px] font-medium text-navy transition-colors hover:bg-canvas md:px-5">
                        <span className="group-open:hidden">Edit details</span>
                        <span className="hidden group-open:inline">Close</span>
                      </summary>
                      <div className="border-t border-line bg-canvas/40 px-4 py-5 md:px-5">
                        <ActionForm
                          action={updateTestimonial}
                          submitLabel="Save testimonial"
                          extraActions={
                            <DeleteForm
                              action={deleteTestimonial}
                              id={t.id}
                              label="Delete"
                              confirmMessage={`Delete the testimonial from ${t.name}?`}
                            />
                          }
                        >
                          <input type="hidden" name="id" value={t.id} />
                          <TestimonialFields testimonial={t} />
                        </ActionForm>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            <AddPanel label="Add a testimonial">
              <ActionForm
                action={createTestimonial}
                submitLabel="Create testimonial"
                pendingLabel="Creating..."
                resetOnSuccess
              >
                <TestimonialFields />
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
