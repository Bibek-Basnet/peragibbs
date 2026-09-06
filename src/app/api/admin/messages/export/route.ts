import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import type { MessageStatus, Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = new Set(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");

  const where: Prisma.ContactSubmissionWhereInput =
    statusParam && STATUSES.has(statusParam)
      ? { status: statusParam as MessageStatus }
      : {};

  const messages = await prisma.contactSubmission.findMany({
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
      "Message",
      "Status",
      "Email delivery",
      "Email error",
    ],
    messages.map((m) => [
      m.createdAt,
      m.name,
      m.email,
      m.phone,
      m.role,
      m.message,
      m.status,
      m.emailStatus,
      m.emailError,
    ]),
  );

  const stamp = new Date().toISOString().slice(0, 10);
  return csvResponse(`contact-messages-${stamp}.csv`, csv);
}
