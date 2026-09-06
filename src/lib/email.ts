import "server-only";

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.CONTACT_FROM_EMAIL ?? "Pera Gibbs Movement <onboarding@resend.dev>";
const toAddress = process.env.CONTACT_TO_EMAIL ?? "admin@peragibbsmovement.com";
const replyEnabled = process.env.CONTACT_AUTOREPLY !== "false";

const resend = apiKey ? new Resend(apiKey) : null;

export type SendResult =
  | { status: "SENT"; id: string | null }
  | { status: "SKIPPED"; reason: string }
  | { status: "FAILED"; error: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#6b6b68;font:600 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0a0a0a;font:400 14px/1.6 Arial,sans-serif;">${escapeHtml(value).replace(/\n/g, "<br />")}</td>
  </tr>`;
}

function shell(title: string, bodyRows: string, footer?: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#fafaf8;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e6e2;border-radius:12px;">
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0 0 18px;font:700 13px/1.2 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#3373b0;">Pera Gibbs Movement</p>
      <h1 style="margin:0 0 20px;font:700 20px/1.3 Arial,sans-serif;color:#0a0a0a;">${escapeHtml(title)}</h1>
      <table role="presentation" style="width:100%;border-collapse:collapse;">${bodyRows}</table>
    </td></tr>
    ${
      footer
        ? `<tr><td style="padding:16px 28px 28px;border-top:1px solid #eeeeea;color:#6b6b68;font:400 12px/1.6 Arial,sans-serif;">${footer}</td></tr>`
        : ""
    }
  </table>
</body></html>`;
}

async function send(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!resend) {
    return { status: "SKIPPED", reason: "RESEND_API_KEY is not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });

    if (error) {
      return { status: "FAILED", error: error.message ?? String(error) };
    }
    return { status: "SENT", id: data?.id ?? null };
  } catch (err) {
    return {
      status: "FAILED",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  message: string;
};

export async function sendContactNotification(payload: ContactEmailPayload) {
  const rows = [
    row("Name", payload.name),
    row("Email", payload.email),
    row("Phone", payload.phone),
    row("Reaching out as", payload.role ? payload.role.toLowerCase() : null),
    row("Message", payload.message),
  ].join("");

  const text = [
    `New enquiry from ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.role ? `Reaching out as: ${payload.role.toLowerCase()}` : null,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  return send({
    to: toAddress,
    subject: `New enquiry from ${payload.name}`,
    html: shell(
      "New enquiry",
      rows,
      "Reply directly to this email to respond to the sender.",
    ),
    text,
    replyTo: payload.email,
  });
}

export async function sendContactAcknowledgement(payload: ContactEmailPayload) {
  if (!replyEnabled) {
    return { status: "SKIPPED", reason: "Auto-reply disabled" } as const;
  }

  const rows = `<tr><td colspan="2" style="padding:0;color:#0a0a0a;font:400 14px/1.7 Arial,sans-serif;">
    <p style="margin:0 0 14px;">Thanks ${escapeHtml(payload.name.split(" ")[0] ?? payload.name)} - your message landed with me.</p>
    <p style="margin:0 0 14px;">I read every enquiry personally and will come back to you shortly to talk through the right programme.</p>
    <p style="margin:0;color:#6b6b68;">Here is what you sent:</p>
    <p style="margin:8px 0 0;padding:12px 14px;background:#fafaf8;border-left:3px solid #3373b0;color:#0a0a0a;">${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
  </td></tr>`;

  return send({
    to: payload.email,
    subject: "Thanks for getting in touch - Pera Gibbs Movement",
    html: shell("Message received", rows, "Pera Gibbs Movement"),
    text: `Thanks ${payload.name} - your message landed with me. I will come back to you shortly.\n\nYour message:\n${payload.message}`,
    replyTo: toAddress,
  });
}

// ---------------------------------------------------------------------------
// Programme Guide leads
// ---------------------------------------------------------------------------

export type GuideLeadEmailPayload = {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  interest: string;
  guideTitle: string;
  guideSlug: string;
};

export async function sendGuideLeadNotification(
  payload: GuideLeadEmailPayload,
) {
  const rows = [
    row("Guide", `${payload.guideTitle} (${payload.guideSlug})`),
    row("Name", payload.name),
    row("Email", payload.email),
    row("Phone", payload.phone),
    row("Reaching out as", payload.role.toLowerCase()),
    row("Primary interest", payload.interest),
  ].join("");

  return send({
    to: toAddress,
    subject: `Guide download - ${payload.name}`,
    html: shell("New guide download", rows),
    text: `New guide download\nGuide: ${payload.guideTitle}\nName: ${payload.name}\nEmail: ${payload.email}\nInterest: ${payload.interest}`,
    replyTo: payload.email,
  });
}

export const emailIsConfigured = Boolean(apiKey);
