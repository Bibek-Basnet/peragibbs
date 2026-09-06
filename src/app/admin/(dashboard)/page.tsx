import Link from "next/link";
import {
  ChartLineUpIcon,
  EnvelopeSimpleIcon,
  FileArrowDownIcon,
  SquaresFourIcon,
  StarIcon,
  UsersThreeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { emailIsConfigured } from "@/lib/email";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
} from "@/components/admin/ui";
import {
  BarList,
  PipelineBar,
  StatTile,
  TrendChart,
  type TrendPoint,
} from "@/components/admin/Charts";

const TREND_DAYS = 30;

/** Local-date key, so days bucket by the coach's calendar rather than UTC. */
function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDaysAgo(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

function buildTrend(
  messageDates: Date[],
  leadDates: Date[],
  days: number,
): TrendPoint[] {
  const buckets = new Map<string, TrendPoint>();
  const start = startOfDaysAgo(days - 1);

  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dayKey(d);
    buckets.set(key, { date: key, messages: 0, leads: 0 });
  }

  for (const d of messageDates) {
    const bucket = buckets.get(dayKey(d));
    if (bucket) bucket.messages += 1;
  }
  for (const d of leadDates) {
    const bucket = buckets.get(dayKey(d));
    if (bucket) bucket.leads += 1;
  }

  return [...buckets.values()];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminDashboard() {
  await requireAdmin();

  const since = startOfDaysAgo(TREND_DAYS - 1);
  const prevSince = startOfDaysAgo(TREND_DAYS * 2 - 1);

  const [
    tierCount,
    skillCount,
    testimonialCount,
    pinnedCount,
    guideCount,
    totalLeads,
    totalMessages,
    failedEmails,
    messageDates,
    leadDates,
    prevMessages,
    prevLeads,
    leadStatus,
    messageStatus,
    leadsByGuide,
    recentLeads,
    recentMessages,
  ] = await Promise.all([
    prisma.coachingTier.count({ where: { isActive: true } }),
    prisma.skill.count({ where: { isActive: true } }),
    prisma.testimonial.count({ where: { isPublished: true } }),
    prisma.testimonial.count({ where: { isPublished: true, isPinned: true } }),
    prisma.guide.count({ where: { isActive: true } }),
    prisma.guideLead.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { emailStatus: "FAILED" } }),
    prisma.contactSubmission.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.guideLead.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.contactSubmission.count({
      where: { createdAt: { gte: prevSince, lt: since } },
    }),
    prisma.guideLead.count({
      where: { createdAt: { gte: prevSince, lt: since } },
    }),
    prisma.guideLead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.contactSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.guideLead.groupBy({
      by: ["guideTitle"],
      _count: { _all: true },
      orderBy: { _count: { guideTitle: "desc" } },
      take: 6,
    }),
    prisma.guideLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        guideTitle: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        emailStatus: true,
        createdAt: true,
      },
    }),
  ]);

  const trend = buildTrend(
    messageDates.map((m) => m.createdAt),
    leadDates.map((l) => l.createdAt),
    TREND_DAYS,
  );

  const messages30 = messageDates.length;
  const leads30 = leadDates.length;

  const countLead = (s: string) =>
    leadStatus.find((r) => r.status === s)?._count._all ?? 0;
  const countMessage = (s: string) =>
    messageStatus.find((r) => r.status === s)?._count._all ?? 0;

  function delta(current: number, previous: number) {
    if (previous === 0) {
      return current === 0
        ? "None in the previous 30 days either"
        : "vs none in the previous 30 days";
    }
    const pct = Math.round(((current - previous) / previous) * 100);
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct}% vs previous 30 days`;
  }

  return (
    <>
      <PageHeader
        icon={SquaresFourIcon}
        eyebrow="Overview"
        title="Dashboard"
        description="What is live on the site, and what has come in over the last 30 days."
      />

      {!emailIsConfigured ? (
        <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <WarningCircleIcon
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-amber-600"
          />
          <p className="font-ui text-sm leading-relaxed text-amber-900">
            <span className="font-semibold">Email is not configured.</span>{" "}
            RESEND_API_KEY is missing, so notifications are skipped. Enquiries
            are still saved and appear under Contact Messages.
          </p>
        </div>
      ) : null}

      {failedEmails > 0 ? (
        <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <WarningCircleIcon
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-red-600"
          />
          <p className="font-ui text-sm leading-relaxed text-red-900">
            {failedEmails} notification{failedEmails === 1 ? "" : "s"} failed to
            send. The messages are stored either way -{" "}
            <Link
              href="/admin/messages"
              className="font-semibold underline underline-offset-2"
            >
              open Contact Messages
            </Link>{" "}
            to retry.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Contact messages"
          value={messages30}
          hint={delta(messages30, prevMessages)}
          spark={trend.map((d) => d.messages)}
          accent="#2a78d6"
        />
        <StatTile
          label="Guide downloads"
          value={leads30}
          hint={delta(leads30, prevLeads)}
          spark={trend.map((d) => d.leads)}
          accent="#eb6834"
        />
        <StatTile
          label="Awaiting reply"
          value={countMessage("NEW") + countLead("NEW")}
          hint={`${countMessage("NEW")} messages, ${countLead("NEW")} leads`}
        />
        <StatTile
          label="Live on the site"
          value={`${tierCount} / ${skillCount} / ${guideCount}`}
          hint="Tiers, skills, guides"
        />
      </div>

      <Card className="mt-6">
        <CardHeader
          icon={ChartLineUpIcon}
          title="Submissions over time"
          description="Daily volume across both forms for the last 30 days."
        />
        <CardBody>
          <TrendChart data={trend} />
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            icon={FileArrowDownIcon}
            title="Downloads by guide"
            description="All time."
          />
          <CardBody>
            <BarList
              items={leadsByGuide.map((row) => ({
                label: row.guideTitle,
                value: row._count._all,
              }))}
              emptyLabel="No guide downloads yet."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={UsersThreeIcon}
            title="Lead pipeline"
            description={`${totalLeads} guide leads.`}
          />
          <CardBody>
            <PipelineBar
              stages={[
                { key: "NEW", label: "New", value: countLead("NEW") },
                {
                  key: "CONTACTED",
                  label: "Contacted",
                  value: countLead("CONTACTED"),
                },
                {
                  key: "CONVERTED",
                  label: "Converted",
                  value: countLead("CONVERTED"),
                },
                {
                  key: "ARCHIVED",
                  label: "Archived",
                  value: countLead("ARCHIVED"),
                },
              ]}
              emptyLabel="No guide leads yet."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={EnvelopeSimpleIcon}
            title="Message pipeline"
            description={`${totalMessages} contact messages.`}
          />
          <CardBody>
            <PipelineBar
              stages={[
                { key: "NEW", label: "New", value: countMessage("NEW") },
                { key: "READ", label: "Read", value: countMessage("READ") },
                {
                  key: "REPLIED",
                  label: "Replied",
                  value: countMessage("REPLIED"),
                },
                {
                  key: "ARCHIVED",
                  label: "Archived",
                  value: countMessage("ARCHIVED"),
                },
              ]}
              emptyLabel="No contact messages yet."
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            icon={EnvelopeSimpleIcon}
            title="Latest messages"
            actions={
              <Link
                href="/admin/messages"
                className="font-ui text-[13px] font-medium text-navy hover:underline"
              >
                View all
              </Link>
            }
          />
          <CardBody className="pt-2">
            {recentMessages.length === 0 ? (
              <EmptyState icon={EnvelopeSimpleIcon} title="Nothing yet">
                Contact form submissions land here.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {recentMessages.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-ui text-sm font-medium text-ink">
                        {m.name}
                      </p>
                      <p className="truncate font-ui text-xs text-grey">
                        {m.email} &middot; {formatDate(m.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {m.emailStatus === "FAILED" ? (
                        <Badge tone="danger">Email failed</Badge>
                      ) : null}
                      <Badge tone={m.status === "NEW" ? "info" : "neutral"}>
                        {m.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={UsersThreeIcon}
            title="Latest guide downloads"
            actions={
              <Link
                href="/admin/leads"
                className="font-ui text-[13px] font-medium text-navy hover:underline"
              >
                View all
              </Link>
            }
          />
          <CardBody className="pt-2">
            {recentLeads.length === 0 ? (
              <EmptyState icon={UsersThreeIcon} title="Nothing yet">
                Guide download forms land here.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {recentLeads.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-ui text-sm font-medium text-ink">
                        {l.name}
                      </p>
                      <p className="truncate font-ui text-xs text-grey">
                        {l.guideTitle} &middot; {formatDate(l.createdAt)}
                      </p>
                    </div>
                    <Badge tone={l.status === "NEW" ? "info" : "neutral"}>
                      {l.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <p className="mt-6 flex items-center gap-2 font-ui text-xs text-grey">
        <StarIcon size={13} weight="fill" className="text-navy" />
        {testimonialCount} published testimonials, {pinnedCount} pinned to the
        home page.
      </p>
    </>
  );
}
