import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  sendContactAcknowledgement,
  sendContactNotification,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`contact:${ip}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
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

  const parsed = contactSchema.safeParse(body);
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

  // Honeypot - accept silently.
  if (data.company && data.company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  // Store first: the message must survive an email outage.
  let submissionId: string;
  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        message: data.message,
        ipAddress: ip,
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
      select: { id: true },
    });
    submissionId = submission.id;
  } catch (error) {
    console.error("[api/contact] failed to store submission", error);
    return NextResponse.json(
      { error: "Something went wrong - please try again." },
      { status: 500 },
    );
  }

  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    message: data.message,
  };

  const result = await sendContactNotification(payload);

  await prisma.contactSubmission.update({
    where: { id: submissionId },
    data:
      result.status === "SENT"
        ? { emailStatus: "SENT", emailId: result.id, emailError: null }
        : result.status === "SKIPPED"
          ? { emailStatus: "SKIPPED", emailError: result.reason }
          : { emailStatus: "FAILED", emailError: result.error.slice(0, 500) },
  });

  if (result.status === "FAILED") {
    console.error("[api/contact] Resend delivery failed:", result.error);
  }

  // The sender's confirmation is a courtesy - never fail the request on it.
  void sendContactAcknowledgement(payload).catch(() => undefined);

  // The message is safely stored either way, so the visitor sees success.
  return NextResponse.json({ ok: true, id: submissionId }, { status: 201 });
}
