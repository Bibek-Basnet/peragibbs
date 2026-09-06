import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { guideLeadSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendGuideLeadNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 6;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`leads:${ip}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = guideLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the details and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot - silently accept so bots do not learn they were caught.
  if (data.company && data.company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  if (!data.consent) {
    return NextResponse.json(
      { error: "Please accept the privacy policy to continue." },
      { status: 400 },
    );
  }

  const guide = await prisma.guide.findUnique({
    where: { slug: data.guideSlug },
    select: { id: true, title: true },
  });

  try {
    const lead = await prisma.guideLead.create({
      data: {
        guideId: guide?.id ?? null,
        guideSlug: data.guideSlug,
        guideTitle: guide?.title ?? data.guideTitle ?? data.guideSlug,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        interest: data.interest,
        consent: data.consent,
        ipAddress: ip,
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
      select: { id: true, guideTitle: true },
    });

    // Notification failures must never block the download.
    void sendGuideLeadNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      interest: data.interest,
      guideTitle: lead.guideTitle,
      guideSlug: data.guideSlug,
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("[api/leads] failed to store lead", error);
    return NextResponse.json(
      { error: "Something went wrong - please try again." },
      { status: 500 },
    );
  }
}
