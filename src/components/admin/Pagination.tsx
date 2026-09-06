import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

/** Page controls that carry the current filters through in the query string. */
export default function Pagination({
  basePath,
  params,
  page,
  totalPages,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  function href(nextPage: number) {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
    }
    if (nextPage > 1) sp.set("page", String(nextPage));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 font-ui text-[13px] font-medium text-ink transition-colors hover:border-navy hover:text-navy";
  const disabledClass =
    "inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-2 font-ui text-[13px] font-medium text-grey/50";

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5"
    >
      <p className="font-ui text-[13px] text-grey">
        Page <span className="font-semibold text-ink">{page}</span> of{" "}
        <span className="font-semibold text-ink">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={linkClass}>
            <CaretLeftIcon size={14} weight="bold" />
            Previous
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            <CaretLeftIcon size={14} weight="bold" />
            Previous
          </span>
        )}

        {page < totalPages ? (
          <Link href={href(page + 1)} className={linkClass}>
            Next
            <CaretRightIcon size={14} weight="bold" />
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Next
            <CaretRightIcon size={14} weight="bold" />
          </span>
        )}
      </div>
    </nav>
  );
}
