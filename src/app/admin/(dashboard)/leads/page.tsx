import {
  ArchiveIcon,
  DownloadSimpleIcon,
  NotePencilIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import ActionForm, {
  DeleteForm,
  QuickAction,
} from "@/components/admin/ActionForm";
import FilterBar, {
  type ActiveChip,
} from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import {
  Badge,
  EmptyState,
  Field,
  LinkButton,
  PageHeader,
  Textarea,
} from "@/components/admin/ui";
import type { LeadStatus, Prisma } from "@prisma/client";

import { deleteLead, saveLeadNotes, updateLeadStatus } from "./actions";

const PAGE_SIZE = 25;
const BASE = "/admin/leads";

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "CONVERTED", "ARCHIVED"];

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  ARCHIVED: "Archived",
};

const statusTone: Record<
  LeadStatus,
  "info" | "warning" | "success" | "neutral"
> = {
  NEW: "info",
  CONTACTED: "warning",
  CONVERTED: "success",
  ARCHIVED: "neutral",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    guide?: string;
    q?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const status = STATUSES.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : undefined;
  const guideSlug = params.guide?.trim() || undefined;
  const q = params.q?.trim() || "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const where: Prisma.GuideLeadWhereInput = {
    ...(status ? { status } : {}),
    ...(guideSlug ? { guideSlug } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { interest: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [leads, total, guides, statusCounts] = await Promise.all([
    prisma.guideLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.guideLead.count({ where }),
    prisma.guide.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    }),
    prisma.guideLead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countFor = (s: LeadStatus) =>
    statusCounts.find((c) => c.status === s)?._count._all ?? 0;

  function withParams(overrides: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { status, guide: guideSlug, q, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      if (value) sp.set(key, value);
    }
    const qs = sp.toString();
    return qs ? `${BASE}?${qs}` : BASE;
  }

  const chips: ActiveChip[] = [
    ...(q
      ? [{ label: "Search", value: q, removeHref: withParams({ q: undefined }) }]
      : []),
    ...(status
      ? [
          {
            label: "Status",
            value: STATUS_LABEL[status],
            removeHref: withParams({ status: undefined }),
          },
        ]
      : []),
    ...(guideSlug
      ? [
          {
            label: "Guide",
            value:
              guides.find((g) => g.slug === guideSlug)?.title ?? guideSlug,
            removeHref: withParams({ guide: undefined }),
          },
        ]
      : []),
  ];

  const exportParams = new URLSearchParams();
  if (status) exportParams.set("status", status);
  if (guideSlug) exportParams.set("guide", guideSlug);

  return (
    <>
      <PageHeader
        icon={UsersThreeIcon}
        eyebrow="Programme Guides"
        title="Guide leads"
        description="Every submission of the guide download form, newest first."
        actions={
          <LinkButton
            href={`/api/admin/leads/export?${exportParams.toString()}`}
            icon={DownloadSimpleIcon}
            external
          >
            Export CSV
          </LinkButton>
        }
      />

      <FilterBar
        basePath={BASE}
        search={q}
        searchPlaceholder="Search name, email or interest"
        selects={[
          {
            name: "status",
            label: "Status",
            value: status ?? "",
            allLabel: "All statuses",
            options: STATUSES.map((s) => ({
              value: s,
              label: STATUS_LABEL[s],
              count: countFor(s),
            })),
          },
          {
            name: "guide",
            label: "Guide",
            value: guideSlug ?? "",
            allLabel: "All guides",
            options: guides.map((g) => ({ value: g.slug, label: g.title })),
          },
        ]}
        chips={chips}
        total={total}
        noun="lead"
      />

      {leads.length === 0 ? (
        <EmptyState icon={UsersThreeIcon} title="Nothing here">
          {chips.length > 0
            ? "No leads match these filters. Try resetting them."
            : "Guide download submissions will appear here."}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(15,17,21,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-4 md:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-ui text-sm font-semibold text-ink">
                      {lead.name}
                    </h2>
                    <Badge tone={statusTone[lead.status]}>
                      {STATUS_LABEL[lead.status]}
                    </Badge>
                  </div>

                  <p className="mt-1 font-ui text-sm text-ink">
                    <a
                      href={`mailto:${lead.email}`}
                      className="underline underline-offset-2 hover:text-navy"
                    >
                      {lead.email}
                    </a>
                    {lead.phone ? (
                      <>
                        <span className="text-grey"> · </span>
                        <a
                          href={`tel:${lead.phone}`}
                          className="underline underline-offset-2 hover:text-navy"
                        >
                          {lead.phone}
                        </a>
                      </>
                    ) : null}
                  </p>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-ui text-xs text-grey">
                    <span className="rounded bg-canvas px-1.5 py-0.5">
                      {lead.guideTitle}
                    </span>
                    <span>{lead.role.toLowerCase()}</span>
                    <span>·</span>
                    <span>{lead.interest}</span>
                    <span>·</span>
                    <span>{formatDate(lead.createdAt)}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter((s) => s !== lead.status).map((s) => (
                    <QuickAction
                      key={s}
                      action={updateLeadStatus}
                      fields={{ id: lead.id, status: s }}
                      label={STATUS_LABEL[s]}
                      icon={
                        s === "ARCHIVED" ? (
                          <ArchiveIcon size={13} weight="bold" />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </div>

              <details className="group border-t border-line">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 font-ui text-[13px] font-medium text-navy transition-colors hover:bg-canvas md:px-5">
                  <NotePencilIcon size={14} weight="bold" />
                  <span className="group-open:hidden">
                    {lead.notes ? "Notes added" : "Add notes"}
                  </span>
                  <span className="hidden group-open:inline">Close</span>
                </summary>
                <div className="border-t border-line bg-canvas/40 px-4 py-5 md:px-5">
                  <ActionForm
                    action={saveLeadNotes}
                    submitLabel="Save notes"
                    extraActions={
                      <DeleteForm
                        action={deleteLead}
                        id={lead.id}
                        label="Delete lead"
                        confirmMessage={`Delete the lead from ${lead.name}?`}
                      />
                    }
                  >
                    <input type="hidden" name="id" value={lead.id} />
                    <Field label="Internal notes">
                      <Textarea
                        name="notes"
                        rows={3}
                        defaultValue={lead.notes ?? ""}
                        placeholder="Called 12 Mar - keen on the Intermediate tier."
                      />
                    </Field>
                    <p className="mt-3 font-ui text-xs text-grey">
                      Consent given: {lead.consent ? "yes" : "no"}
                      {lead.ipAddress ? ` · IP ${lead.ipAddress}` : ""}
                    </p>
                  </ActionForm>
                </div>
              </details>
            </article>
          ))}
        </div>
      )}

      <Pagination
        basePath={BASE}
        params={{ status, guide: guideSlug, q: q || undefined }}
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
