import Link from "next/link";
import {
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Select, buttonClass } from "./ui";

export type SelectFilter = {
  name: string;
  label: string;
  value: string;
  allLabel: string;
  options: { value: string; label: string; count?: number }[];
};

export type ActiveChip = { label: string; value: string; removeHref: string };

/**
 * One filter row above the list it scopes: free-text search plus a select per
 * dimension. It is a plain GET form, so filters are shareable URLs, survive a
 * refresh and need no client JavaScript.
 */
export default function FilterBar({
  basePath,
  search,
  searchPlaceholder = "Search name or email",
  selects,
  chips,
  total,
  noun,
}: {
  basePath: string;
  search: string;
  searchPlaceholder?: string;
  selects: SelectFilter[];
  chips: ActiveChip[];
  total: number;
  noun: string;
}) {
  const hasFilters = chips.length > 0;

  return (
    <div className="mb-5 rounded-xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(15,17,21,0.04)] md:p-4">
      <form
        method="get"
        action={basePath}
        className="flex flex-col gap-3 lg:flex-row lg:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="filter-search"
            className="mb-1.5 block font-ui text-[13px] font-medium text-ink"
          >
            Search
          </label>
          <div className="relative">
            <MagnifyingGlassIcon
              size={16}
              weight="bold"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey"
            />
            <input
              id="filter-search"
              type="search"
              name="q"
              defaultValue={search}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 font-ui text-sm text-ink shadow-[0_1px_2px_rgba(15,17,21,0.04)] transition-colors placeholder:text-grey/60 focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10"
            />
          </div>
        </div>

        {selects.map((filter) => (
          <div key={filter.name} className="lg:w-52">
            <label
              htmlFor={`filter-${filter.name}`}
              className="mb-1.5 block font-ui text-[13px] font-medium text-ink"
            >
              {filter.label}
            </label>
            <Select
              id={`filter-${filter.name}`}
              name={filter.name}
              defaultValue={filter.value}
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {typeof option.count === "number" ? ` (${option.count})` : ""}
                </option>
              ))}
            </Select>
          </div>
        ))}

        <div className="flex gap-2">
          <button type="submit" className={buttonClass("primary")}>
            <FunnelSimpleIcon size={16} weight="bold" />
            Apply
          </button>
          {hasFilters ? (
            <Link href={basePath} className={buttonClass("secondary")}>
              Reset
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <span className="font-ui text-sm text-grey">
          <span className="font-semibold tabular-nums text-ink">{total}</span>{" "}
          {total === 1 ? noun : `${noun}s`}
          {hasFilters ? " matching" : " total"}
        </span>

        {chips.map((chip) => (
          <Link
            key={`${chip.label}-${chip.value}`}
            href={chip.removeHref}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy/10 px-2 py-1 font-ui text-xs font-medium text-navy ring-1 ring-inset ring-navy/20 transition-colors hover:bg-navy/20"
          >
            <span className="text-navy/70">{chip.label}:</span>
            {chip.value}
            <XIcon size={11} weight="bold" />
          </Link>
        ))}
      </div>
    </div>
  );
}
