"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { idSchema, runAdminAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { consumeUpload, deleteUpload } from "@/lib/uploads";
import { guideSchema, guidesSectionSchema } from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";

export async function saveGuidesSection(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(guidesSectionSchema, formData, async (data) => {
    await prisma.guidesSection.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return "Section copy saved.";
  });
}

/**
 * Handles both of a guide's files: the downloadable PDF and the cover image.
 * Each keeps its existing path when no new file is chosen.
 */
async function attachFiles(formData: FormData) {
  const hint = String(formData.get("slug") ?? "guide");

  const pdf = await consumeUpload(formData, {
    field: "pdfFile",
    kind: "document",
    currentPath: String(formData.get("fileUrl") ?? ""),
    nameHint: hint,
  });
  if (!pdf.ok) return { ok: false as const, message: pdf.message };
  formData.set("fileUrl", pdf.path);

  const cover = await consumeUpload(formData, {
    field: "coverFile",
    kind: "image",
    currentPath: String(formData.get("imageUrl") ?? ""),
    nameHint: `${hint}-cover`,
  });
  if (!cover.ok) return { ok: false as const, message: cover.message };
  formData.set("imageUrl", cover.path);

  return { ok: true as const, pdf, cover };
}

export async function createGuide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const files = await attachFiles(formData);
  if (!files.ok) return { ok: false, message: files.message };

  if (!formData.get("fileUrl")) {
    return { ok: false, message: "Please upload the guide PDF." };
  }
  if (!formData.get("imageUrl")) {
    return { ok: false, message: "Please upload a cover image for this guide." };
  }

  return runAdminAction(guideSchema, formData, async (data) => {
    await prisma.guide.create({ data });
    return `Guide "${data.title}" created.`;
  });
}

export async function updateGuide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.guide.findUnique({
    where: { id },
    select: { fileUrl: true, imageUrl: true },
  });

  const files = await attachFiles(formData);
  if (!files.ok) return { ok: false, message: files.message };

  const schema = guideSchema.extend({ id: z.string().min(1) });
  const result = await runAdminAction(
    schema,
    formData,
    async ({ id: recordId, ...data }) => {
      await prisma.guide.update({ where: { id: recordId }, data });
      return `Guide "${data.title}" saved.`;
    },
  );

  if (result?.ok) {
    if (files.pdf.changed && existing?.fileUrl !== files.pdf.path) {
      await deleteUpload(existing?.fileUrl);
    }
    if (files.cover.changed && existing?.imageUrl !== files.cover.path) {
      await deleteUpload(existing?.imageUrl);
    }
  }

  return result;
}

export async function deleteGuide(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    // Leads keep their denormalised guide title, so history survives.
    const removed = await prisma.guide.delete({ where: { id } });
    await deleteUpload(removed.fileUrl);
    await deleteUpload(removed.imageUrl);
    return "Guide deleted. Existing leads were kept.";
  });
}
