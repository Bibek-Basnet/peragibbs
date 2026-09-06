import {
  BarbellIcon,
  ListChecksIcon,
  TextAaIcon,
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
  Tabs,
  Textarea,
  type TabItem,
} from "@/components/admin/ui";
import type { Skill } from "@prisma/client";

import {
  createHighlight,
  createSkill,
  deleteHighlight,
  deleteSkill,
  saveSkillsSection,
  updateHighlight,
  updateSkill,
} from "./actions";

const BASE = "/admin/skills";

function SkillFields({ skill }: { skill?: Skill }) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_160px]">
      <Field label="Tag" hint="Small label above the title, e.g. Programming.">
        <Input name="tag" defaultValue={skill?.tag} required maxLength={60} />
      </Field>
      <Field label="Sort order" hint="Lower first.">
        <Input
          name="sortOrder"
          type="number"
          defaultValue={skill?.sortOrder ?? 0}
        />
      </Field>
      <Field label="Title" className="md:col-span-2">
        <Input
          name="title"
          defaultValue={skill?.title}
          required
          maxLength={160}
        />
      </Field>
      <Field label="Description" className="md:col-span-2">
        <Textarea
          name="description"
          rows={3}
          defaultValue={skill?.description}
          required
          maxLength={800}
        />
      </Field>
      <div className="md:col-span-2">
        <Checkbox
          name="isActive"
          label="Show on the site"
          defaultChecked={skill?.isActive ?? true}
        />
      </div>
    </div>
  );
}

export default async function SkillsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const [section, skills] = await Promise.all([
    prisma.skillsSection.findUnique({ where: { id: "singleton" } }),
    prisma.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        highlights: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      },
    }),
  ]);

  const tabItems: TabItem[] = [
    { key: "copy", label: "Section copy", icon: TextAaIcon },
    { key: "skills", label: "Skills", icon: ListChecksIcon, count: skills.length },
  ];

  const params = await searchParams;
  const tab = tabItems.some((t) => t.key === params.tab)
    ? (params.tab as string)
    : "copy";

  return (
    <>
      <PageHeader
        icon={BarbellIcon}
        eyebrow="Skills & Expertise"
        title="Skills"
        description="Each skill is a row on the site, with its own highlights listed beside it."
      />

      <Tabs items={tabItems} active={tab} basePath={BASE} />

      {tab === "copy" ? (
        <Card>
          <CardHeader
            icon={TextAaIcon}
            title="Section copy"
            description="The heading above the skills list."
          />
          <CardBody>
            <ActionForm action={saveSkillsSection} submitLabel="Save copy">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow">
                  <Input
                    name="eyebrow"
                    defaultValue={section?.eyebrow ?? "Skills & Expertise"}
                    required
                  />
                </Field>
                <Field label="Heading">
                  <Input
                    name="heading"
                    defaultValue={section?.heading ?? "Every discipline covered."}
                    required
                  />
                </Field>
              </div>
            </ActionForm>
          </CardBody>
        </Card>
      ) : null}

      {tab === "skills" ? (
        <Card>
          <CardHeader
            icon={ListChecksIcon}
            title="Skills"
            count={skills.length}
            description="Deleting a skill also deletes its highlights."
          />
          <CardBody>
            {skills.length === 0 ? (
              <EmptyState icon={BarbellIcon} title="No skills yet">
                Add your first skill below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {skills.map((skill, i) => (
                  <Collapsible
                    key={skill.id}
                    title={skill.title}
                    subtitle={`${skill.tag} - ${skill.highlights.length} highlight${
                      skill.highlights.length === 1 ? "" : "s"
                    }`}
                    leading={
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas font-ui text-xs font-semibold tabular-nums text-grey">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    }
                    meta={
                      !skill.isActive ? (
                        <Badge tone="warning">Hidden</Badge>
                      ) : null
                    }
                  >
                    <ActionForm
                      action={updateSkill}
                      submitLabel="Save skill"
                      extraActions={
                        <DeleteForm
                          action={deleteSkill}
                          id={skill.id}
                          label="Delete skill"
                          confirmMessage={`Delete "${skill.title}" and its highlights?`}
                        />
                      }
                    >
                      <input type="hidden" name="id" value={skill.id} />
                      <SkillFields skill={skill} />
                    </ActionForm>

                    <div className="mt-6 border-t border-line pt-5">
                      <p className="mb-3 font-ui text-[13px] font-semibold text-ink">
                        Highlights
                        <span className="ml-2 rounded-full bg-white px-2 py-0.5 font-ui text-[11px] font-semibold tabular-nums text-grey ring-1 ring-line">
                          {skill.highlights.length}
                        </span>
                      </p>

                      <div className="flex flex-col gap-2.5">
                        {skill.highlights.map((highlight) => (
                          <Collapsible
                            key={highlight.id}
                            title={highlight.title}
                            subtitle={highlight.detail}
                            meta={
                              highlight.badge ? (
                                <Badge tone="info">{highlight.badge}</Badge>
                              ) : null
                            }
                          >
                            <ActionForm
                              action={updateHighlight}
                              submitLabel="Save highlight"
                              extraActions={
                                <DeleteForm
                                  action={deleteHighlight}
                                  id={highlight.id}
                                  label="Delete"
                                  confirmMessage="Delete this highlight?"
                                />
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={highlight.id}
                              />
                              <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Title">
                                  <Input
                                    name="title"
                                    defaultValue={highlight.title}
                                    required
                                  />
                                </Field>
                                <Field
                                  label="Badge"
                                  hint="Optional pill, e.g. Advanced tier."
                                >
                                  <Input
                                    name="badge"
                                    defaultValue={highlight.badge ?? ""}
                                  />
                                </Field>
                                <Field label="Detail" className="md:col-span-2">
                                  <Textarea
                                    name="detail"
                                    rows={2}
                                    defaultValue={highlight.detail}
                                    required
                                  />
                                </Field>
                                <Field label="Sort order">
                                  <Input
                                    name="sortOrder"
                                    type="number"
                                    defaultValue={highlight.sortOrder}
                                  />
                                </Field>
                              </div>
                            </ActionForm>
                          </Collapsible>
                        ))}
                      </div>

                      <AddPanel label="Add a highlight">
                        <ActionForm
                          action={createHighlight}
                          submitLabel="Add highlight"
                          pendingLabel="Adding..."
                          resetOnSuccess
                        >
                          <input
                            type="hidden"
                            name="skillId"
                            value={skill.id}
                          />
                          <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Title">
                              <Input name="title" required />
                            </Field>
                            <Field label="Badge">
                              <Input name="badge" />
                            </Field>
                            <Field label="Detail" className="md:col-span-2">
                              <Textarea name="detail" rows={2} required />
                            </Field>
                            <Field label="Sort order">
                              <Input
                                name="sortOrder"
                                type="number"
                                defaultValue={skill.highlights.length}
                              />
                            </Field>
                          </div>
                        </ActionForm>
                      </AddPanel>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}

            <AddPanel label="Add a skill">
              <ActionForm
                action={createSkill}
                submitLabel="Create skill"
                pendingLabel="Creating..."
                resetOnSuccess
              >
                <SkillFields />
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
