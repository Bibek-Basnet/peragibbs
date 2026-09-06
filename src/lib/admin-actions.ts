import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { revalidatePublicContent } from "@/lib/revalidate";
import type { ActionState } from "@/components/admin/ui";

function firstIssueMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Please check the form and try again.";
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function isMissingRecordError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2025"
  );
}

/**
 * Shared plumbing for every admin server action:
 * authenticate, validate, run, revalidate the public pages, report back.
 *
 * The auth check runs before the try block so `redirect()` is not swallowed.
 */
export async function runAdminAction<Schema extends z.ZodType>(
  schema: Schema,
  formData: FormData,
  handler: (data: z.infer<Schema>) => Promise<string>,
  options: { revalidate?: boolean } = {},
): Promise<ActionState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: firstIssueMessage(parsed.error) };
  }

  let message: string;
  try {
    message = await handler(parsed.data);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "That slug or email is already in use. Pick another.",
      };
    }
    if (isMissingRecordError(error)) {
      return { ok: false, message: "That record no longer exists." };
    }
    console.error("[admin action] failed", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }

  if (options.revalidate !== false) {
    revalidatePublicContent();
  }

  return { ok: true, message, token: crypto.randomUUID() };
}

/**
 * Same guarantees as runAdminAction, but hands the raw FormData to the
 * handler. Use for forms with dynamic field names, such as the comparison
 * table grid where one input exists per tier.
 */
export async function runAdminFormAction(
  formData: FormData,
  handler: (formData: FormData) => Promise<string>,
  options: { revalidate?: boolean } = {},
): Promise<ActionState> {
  await requireAdmin();

  let message: string;
  try {
    message = await handler(formData);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, message: "That value is already in use." };
    }
    if (isMissingRecordError(error)) {
      return { ok: false, message: "That record no longer exists." };
    }
    console.error("[admin action] failed", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }

  if (options.revalidate !== false) {
    revalidatePublicContent();
  }

  return { ok: true, message, token: crypto.randomUUID() };
}

export const idSchema = z.object({ id: z.string().min(1) });

export function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing ${key}.`);
  }
  return value.trim();
}
