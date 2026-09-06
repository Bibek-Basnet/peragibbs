"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  idSchema,
  requiredString,
  runAdminAction,
  runAdminFormAction,
} from "@/lib/admin-actions";
import {
  coachingTierSchema,
  compareGroupSchema,
  compareRowSchema,
  inPersonOptionSchema,
  serviceStepSchema,
  servicesSectionSchema,
} from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";
import type { CompareCellKind } from "@prisma/client";

// --- Section copy -----------------------------------------------------------

export async function saveServicesSection(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(servicesSectionSchema, formData, async (data) => {
    await prisma.servicesSection.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return "Section copy saved.";
  });
}

// --- Tiers ------------------------------------------------------------------

export async function createTier(_prev: ActionState, formData: FormData) {
  return runAdminAction(coachingTierSchema, formData, async (data) => {
    const tier = await prisma.coachingTier.create({ data });

    // Give the new tier an empty cell in every existing comparison row so the
    // table stays rectangular.
    const rows = await prisma.compareRow.findMany({ select: { id: true } });
    if (rows.length > 0) {
      await prisma.compareCell.createMany({
        data: rows.map((row) => ({
          rowId: row.id,
          tierId: tier.id,
          kind: "NO" as CompareCellKind,
        })),
        skipDuplicates: true,
      });
    }

    return `Tier "${data.name}" created.`;
  });
}

export async function updateTier(_prev: ActionState, formData: FormData) {
  const schema = coachingTierSchema.extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.coachingTier.update({ where: { id }, data });
    return `Tier "${data.name}" saved.`;
  });
}

export async function deleteTier(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.coachingTier.delete({ where: { id } });
    return "Tier deleted.";
  });
}

// --- How it works steps -----------------------------------------------------

export async function createStep(_prev: ActionState, formData: FormData) {
  return runAdminAction(serviceStepSchema, formData, async (data) => {
    await prisma.serviceStep.create({ data });
    return "Step added.";
  });
}

export async function updateStep(_prev: ActionState, formData: FormData) {
  const schema = serviceStepSchema.extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.serviceStep.update({ where: { id }, data });
    return "Step saved.";
  });
}

export async function deleteStep(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.serviceStep.delete({ where: { id } });
    return "Step deleted.";
  });
}

// --- Comparison table -------------------------------------------------------

export async function createCompareGroup(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(compareGroupSchema, formData, async (data) => {
    await prisma.compareGroup.create({ data });
    return "Group added.";
  });
}

export async function updateCompareGroup(
  _prev: ActionState,
  formData: FormData,
) {
  const schema = compareGroupSchema.extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.compareGroup.update({ where: { id }, data });
    return "Group saved.";
  });
}

export async function deleteCompareGroup(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.compareGroup.delete({ where: { id } });
    return "Group deleted.";
  });
}

export async function createCompareRow(_prev: ActionState, formData: FormData) {
  return runAdminAction(compareRowSchema, formData, async (data) => {
    const tiers = await prisma.coachingTier.findMany({ select: { id: true } });
    await prisma.compareRow.create({
      data: {
        ...data,
        cells: {
          create: tiers.map((tier) => ({
            tierId: tier.id,
            kind: "NO" as CompareCellKind,
          })),
        },
      },
    });
    return "Row added.";
  });
}

export async function deleteCompareRow(_prev: ActionState, formData: FormData) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.compareRow.delete({ where: { id } });
    return "Row deleted.";
  });
}

const CELL_KINDS = new Set(["TEXT", "YES", "NO"]);

/**
 * Saves a comparison row's label plus one cell per tier in a single form.
 * Field names are `kind__<tierId>` and `text__<tierId>`.
 */
export async function saveCompareRow(_prev: ActionState, formData: FormData) {
  return runAdminFormAction(formData, async (fd) => {
    const rowId = requiredString(fd, "rowId");
    const label = requiredString(fd, "label");
    const sortOrderRaw = fd.get("sortOrder");
    const sortOrder = Number.parseInt(String(sortOrderRaw ?? "0"), 10);

    const cellUpdates: {
      tierId: string;
      kind: CompareCellKind;
      text: string | null;
    }[] = [];

    for (const [key, value] of fd.entries()) {
      if (!key.startsWith("kind__")) continue;
      const tierId = key.slice("kind__".length);
      const kind = String(value);
      if (!CELL_KINDS.has(kind)) continue;

      const text = fd.get(`text__${tierId}`);
      cellUpdates.push({
        tierId,
        kind: kind as CompareCellKind,
        text:
          kind === "TEXT" && typeof text === "string" && text.trim().length > 0
            ? text.trim()
            : null,
      });
    }

    await prisma.$transaction([
      prisma.compareRow.update({
        where: { id: rowId },
        data: {
          label,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        },
      }),
      ...cellUpdates.map((cell) =>
        prisma.compareCell.upsert({
          where: { rowId_tierId: { rowId, tierId: cell.tierId } },
          update: { kind: cell.kind, text: cell.text },
          create: {
            rowId,
            tierId: cell.tierId,
            kind: cell.kind,
            text: cell.text,
          },
        }),
      ),
    ]);

    return "Row saved.";
  });
}

// --- In-person options ------------------------------------------------------

export async function createInPersonOption(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(inPersonOptionSchema, formData, async (data) => {
    await prisma.inPersonOption.create({ data });
    return "Option added.";
  });
}

export async function updateInPersonOption(
  _prev: ActionState,
  formData: FormData,
) {
  const schema = inPersonOptionSchema.extend({ id: z.string().min(1) });
  return runAdminAction(schema, formData, async ({ id, ...data }) => {
    await prisma.inPersonOption.update({ where: { id }, data });
    return "Option saved.";
  });
}

export async function deleteInPersonOption(
  _prev: ActionState,
  formData: FormData,
) {
  return runAdminAction(idSchema, formData, async ({ id }) => {
    await prisma.inPersonOption.delete({ where: { id } });
    return "Option deleted.";
  });
}
