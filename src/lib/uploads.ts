import "server-only";

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Uploads land in /public and are then served from the site's own origin, so
 * the rules here are deliberately strict:
 *
 *  - the stored filename is generated, never taken from the upload
 *  - the extension comes from the detected file signature, not the sent name
 *  - the browser-supplied MIME type is treated as a hint and re-checked
 *  - SVG is refused, because it can carry script
 */

export type UploadKind = "image" | "document";

type KindConfig = {
  label: string;
  directory: string;
  maxBytes: number;
  /** Human list used in help text and error messages. */
  accepts: string;
  /** `accept` attribute for the file input. */
  inputAccept: string;
};

export const UPLOAD_KINDS: Record<UploadKind, KindConfig> = {
  image: {
    label: "photo",
    directory: "images",
    maxBytes: 5 * 1024 * 1024,
    accepts: "JPG, PNG, WebP or AVIF",
    inputAccept: "image/jpeg,image/png,image/webp,image/avif",
  },
  document: {
    label: "PDF",
    directory: "guides",
    maxBytes: 25 * 1024 * 1024,
    accepts: "PDF",
    inputAccept: "application/pdf,.pdf",
  },
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_ROOT = path.join(PUBLIC_DIR, "uploads");

// --- Signature detection ----------------------------------------------------

type Detected = { extension: string; mime: string };

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

function detectImage(bytes: Uint8Array): Detected | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { extension: "jpg", mime: "image/jpeg" };
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { extension: "png", mime: "image/png" };
  }
  // RIFF....WEBP
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { extension: "webp", mime: "image/webp" };
  }
  // ....ftyp with an AVIF brand
  if (startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = new TextDecoder().decode(bytes.slice(8, 12));
    if (brand === "avif" || brand === "avis") {
      return { extension: "avif", mime: "image/avif" };
    }
  }
  return null;
}

function detectDocument(bytes: Uint8Array): Detected | null {
  // %PDF-
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { extension: "pdf", mime: "application/pdf" };
  }
  return null;
}

// --- Formatting -------------------------------------------------------------

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  const ext = path.extname(name).replace(".", "").toLowerCase();
  return ext || "no extension";
}

// --- Public API -------------------------------------------------------------

export type UploadResult =
  | { ok: true; path: string; changed: boolean }
  | { ok: false; message: string };

/**
 * Reads one file field out of a submitted form.
 *
 * When no file was chosen, `currentPath` is kept, so editing a record without
 * touching its photo leaves the photo alone.
 */
export async function consumeUpload(
  formData: FormData,
  options: {
    field: string;
    kind: UploadKind;
    currentPath: string;
    /** Short slug woven into the filename to keep the folder readable. */
    nameHint?: string;
  },
): Promise<UploadResult> {
  const config = UPLOAD_KINDS[options.kind];
  const entry = formData.get(options.field);

  // Nothing chosen: keep whatever the record already had.
  if (!(entry instanceof File) || entry.size === 0) {
    return { ok: true, path: options.currentPath, changed: false };
  }

  if (entry.size > config.maxBytes) {
    return {
      ok: false,
      message: `That ${config.label} is ${formatBytes(entry.size)}. The limit is ${formatBytes(
        config.maxBytes,
      )} - please compress it and try again.`,
    };
  }

  const buffer = new Uint8Array(await entry.arrayBuffer());
  const detected =
    options.kind === "image" ? detectImage(buffer) : detectDocument(buffer);

  if (!detected) {
    return {
      ok: false,
      message: `That file is not a valid ${config.accepts} file. You uploaded a .${extensionOf(
        entry.name,
      )} file - please convert it and try again.`,
    };
  }

  const slug = (options.nameHint ?? config.directory)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  const filename = `${slug || config.directory}-${randomUUID().slice(0, 8)}.${detected.extension}`;
  const directory = path.join(UPLOAD_ROOT, config.directory);

  try {
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, filename), buffer);
  } catch (error) {
    console.error("[uploads] could not write file", error);
    return {
      ok: false,
      message:
        "The file could not be saved on the server. Please try again, and let your developer know if it keeps happening.",
    };
  }

  return {
    ok: true,
    path: `/uploads/${config.directory}/${filename}`,
    changed: true,
  };
}

/**
 * Removes a file this app previously wrote, once nothing points at it.
 * Anything outside public/uploads is left alone, and failure is never fatal.
 */
export async function deleteUpload(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;

  const absolute = path.join(PUBLIC_DIR, publicPath);
  const normalised = path.normalize(absolute);

  // Refuse anything that escapes the uploads directory.
  if (!normalised.startsWith(UPLOAD_ROOT + path.sep)) return;

  try {
    await fs.unlink(normalised);
  } catch {
    // Already gone, or never existed. Nothing to do.
  }
}

/** Client-safe limits, so the browser can reject a file before uploading it. */
export function uploadLimits(kind: UploadKind) {
  const config = UPLOAD_KINDS[kind];
  return {
    maxBytes: config.maxBytes,
    maxLabel: formatBytes(config.maxBytes),
    accepts: config.accepts,
    inputAccept: config.inputAccept,
    label: config.label,
  };
}
