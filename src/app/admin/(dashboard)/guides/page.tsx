import {
  FileArrowDownIcon,
  FilePdfIcon,
  TextAaIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import ActionForm, { DeleteForm } from "@/components/admin/ActionForm";
import FileField from "@/components/admin/FileField";
import { uploadLimits } from "@/lib/uploads";
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
  LinkButton,
  PageHeader,
  PositionSelect,
  Tabs,
  Textarea,
  type TabItem,
} from "@/components/admin/ui";
import type { Guide } from "@prisma/client";

import {
  createGuide,
  deleteGuide,
  saveGuidesSection,
  updateGuide,
} from "./actions";

const BASE = "/admin/guides";

function GuideFields({ guide }: { guide?: Guide }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tag" hint="Small label above the title.">
          <Input
            name="tag"
            defaultValue={guide?.tag}
            required
            placeholder="Team Sport Edition"
            maxLength={80}
          />
        </Field>
        <Field
          label="Slug"
          hint="Stored with every lead, so avoid changing it once the guide is live."
        >
          <Input
            name="slug"
            defaultValue={guide?.slug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={120}
          />
        </Field>
        <Field label="Title" className="md:col-span-2">
          <Input
            name="title"
            defaultValue={guide?.title}
            required
            maxLength={200}
          />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea
            name="description"
            rows={4}
            defaultValue={guide?.description}
            required
            maxLength={1500}
          />
        </Field>
      </div>

      <fieldset className="mt-5 rounded-lg border border-line bg-white p-4">
        <legend className="px-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-grey">
          Files
        </legend>
        <div className="grid gap-5 md:grid-cols-2">
          <FileField
            label="Guide PDF"
            fileFieldName="pdfFile"
            pathFieldName="fileUrl"
            currentPath={guide?.fileUrl ?? ""}
            limits={uploadLimits("document")}
            kind="document"
            hint="This is the file visitors download."
          />
          <FileField
            label="Cover image"
            fileFieldName="coverFile"
            pathFieldName="imageUrl"
            currentPath={guide?.imageUrl ?? ""}
            limits={uploadLimits("image")}
            kind="image"
            hint="Shown beside the guide on the site."
          />
          <Field
            label="Which part of the cover to show"
            hint="The cover is cropped to a landscape shape."
          >
            <PositionSelect
              name="imagePosition"
              defaultValue={guide?.imagePosition ?? "50% 30%"}
            />
          </Field>
          <Field label="Button label">
            <Input
              name="ctaLabel"
              defaultValue={guide?.ctaLabel ?? "Get this guide"}
              required
              maxLength={60}
            />
          </Field>
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 md:grid-cols-[160px_1fr]">
        <Field label="Sort order" hint="Lower first.">
          <Input
            name="sortOrder"
            type="number"
            defaultValue={guide?.sortOrder ?? 0}
          />
        </Field>
        <Checkbox
          name="isActive"
          label="Show on the site"
          defaultChecked={guide?.isActive ?? true}
        />
      </div>
    </>
  );
}

export default async function GuidesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const [section, guides] = await Promise.all([
    prisma.guidesSection.findUnique({ where: { id: "singleton" } }),
    prisma.guide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { leads: true } } },
    }),
  ]);

  const tabItems: TabItem[] = [
    { key: "copy", label: "Section copy", icon: TextAaIcon },
    { key: "guides", label: "Guides", icon: FilePdfIcon, count: guides.length },
  ];

  const params = await searchParams;
  const tab = tabItems.some((t) => t.key === params.tab)
    ? (params.tab as string)
    : "copy";

  return (
    <>
      <PageHeader
        icon={FileArrowDownIcon}
        eyebrow="Programme Guides"
        title="Downloadable guides"
        description="The guides visitors can download. Every download form submission is stored under Guide Leads."
        actions={
          <LinkButton href="/admin/leads" icon={UsersThreeIcon}>
            View leads
          </LinkButton>
        }
      />

      <Tabs items={tabItems} active={tab} basePath={BASE} />

      {tab === "copy" ? (
        <Card>
          <CardHeader
            icon={TextAaIcon}
            title="Section copy"
            description="The heading above the guides list."
          />
          <CardBody>
            <ActionForm action={saveGuidesSection} submitLabel="Save copy">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow">
                  <Input
                    name="eyebrow"
                    defaultValue={section?.eyebrow ?? "Programme Guides"}
                    required
                  />
                </Field>
                <Field label="Heading">
                  <Input
                    name="heading"
                    defaultValue={
                      section?.heading ?? "Know exactly what you are getting."
                    }
                    required
                  />
                </Field>
              </div>
            </ActionForm>
          </CardBody>
        </Card>
      ) : null}

      {tab === "guides" ? (
        <Card>
          <CardHeader
            icon={FilePdfIcon}
            title="Guides"
            count={guides.length}
            description="Deleting a guide keeps its existing leads, which retain the guide title."
          />
          <CardBody>
            {guides.length === 0 ? (
              <EmptyState icon={FilePdfIcon} title="No guides yet">
                Add your first downloadable guide below.
              </EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                {guides.map((guide) => (
                  <Collapsible
                    key={guide.id}
                    title={guide.title}
                    subtitle={guide.tag}
                    leading={
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                        <FilePdfIcon size={17} weight="bold" />
                      </span>
                    }
                    meta={
                      <>
                        <Badge tone="neutral" icon={UsersThreeIcon}>
                          {guide._count.leads} download
                          {guide._count.leads === 1 ? "" : "s"}
                        </Badge>
                        {!guide.isActive ? (
                          <Badge tone="warning">Hidden</Badge>
                        ) : null}
                      </>
                    }
                  >
                    <ActionForm
                      action={updateGuide}
                      submitLabel="Save guide"
                      extraActions={
                        <DeleteForm
                          action={deleteGuide}
                          id={guide.id}
                          label="Delete guide"
                          confirmMessage={`Delete "${guide.title}"? Existing leads are kept, but the guide disappears from the site.`}
                        />
                      }
                    >
                      <input type="hidden" name="id" value={guide.id} />
                      <GuideFields guide={guide} />
                    </ActionForm>
                  </Collapsible>
                ))}
              </div>
            )}

            <AddPanel label="Add a guide">
              <ActionForm
                action={createGuide}
                submitLabel="Create guide"
                pendingLabel="Creating..."
                resetOnSuccess
              >
                <GuideFields />
              </ActionForm>
            </AddPanel>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
