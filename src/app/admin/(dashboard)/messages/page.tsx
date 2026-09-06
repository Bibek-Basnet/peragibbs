import {
  ArchiveIcon,
  ArrowClockwiseIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  PaperPlaneTiltIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { emailIsConfigured } from "@/lib/email";
import { DeleteForm, QuickAction } from "@/components/admin/ActionForm";
import FilterBar, { type ActiveChip } from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import {
  Badge,
  EmptyState,
  LinkButton,
  PageHeader,
} from "@/components/admin/ui";
import type { MessageStatus, Prisma } from "@prisma/client";

import {
  deleteMessage,
  resendNotification,
  updateMessageStatus,
} from "./actions";

const PAGE_SIZE = 25;
const BASE = "/admin/messages";

const STATUSES: MessageStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

const STATUS_LABEL: Record<MessageStatus, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

const statusTone: Record<
  MessageStatus,
  "info" | "warning" | "success" | "neutral"
> = {
  NEW: "info",
  READ: "warning",
  REPLIED: "success",
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

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const status = STATUSES.includes(params.status as MessageStatus)
    ? (params.status as MessageStatus)
    : undefined;
  const q = params.q?.trim() || "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const where: Prisma.ContactSubmissionWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { message: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [messages, total, statusCounts] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countFor = (s: MessageStatus) =>
    statusCounts.find((c) => c.status === s)?._count._all ?? 0;

  function withParams(overrides: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { status, q, ...overrides };
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
  ];

  return (
    <>
      <PageHeader
        icon={EnvelopeSimpleIcon}
        eyebrow="Contact form"
        title="Messages"
        description="Every contact form submission, stored before the notification email is attempted."
        actions={
          <LinkButton
            href={`/api/admin/messages/export${status ? `?status=${status}` : ""}`}
            icon={DownloadSimpleIcon}
            external
          >
            Export CSV
          </LinkButton>
        }
      />

      {!emailIsConfigured ? (
        <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <WarningCircleIcon
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-amber-600"
          />
          <p className="font-ui text-sm leading-relaxed text-amber-900">
            RESEND_API_KEY is not set, so notification emails are skipped.
            Messages below are still captured in full.
          </p>
        </div>
      ) : null}

      <FilterBar
        basePath={BASE}
        search={q}
        searchPlaceholder="Search name, email or message text"
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
        ]}
        chips={chips}
        total={total}
        noun="message"
      />

      {messages.length === 0 ? (
        <EmptyState icon={EnvelopeSimpleIcon} title="Nothing here">
          {chips.length > 0
            ? "No messages match these filters. Try resetting them."
            : "Contact form submissions will appear here."}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <article
              key={m.id}
              className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(15,17,21,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-4 md:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-ui text-sm font-semibold text-ink">
                      {m.name}
                    </h2>
                    <Badge tone={statusTone[m.status]}>
                      {STATUS_LABEL[m.status]}
                    </Badge>
                    {m.emailStatus === "FAILED" ? (
                      <Badge tone="danger">Email failed</Badge>
                    ) : null}
                    {m.emailStatus === "SKIPPED" ? (
                      <Badge tone="warning">Email skipped</Badge>
                    ) : null}
                  </div>

                  <p className="mt-1 font-ui text-sm text-ink">
                    <a
                      href={`mailto:${m.email}`}
                      className="underline underline-offset-2 hover:text-navy"
                    >
                      {m.email}
                    </a>
                    {m.phone ? (
                      <>
                        <span className="text-grey"> · </span>
                        <a
                          href={`tel:${m.phone}`}
                          className="underline underline-offset-2 hover:text-navy"
                        >
                          {m.phone}
                        </a>
                      </>
                    ) : null}
                  </p>

                  <p className="mt-1.5 font-ui text-xs text-grey">
                    {m.role ? `${m.role.toLowerCase()} · ` : ""}
                    {formatDate(m.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter((s) => s !== m.status).map((s) => (
                    <QuickAction
                      key={s}
                      action={updateMessageStatus}
                      fields={{ id: m.id, status: s }}
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

              <div className="border-t border-line bg-canvas/40 px-4 py-4 md:px-5">
                <blockquote className="whitespace-pre-wrap border-l-2 border-navy/30 pl-3.5 font-ui text-sm leading-relaxed text-ink">
                  {m.message}
                </blockquote>

                {m.emailError ? (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 font-ui text-xs text-red-700">
                    Email error: {m.emailError}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your enquiry - Pera Gibbs Movement")}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 font-ui text-sm font-medium text-paper transition-colors hover:bg-navy"
                  >
                    <PaperPlaneTiltIcon size={15} weight="bold" />
                    Reply by email
                  </a>

                  {m.emailStatus !== "SENT" ? (
                    <QuickAction
                      action={resendNotification}
                      fields={{ id: m.id }}
                      label="Retry notification"
                      icon={<ArrowClockwiseIcon size={13} weight="bold" />}
                    />
                  ) : null}

                  <DeleteForm
                    action={deleteMessage}
                    id={m.id}
                    label="Delete"
                    confirmMessage={`Delete the message from ${m.name}?`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        basePath={BASE}
        params={{ status, q: q || undefined }}
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
