import {
  CurrencyDollarIcon,
  LightningIcon,
  ListChecksIcon,
  PathIcon,
  TableIcon,
  TextAaIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import ActionForm, { DeleteForm } from "@/components/admin/ActionForm";
import {
  AddPanel,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Collapsible,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  Tabs,
  Textarea,
  type TabItem,
} from "@/components/admin/ui";
import type { CoachingTier, CompareCell } from "@prisma/client";

import {
  createCompareGroup,
  createCompareRow,
  createInPersonOption,
  createStep,
  createTier,
  deleteCompareGroup,
  deleteCompareRow,
  deleteInPersonOption,
  deleteStep,
  deleteTier,
  saveCompareRow,
  saveServicesSection,
  updateCompareGroup,
  updateInPersonOption,
  updateStep,
  updateTier,
} from "./actions";

const TREATMENTS = [
  { value: "DARK", label: "Dark card" },
  { value: "LIGHT_ACCENT", label: "Light card (highlighted)" },
  { value: "DARK_ACCENT", label: "Dark card with accent border" },
];

const BASE = "/admin/offerings";

function TierFields({ tier }: { tier?: CoachingTier }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={tier?.name} required maxLength={80} />
        </Field>
        <Field
          label="Slug"
          hint="Lowercase letters, numbers and hyphens. A stable identifier."
        >
          <Input
            name="slug"
            defaultValue={tier?.slug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={120}
          />
        </Field>
      </div>

      <fieldset className="mt-5 rounded-lg border border-line bg-white p-4">
        <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
          Pricing
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Weekly price" hint="Whole dollars, no symbol.">
            <Input
              name="price"
              type="number"
              min={0}
              defaultValue={tier?.price ?? 0}
              required
            />
          </Field>
          <Field label="Onboarding fee line">
            <Input
              name="fee"
              defaultValue={tier?.fee}
              required
              placeholder="$50 onboarding fee"
              maxLength={160}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-5 rounded-lg border border-line bg-white p-4">
        <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
          Card content
        </legend>
        <div className="grid gap-4">
          <Field label="Tagline">
            <Input
              name="tagline"
              defaultValue={tier?.tagline}
              required
              maxLength={200}
            />
          </Field>
          <Field label="Features" hint="One bullet per line.">
            <Textarea
              name="features"
              rows={4}
              defaultValue={tier?.features.join("\n")}
            />
          </Field>
          <Field label="Best for">
            <Textarea
              name="bestFor"
              rows={2}
              defaultValue={tier?.bestFor}
              required
              maxLength={600}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-5 rounded-lg border border-line bg-white p-4">
        <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
          Appearance and call to action
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Card treatment">
            <Select name="treatment" defaultValue={tier?.treatment ?? "DARK"}>
              {TREATMENTS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Badge" hint="Leave empty for no badge.">
            <Input
              name="badge"
              defaultValue={tier?.badge ?? ""}
              placeholder="Recommended"
              maxLength={60}
            />
          </Field>
          <Field label="Spots left" hint="Empty hides the scarcity line.">
            <Input
              name="spotsLeft"
              type="number"
              min={0}
              defaultValue={tier?.spotsLeft ?? ""}
            />
          </Field>
          <Field label="Spots label">
            <Input
              name="spotsLabel"
              defaultValue={tier?.spotsLabel ?? "spots left this intake"}
              maxLength={80}
            />
          </Field>
          <Field label="Button label">
            <Input
              name="ctaLabel"
              defaultValue={tier?.ctaLabel ?? "Apply Now"}
              required
              maxLength={60}
            />
          </Field>
          <Field label="Button link">
            <Input
              name="ctaHref"
              defaultValue={tier?.ctaHref ?? ""}
              required
              placeholder="https://form.jotform.com/..."
              maxLength={500}
            />
          </Field>
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 md:grid-cols-[160px_1fr_1fr]">
        <Field label="Sort order" hint="Lower first.">
          <Input
            name="sortOrder"
            type="number"
            defaultValue={tier?.sortOrder ?? 0}
          />
        </Field>
        <Checkbox
          name="isRecommended"
          label="Highlight in comparison table"
          defaultChecked={tier?.isRecommended ?? false}
        />
        <Checkbox
          name="isActive"
          label="Show on the site"
          defaultChecked={tier?.isActive ?? true}
        />
      </div>
    </>
  );
}

export default async function OfferingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const [section, tiers, steps, groups, inPerson] = await Promise.all([
    prisma.servicesSection.findUnique({ where: { id: "singleton" } }),
    prisma.coachingTier.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.serviceStep.findMany({
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
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const rowCount = groups.reduce((n, g) => n + g.rows.length, 0);

  const tabItems: TabItem[] = [
    { key: "copy", label: "Section copy", icon: TextAaIcon },
    { key: "tiers", label: "Pricing tiers", icon: CurrencyDollarIcon, count: tiers.length },
    { key: "steps", label: "How it works", icon: PathIcon, count: steps.length },
    { key: "comparison", label: "Comparison", icon: TableIcon, count: rowCount },
    { key: "in-person", label: "In-person", icon: UserIcon, count: inPerson.length },
  ];

  const params = await searchParams;
  const tab = tabItems.some((t) => t.key === params.tab)
    ? (params.tab as string)
    : "copy";

  return (
    <>
      <PageHeader
        icon={LightningIcon}
        eyebrow="Coaching Offerings"
        title="Programs & pricing"
        description="Each tab is a separate form, so you only ever save the part you are editing."
      />

      <Tabs items={tabItems} active={tab} basePath={BASE} />

      {/* ------------------------------------------------ Section copy --- */}
      {tab === "copy" ? (
        <Card>
          <CardHeader
            icon={TextAaIcon}
            title="Section copy"
            description="Headings, the billing toggle and the in-person block wording."
          />
          <CardBody>
            <ActionForm action={saveServicesSection} submitLabel="Save copy">
              <fieldset className="rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  Heading
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input
                      name="eyebrow"
                      defaultValue={section?.eyebrow ?? "Coaching Offerings"}
                      required
                    />
                  </Field>
                  <Field label="Heading">
                    <Input
                      name="heading"
                      defaultValue={
                        section?.heading ?? "Programs built around you."
                      }
                      required
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-5 rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  Billing toggle
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Weekly label">
                    <Input
                      name="weeklyLabel"
                      defaultValue={section?.weeklyLabel ?? "Pay weekly"}
                      required
                    />
                  </Field>
                  <Field label="Upfront label">
                    <Input
                      name="upfrontLabel"
                      defaultValue={section?.upfrontLabel ?? "Pay upfront"}
                      required
                    />
                  </Field>
                  <Field label="Weekly note" className="md:col-span-2">
                    <Textarea
                      name="weeklyNote"
                      rows={2}
                      defaultValue={
                        section?.weeklyNote ??
                        "Rolling weekly billing after a 12-week minimum commitment. Cancel any time."
                      }
                      required
                    />
                  </Field>
                  <Field
                    label="Upfront note"
                    className="md:col-span-2"
                    hint="{discount} and {weeks} are replaced by the numbers below."
                  >
                    <Textarea
                      name="upfrontNote"
                      rows={2}
                      defaultValue={
                        section?.upfrontNote ??
                        "12 weeks paid upfront - save {discount}% vs. weekly."
                      }
                      required
                    />
                  </Field>
                  <Field label="Upfront discount (%)">
                    <Input
                      name="upfrontDiscount"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={section?.upfrontDiscount ?? 8}
                    />
                  </Field>
                  <Field label="Upfront weeks">
                    <Input
                      name="upfrontWeeks"
                      type="number"
                      min={1}
                      defaultValue={section?.upfrontWeeks ?? 12}
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-5 rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  Comparison toggle button
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Closed label">
                    <Input
                      name="compareOpenLabel"
                      defaultValue={
                        section?.compareOpenLabel ?? "Compare all details"
                      }
                      required
                    />
                  </Field>
                  <Field label="Closed subtitle">
                    <Input
                      name="compareOpenSub"
                      defaultValue={
                        section?.compareOpenSub ?? "See every tier side by side"
                      }
                      required
                    />
                  </Field>
                  <Field label="Open label">
                    <Input
                      name="compareCloseLabel"
                      defaultValue={
                        section?.compareCloseLabel ?? "Hide full comparison"
                      }
                      required
                    />
                  </Field>
                  <Field label="Open subtitle">
                    <Input
                      name="compareCloseSub"
                      defaultValue={
                        section?.compareCloseSub ?? "Collapse the table below"
                      }
                      required
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-5 rounded-lg border border-line p-4">
                <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
                  In-person block
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" className="md:col-span-2">
                    <Input
                      name="inPersonTitle"
                      defaultValue={
                        section?.inPersonTitle ??
                        "In-Person - 1:1 & Small Group"
                      }
                      required
                    />
                  </Field>
                  <Field label="Description" className="md:col-span-2">
                    <Textarea
                      name="inPersonDescription"
                      rows={2}
                      defaultValue={
                        section?.inPersonDescription ??
                        "Skills, speed, movement quality, strength and conditioning - tailored to your goals."
                      }
                      required
                    />
                  </Field>
                  <Field label="Note">
                    <Input
                      name="inPersonNote"
                      defaultValue={section?.inPersonNote ?? "Groups of 4+."}
                    />
                  </Field>
                  <Field label="Button label">
                    <Input
                      name="inPersonCtaLabel"
                      defaultValue={
                        section?.inPersonCtaLabel ?? "Enquire directly"
                      }
                      required
                    />
                  </Field>
                  <Field label="Button link" className="md:col-span-2">
                    <Input
                      name="inPersonCtaHref"
                      defaultValue={section?.inPersonCtaHref ?? "#contact"}
                      required
                    />
                  </Field>
                </div>
              </fieldset>
            </ActionForm>
          </CardBody>
        </Card>
      ) : null}

      {/* ------------------------------------------------------ Tiers --- */}
      {tab === "tiers" ? (
        <Card>
          <CardHeader
            icon={CurrencyDollarIcon}
            title="Pricing tiers"
            count={tiers.length}
            description="The cards in the offerings grid. Deleting a tier also removes its comparison table column."
          />
          <CardBody>
            {tiers.length === 0 ? (
              <EmptyState icon={CurrencyDollarIcon} title="No tiers yet">
                Add your first pricing tier below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {tiers.map((tier) => (
                  <Collapsible
                    key={tier.id}
                    title={tier.name}
                    subtitle={`$${tier.price}/week - ${tier.tagline}`}
                    leading={
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas font-ui text-xs font-semibold tabular-nums text-ink">
                        ${tier.price}
                      </span>
                    }
                    meta={
                      <>
                        {!tier.isActive ? (
                          <Badge tone="warning">Hidden</Badge>
                        ) : null}
                        {tier.isRecommended ? (
                          <Badge tone="info">Recommended</Badge>
                        ) : null}
                      </>
                    }
                  >
                    <ActionForm
                      action={updateTier}
                      submitLabel="Save tier"
                      extraActions={
                        <DeleteForm
                          action={deleteTier}
                          id={tier.id}
                          label="Delete tier"
                          confirmMessage={`Delete the "${tier.name}" tier? Its comparison table column goes with it.`}
                        />
                      }
                    >
                      <input type="hidden" name="id" value={tier.id} />
                      <TierFields tier={tier} />
                    </ActionForm>
                  </Collapsible>
                ))}
              </div>
            )}

            <AddPanel label="Add a pricing tier">
              <ActionForm
                action={createTier}
                submitLabel="Create tier"
                pendingLabel="Creating..."
                resetOnSuccess
              >
                <TierFields />
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}

      {/* ------------------------------------------------------ Steps --- */}
      {tab === "steps" ? (
        <Card>
          <CardHeader
            icon={PathIcon}
            title="How it works"
            count={steps.length}
            description="The numbered steps under the tier cards."
          />
          <CardBody>
            {steps.length === 0 ? (
              <EmptyState icon={PathIcon} title="No steps yet">
                Add the first step below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <Collapsible
                    key={step.id}
                    title={step.title}
                    subtitle={step.description}
                    leading={
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 font-ui text-xs font-semibold text-navy">
                        {i + 1}
                      </span>
                    }
                    meta={
                      !step.isActive ? (
                        <Badge tone="warning">Hidden</Badge>
                      ) : null
                    }
                  >
                    <ActionForm
                      action={updateStep}
                      submitLabel="Save step"
                      extraActions={
                        <DeleteForm
                          action={deleteStep}
                          id={step.id}
                          label="Delete"
                          confirmMessage="Delete this step?"
                        />
                      }
                    >
                      <input type="hidden" name="id" value={step.id} />
                      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                        <Field label="Title">
                          <Input
                            name="title"
                            defaultValue={step.title}
                            required
                          />
                        </Field>
                        <Field label="Sort order">
                          <Input
                            name="sortOrder"
                            type="number"
                            defaultValue={step.sortOrder}
                          />
                        </Field>
                        <Field label="Description" className="md:col-span-2">
                          <Textarea
                            name="description"
                            rows={2}
                            defaultValue={step.description}
                            required
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Checkbox
                            name="isActive"
                            label="Show on the site"
                            defaultChecked={step.isActive}
                          />
                        </div>
                      </div>
                    </ActionForm>
                  </Collapsible>
                ))}
              </div>
            )}

            <AddPanel label="Add a step">
              <ActionForm
                action={createStep}
                submitLabel="Add step"
                pendingLabel="Adding..."
                resetOnSuccess
              >
                <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                  <Field label="Title">
                    <Input name="title" required />
                  </Field>
                  <Field label="Sort order">
                    <Input
                      name="sortOrder"
                      type="number"
                      defaultValue={steps.length}
                    />
                  </Field>
                  <Field label="Description" className="md:col-span-2">
                    <Textarea name="description" rows={2} required />
                  </Field>
                  <div className="md:col-span-2">
                    <Checkbox
                      name="isActive"
                      label="Show on the site"
                      defaultChecked
                    />
                  </div>
                </div>
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}

      {/* ------------------------------------------------- Comparison --- */}
      {tab === "comparison" ? (
        <Card>
          <CardHeader
            icon={TableIcon}
            title="Comparison table"
            count={rowCount}
            description="Grouped rows shown when a visitor expands the comparison. Each row holds one value per tier."
          />
          <CardBody>
            {tiers.length === 0 ? (
              <EmptyState icon={TableIcon} title="Add a tier first">
                The comparison table needs at least one pricing tier to have
                columns.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-5">
                {groups.map((group) => (
                  <section
                    key={group.id}
                    className="rounded-xl border border-line bg-canvas/50 p-4"
                  >
                    <ActionForm
                      action={updateCompareGroup}
                      submitLabel="Save group"
                      className="mb-4"
                      extraActions={
                        <DeleteForm
                          action={deleteCompareGroup}
                          id={group.id}
                          label="Delete group"
                          confirmMessage={`Delete the "${group.title}" group and all of its rows?`}
                        />
                      }
                    >
                      <input type="hidden" name="id" value={group.id} />
                      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                        <Field label="Group title">
                          <Input
                            name="title"
                            defaultValue={group.title}
                            required
                          />
                        </Field>
                        <Field label="Sort order">
                          <Input
                            name="sortOrder"
                            type="number"
                            defaultValue={group.sortOrder}
                          />
                        </Field>
                      </div>
                    </ActionForm>

                    <div className="flex flex-col gap-3">
                      {group.rows.map((row) => {
                        const byTier = new Map<string, CompareCell>(
                          row.cells.map((c) => [c.tierId, c]),
                        );

                        return (
                          <Collapsible
                            key={row.id}
                            title={row.label}
                            subtitle={tiers
                              .map((t) => {
                                const cell = byTier.get(t.id);
                                if (!cell || cell.kind === "NO")
                                  return `${t.name}: -`;
                                if (cell.kind === "YES")
                                  return `${t.name}: yes`;
                                return `${t.name}: ${cell.text ?? ""}`;
                              })
                              .join("   ·   ")}
                          >
                            <ActionForm
                              action={saveCompareRow}
                              submitLabel="Save row"
                              extraActions={
                                <DeleteForm
                                  action={deleteCompareRow}
                                  id={row.id}
                                  label="Delete row"
                                  confirmMessage="Delete this comparison row?"
                                />
                              }
                            >
                              <input
                                type="hidden"
                                name="rowId"
                                value={row.id}
                              />
                              <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                                <Field label="Row label">
                                  <Input
                                    name="label"
                                    defaultValue={row.label}
                                    required
                                  />
                                </Field>
                                <Field label="Sort order">
                                  <Input
                                    name="sortOrder"
                                    type="number"
                                    defaultValue={row.sortOrder}
                                  />
                                </Field>
                              </div>

                              <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {tiers.map((tier) => {
                                  const cell = byTier.get(tier.id);
                                  return (
                                    <div
                                      key={tier.id}
                                      className="rounded-lg border border-line bg-white p-3.5"
                                    >
                                      <p className="mb-3 font-ui text-[13px] font-semibold text-ink">
                                        {tier.name}
                                      </p>
                                      <Field label="Value type">
                                        <Select
                                          name={`kind__${tier.id}`}
                                          defaultValue={cell?.kind ?? "NO"}
                                        >
                                          <option value="TEXT">Text</option>
                                          <option value="YES">Tick</option>
                                          <option value="NO">Dash</option>
                                        </Select>
                                      </Field>
                                      <Field
                                        label="Text"
                                        className="mt-3"
                                        hint="Used when the type is Text."
                                      >
                                        <Input
                                          name={`text__${tier.id}`}
                                          defaultValue={cell?.text ?? ""}
                                        />
                                      </Field>
                                    </div>
                                  );
                                })}
                              </div>
                            </ActionForm>
                          </Collapsible>
                        );
                      })}
                    </div>

                    <AddPanel label={`Add a row to ${group.title}`}>
                      <ActionForm
                        action={createCompareRow}
                        submitLabel="Add row"
                        pendingLabel="Adding..."
                        resetOnSuccess
                      >
                        <input
                          type="hidden"
                          name="groupId"
                          value={group.id}
                        />
                        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                          <Field
                            label="Row label"
                            hint="Values start blank - open the row to fill them in."
                          >
                            <Input name="label" required />
                          </Field>
                          <Field label="Sort order">
                            <Input
                              name="sortOrder"
                              type="number"
                              defaultValue={group.rows.length}
                            />
                          </Field>
                        </div>
                      </ActionForm>
                    </AddPanel>
                  </section>
                ))}
              </div>
            )}

            <AddPanel label="Add a comparison group">
              <ActionForm
                action={createCompareGroup}
                submitLabel="Add group"
                pendingLabel="Adding..."
                resetOnSuccess
              >
                <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                  <Field label="Group title">
                    <Input name="title" required placeholder="Pricing" />
                  </Field>
                  <Field label="Sort order">
                    <Input
                      name="sortOrder"
                      type="number"
                      defaultValue={groups.length}
                    />
                  </Field>
                </div>
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}

      {/* -------------------------------------------------- In-person --- */}
      {tab === "in-person" ? (
        <Card>
          <CardHeader
            icon={UserIcon}
            title="In-person rates"
            count={inPerson.length}
            description="The price tiles in the in-person coaching block."
          />
          <CardBody>
            {inPerson.length === 0 ? (
              <EmptyState icon={ListChecksIcon} title="No rates yet">
                Add your first in-person rate below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {inPerson.map((option) => (
                  <Collapsible
                    key={option.id}
                    title={option.label}
                    subtitle={`$${option.price} ${option.unit}`}
                    leading={
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas font-ui text-xs font-semibold tabular-nums text-ink">
                        ${option.price}
                      </span>
                    }
                    meta={
                      !option.isActive ? (
                        <Badge tone="warning">Hidden</Badge>
                      ) : null
                    }
                  >
                    <ActionForm
                      action={updateInPersonOption}
                      submitLabel="Save rate"
                      extraActions={
                        <DeleteForm
                          action={deleteInPersonOption}
                          id={option.id}
                          label="Delete"
                          confirmMessage="Delete this rate?"
                        />
                      }
                    >
                      <input type="hidden" name="id" value={option.id} />
                      <div className="grid gap-4 md:grid-cols-4">
                        <Field label="Label">
                          <Input
                            name="label"
                            defaultValue={option.label}
                            required
                          />
                        </Field>
                        <Field label="Price" hint="Digits only.">
                          <Input
                            name="price"
                            defaultValue={option.price}
                            required
                          />
                        </Field>
                        <Field label="Unit">
                          <Input
                            name="unit"
                            defaultValue={option.unit}
                            required
                          />
                        </Field>
                        <Field label="Sort order">
                          <Input
                            name="sortOrder"
                            type="number"
                            defaultValue={option.sortOrder}
                          />
                        </Field>
                        <div className="md:col-span-4">
                          <Checkbox
                            name="isActive"
                            label="Show on the site"
                            defaultChecked={option.isActive}
                          />
                        </div>
                      </div>
                    </ActionForm>
                  </Collapsible>
                ))}
              </div>
            )}

            <AddPanel label="Add an in-person rate">
              <ActionForm
                action={createInPersonOption}
                submitLabel="Add rate"
                pendingLabel="Adding..."
                resetOnSuccess
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <Field label="Label">
                    <Input name="label" required placeholder="1:1" />
                  </Field>
                  <Field label="Price">
                    <Input name="price" required placeholder="150" />
                  </Field>
                  <Field label="Unit">
                    <Input name="unit" defaultValue="per hour" required />
                  </Field>
                  <Field label="Sort order">
                    <Input
                      name="sortOrder"
                      type="number"
                      defaultValue={inPerson.length}
                    />
                  </Field>
                  <div className="md:col-span-4">
                    <Checkbox
                      name="isActive"
                      label="Show on the site"
                      defaultChecked
                    />
                  </div>
                </div>
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
