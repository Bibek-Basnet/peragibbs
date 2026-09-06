"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { idSchema, runAdminAction } from "@/lib/admin-actions";
import {
  skillHighlightSchema,
  skillSchema,
  skillsSectionSchema,
} from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";

export async function saveSkillsSection(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(skillsSectionSchema, formData, async (data) => {
    await prisma.skillsSection.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return "Section copy saved.";
  });
}

export async function createSkill(_prev: ActionState, formData: FormData) {
  return runAdminAction(skillSchema, formData, async (data) => {
    await prisma.skill.create({ data });
    return `Skill "${data.title}" created.`;
  });
}

export async function updateSkill(_prev: ActionState, formData: FormData) {
  const schema = skillSchema.extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.skill.update({ where: { id }, data });
    return `Skill "${data.title}" saved.`;
  });
}

export async function deleteSkill(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.skill.delete({ where: { id } });
    return "Skill deleted.";
  });
}

export async function createHighlight(_prev: ActionState, formData: FormData) {
  return runAdminAction(skillHighlightSchema, formData, async (data) => {
    await prisma.skillHighlight.create({ data });
    return "Highlight added.";
  });
}

export async function updateHighlight(_prev: ActionState, formData: FormData) {
  const schema = skillHighlightSchema
    .omit({ skillId: true })
    .extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.skillHighlight.update({ where: { id }, data });
    return "Highlight saved.";
  });
}

export async function deleteHighlight(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.skillHighlight.delete({ where: { id } });
    return "Highlight deleted.";
  });
}
