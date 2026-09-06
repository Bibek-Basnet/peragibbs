import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import type { LeadStatus, Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = new Set(["NEW", "CONTACTED", "CONVERTED", "ARCHIVED"]);

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  const guideParam = request.nextUrl.searchParams.get("guide");

  const where: Prisma.GuideLeadWhereInput = {
    ...(statusParam && STATUSES.has(statusParam)
      ? { status: statusParam as LeadStatus }
      : {}),
    ...(guideParam ? { guideSlug: guideParam } : {}),
  };

  const leads = await prisma.guideLead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10_000,
  });

  const csv = toCsv(
    [
      "Submitted",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Interest",
      "Guide",
      "Guide slug",
      "Consent",
      "Status",
      "Notes",
    ],
    leads.map((l) => [
      l.createdAt,
      l.name,
      l.email,
      l.phone,
      l.role,
      l.interest,
      l.guideTitle,
      l.guideSlug,
      l.consent ? "yes" : "no",
      l.status,
      l.notes,
    ]),
  );

  const stamp = new Date().toISOString().slice(0, 10);
  return csvResponse(`guide-leads-${stamp}.csv`, csv);
}
