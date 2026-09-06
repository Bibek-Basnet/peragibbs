"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwiseIcon,
  FilePdfIcon,
  ImageIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

export type UploadLimits = {
  maxBytes: number;
  maxLabel: string;
  accepts: string;
  inputAccept: string;
  label: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Upload control for a photo or a PDF.
 *
 * The visible state is deliberately explicit: what is saved now, what will
 * replace it, and why a file was refused. Choosing nothing keeps the existing
 * file, which is carried through in a hidden field.
 */
export default function FileField({
  label,
  fileFieldName,
  pathFieldName,
  currentPath,
  limits,
  kind,
  hint,
  nameHintFieldValue,
}: {
  label: string;
  /** Name of the <input type="file">. */
  fileFieldName: string;
  /** Hidden field that carries the currently saved path. */
  pathFieldName: string;
  currentPath: string;
  limits: UploadLimits;
  kind: "image" | "document";
  hint?: string;
  nameHintFieldValue?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ name: string; size: number } | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const allowedExtensions = limits.inputAccept
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.startsWith("."))
    .map((token) => token.slice(1));

  function clearSelection() {
    if (inputRef.current) inputRef.current.value = "";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPicked(null);
    setError(null);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    if (!file) {
      setPicked(null);
      setError(null);
      return;
    }

    if (file.size > limits.maxBytes) {
      setError(
        `That ${limits.label} is ${formatBytes(file.size)}. The limit is ${limits.maxLabel} - please compress it and choose again.`,
      );
      setPicked(null);
      event.target.value = "";
      return;
    }

    const looksRight =
      file.type
        ? limits.inputAccept.includes(file.type)
        : allowedExtensions.includes(extensionOf(file.name));

    if (!looksRight) {
      setError(
        `Only ${limits.accepts} files are accepted. You chose a .${
          extensionOf(file.name) || "unknown"
        } file.`,
      );
      setPicked(null);
      event.target.value = "";
      return;
    }

    setError(null);
    setPicked({ name: file.name, size: file.size });
    if (kind === "image") setPreviewUrl(URL.createObjectURL(file));
  }

  const hasCurrent = currentPath.trim().length > 0;

  return (
    <div>
      <p className="mb-1.5 font-ui text-[13px] font-medium text-ink">{label}</p>

      <input type="hidden" name={pathFieldName} value={currentPath} />
      {nameHintFieldValue ? (
        <input type="hidden" name="uploadNameHint" value={nameHintFieldValue} />
      ) : null}

      <div className="rounded-lg border border-line bg-white p-3">
        <div className="flex items-start gap-3">
          <Thumbnail
            kind={kind}
            previewUrl={previewUrl}
            currentPath={hasCurrent ? currentPath : null}
          />

          <div className="min-w-0 flex-1">
            {picked ? (
              <>
                <p className="font-ui text-[13px] font-medium text-ink">
                  {picked.name}
                </p>
                <p className="mt-0.5 font-ui text-xs text-emerald-700">
                  {formatBytes(picked.size)} - replaces the current {limits.label}{" "}
                  when you save.
                </p>
              </>
            ) : hasCurrent ? (
              <>
                <p className="truncate font-ui text-[13px] font-medium text-ink">
                  {currentPath.split("/").pop()}
                </p>
                <a
                  href={currentPath}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-block font-ui text-xs text-navy underline underline-offset-2"
                >
                  View the current {limits.label}
                </a>
              </>
            ) : (
              <p className="font-ui text-[13px] text-grey">
                No {limits.label} uploaded yet.
              </p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 font-ui text-[13px] font-medium text-ink transition-colors hover:border-navy hover:text-navy">
                <UploadSimpleIcon size={15} weight="bold" />
                {hasCurrent ? `Replace ${limits.label}` : `Choose a ${limits.label}`}
                <input
                  ref={inputRef}
                  type="file"
                  name={fileFieldName}
                  accept={limits.inputAccept}
                  onChange={handleChange}
                  className="sr-only"
                />
              </label>

              {picked ? (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-ui text-[13px] text-grey transition-colors hover:bg-canvas hover:text-ink"
                >
                  <ArrowCounterClockwiseIcon size={14} weight="bold" />
                  Keep the current one
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 font-ui text-[13px] leading-relaxed text-red-700"
          >
            <WarningCircleIcon
              size={15}
              weight="fill"
              className="mt-0.5 shrink-0"
            />
            {error}
          </p>
        ) : null}
      </div>

      <p className="mt-1.5 font-ui text-xs leading-relaxed text-grey">
        {limits.accepts}, up to {limits.maxLabel}.
        {hint ? ` ${hint}` : ""}
      </p>
    </div>
  );
}

function Thumbnail({
  kind,
  previewUrl,
  currentPath,
}: {
  kind: "image" | "document";
  previewUrl: string | null;
  currentPath: string | null;
}) {
  const shell =
    "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-canvas";

  if (kind === "document") {
    return (
      <span className={shell}>
        <FilePdfIcon
          size={24}
          weight={currentPath ? "fill" : "regular"}
          className={currentPath ? "text-navy" : "text-grey"}
        />
      </span>
    );
  }

  const src = previewUrl ?? currentPath;
  if (!src) {
    return (
      <span className={shell}>
        <ImageIcon size={22} className="text-grey" />
      </span>
    );
  }

  return (
    <span className={shell}>
      {/* A blob: preview and an arbitrary uploaded path both sit outside the
          next/image loader's remit here, so this stays a plain img. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
    </span>
  );
}
