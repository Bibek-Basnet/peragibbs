"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { idSchema, runAdminAction } from "@/lib/admin-actions";
import { leadStatusSchema } from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";

const statusSchema = z.object({
  id: z.string().min(1),
  status: leadStatusSchema,
});

export async function updateLeadStatus(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(
    statusSchema,
    formData,
    async ({ id, status }) => {
      await prisma.guideLead.update({ where: { id }, data: { status } });
      return `Marked as ${status.toLowerCase()}.`;
    },
    // Leads never appear on the public site, so no need to rebuild it.
    { revalidate: false },
  );
}

const notesSchema = z.object({
  id: z.string().min(1),
  notes: z.string().max(4000),
});

export async function saveLeadNotes(_prev: ActionState, formData: FormData) {
  return runAdminAction(
    notesSchema,
    formData,
    async ({ id, notes }) => {
      await prisma.guideLead.update({
        where: { id },
        data: { notes: notes.trim() || null },
      });
      return "Notes saved.";
    },
    { revalidate: false },
  );
}

export async function deleteLead(_prev: ActionState, formData: FormData) {
  return runAdminAction(
    idSchema,
    formData,
    async ({ id }) => {
      await prisma.guideLead.delete({ where: { id } });
      return "Lead deleted.";
    },
    { revalidate: false },
  );
}
