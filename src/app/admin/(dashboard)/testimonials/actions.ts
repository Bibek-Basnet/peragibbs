"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { idSchema, runAdminAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { consumeUpload, deleteUpload } from "@/lib/uploads";
import {
  testimonialSchema,
  testimonialsSectionSchema,
} from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";

export async function saveTestimonialsSection(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(testimonialsSectionSchema, formData, async (data) => {
    await prisma.testimonialsSection.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return "Section copy saved.";
  });
}

/**
 * Moves an uploaded photo into /public and rewrites `photoUrl` to point at it.
 * Returns an error state the form can show verbatim when the file is refused.
 */
async function attachPhoto(formData: FormData) {
  const upload = await consumeUpload(formData, {
    field: "photoFile",
    kind: "image",
    currentPath: String(formData.get("photoUrl") ?? ""),
    nameHint: String(formData.get("name") ?? "testimonial"),
  });

  if (!upload.ok) return upload;

  formData.set("photoUrl", upload.path);
  return upload;
}

export async function createTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const upload = await attachPhoto(formData);
  if (!upload.ok) return { ok: false, message: upload.message };

  if (!formData.get("photoUrl")) {
    return { ok: false, message: "Please choose a photo for this testimonial." };
  }

  return runAdminAction(testimonialSchema, formData, async (data) => {
    await prisma.testimonial.create({ data });
    return `Testimonial from ${data.name} created.`;
  });
}

export async function updateTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.testimonial.findUnique({
    where: { id },
    select: { photoUrl: true },
  });

  const upload = await attachPhoto(formData);
  if (!upload.ok) return { ok: false, message: upload.message };

  const schema = testimonialSchema.extend({ id: z.string().min(1) });
  const result = await runAdminAction(
    schema,
    formData,
    async ({ id: recordId, ...data }) => {
      await prisma.testimonial.update({ where: { id: recordId }, data });
      return `Testimonial from ${data.name} saved.`;
    },
  );

  // Only bin the old file once the row actually points somewhere else.
  if (result?.ok && upload.changed && existing?.photoUrl !== upload.path) {
    await deleteUpload(existing?.photoUrl);
  }

  return result;
}

export async function deleteTestimonial(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    const removed = await prisma.testimonial.delete({ where: { id } });
    await deleteUpload(removed.photoUrl);
    return "Testimonial deleted.";
  });
}

const flagSchema = z.object({
  id: z.string().min(1),
  field: z.enum(["isPinned", "isPublished"]),
  value: z.enum(["true", "false"]),
});

/** One-click pin/unpin and publish/unpublish from the list view. */
export async function toggleTestimonialFlag(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(flagSchema, formData, async ({ id, field, value }) => {
    const next = value === "true";
    await prisma.testimonial.update({
      where: { id },
      data: { [field]: next },
    });

    if (field === "isPinned") {
      return next ? "Pinned to the home page." : "Unpinned from the home page.";
    }
    return next ? "Published." : "Unpublished.";
  });
}
