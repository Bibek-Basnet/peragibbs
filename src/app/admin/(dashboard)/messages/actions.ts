"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { idSchema, runAdminAction } from "@/lib/admin-actions";
import { messageStatusSchema } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";
import type { ActionState } from "@/components/admin/ui";

const statusSchema = z.object({
  id: z.string().min(1),
  status: messageStatusSchema,
});

export async function updateMessageStatus(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(
    statusSchema,
    formData,
    async ({ id, status }) => {
      await prisma.contactSubmission.update({ where: { id }, data: { status } });
      return `Marked as ${status.toLowerCase()}.`;
    },
    { revalidate: false },
  );
}

export async function deleteMessage(_prev: ActionState, formData: FormData) {
  return runAdminAction(
    idSchema,
    formData,
    async ({ id }) => {
      await prisma.contactSubmission.delete({ where: { id } });
      return "Message deleted.";
    },
    { revalidate: false },
  );
}

/** Retries a notification email that Resend failed to deliver. */
export async function resendNotification(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(
    idSchema,
    formData,
    async ({ id }) => {
      const submission = await prisma.contactSubmission.findUnique({
        where: { id },
      });
      if (!submission) throw new Error("That message no longer exists.");

      const result = await sendContactNotification({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        role: submission.role,
        message: submission.message,
      });

      await prisma.contactSubmission.update({
        where: { id },
        data:
          result.status === "SENT"
            ? { emailStatus: "SENT", emailId: result.id, emailError: null }
            : result.status === "SKIPPED"
              ? { emailStatus: "SKIPPED", emailError: result.reason }
              : {
                  emailStatus: "FAILED",
                  emailError: result.error.slice(0, 500),
                },
      });

      if (result.status === "SENT") return "Notification sent.";
      if (result.status === "SKIPPED") {
        throw new Error(`Not sent: ${result.reason}`);
      }
      throw new Error(`Resend rejected it: ${result.error}`);
    },
    { revalidate: false },
  );
}
