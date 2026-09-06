"use client";

import { useId, useState } from "react";

/**
 * Chart palette.
 *
 * Categorical slots 1 and 2 (blue, orange) and the ordinal blue ramp below were
 * checked against a white chart surface: adjacent CVD deltaE 24.7, normal-vision
 * deltaE 33.6, both series above 3:1 contrast; the ordinal ramp is monotone in
 * lightness with its lightest step clearing the surface. Do not substitute a
 * colour here without re-validating the set.
 */
const SERIES = {
  messages: "#2a78d6",
  leads: "#eb6834",
} as const;

/** Ordered pipeline stages share one hue; archived leaves the pipeline, so it is neutral. */
export const STAGE_COLORS: Record<string, string> = {
  NEW: "#86b6ef",
  CONTACTED: "#5598e7",
  READ: "#5598e7",
  CONVERTED: "#2a78d6",
  REPLIED: "#2a78d6",
  ARCHIVED: "#898781",
};

const GRID = "#e4e6ea";
const AXIS_TEXT = "#6b6b68";
const SURFACE = "#ffffff";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Column with a rounded cap and square feet, so it sits flat on the baseline. */
function roundedTopPath(x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h));
  if (radius === 0) return `M${x},${y}h${w}v${h}h${-w}Z`;
  return [
    `M${x},${y + h}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + w - radius},${y}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `L${x + w},${y + h}`,
    "Z",
  ].join("");
}

function niceCeiling(value: number) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return 10 * magnitude;
}

function formatDay(iso: string) {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T00:00:00`));
}

// ---------------------------------------------------------------------------
// Stat tile
// ---------------------------------------------------------------------------

export function StatTile({
  label,
  value,
  hint,
  spark,
  accent = SERIES.messages,
}: {
  label: string;
  value: string | number;
  hint?: string;
  spark?: number[];
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(15,17,21,0.04)]">
      <p className="font-ui text-[13px] font-medium text-grey">{label}</p>
      <p className="mt-1.5 font-ui text-[28px] font-semibold leading-none tracking-tight text-ink">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 font-ui text-xs text-grey">{hint}</p>
      ) : null}
      {spark && spark.length > 1 ? (
        <Sparkline values={spark} accent={accent} />
      ) : null}
    </div>
  );
}

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const w = 120;
  const h = 26;
  const max = Math.max(1, ...values);
  const step = w / Math.max(1, values.length - 1);
  const points = values
    .map((v, i) => `${(i * step).toFixed(2)},${(h - (v / max) * h).toFixed(2)}`)
    .join(" ");
  const lastX = (values.length - 1) * step;
  const lastY = h - ((values.at(-1) ?? 0) / max) * h;

  return (
    <svg
      viewBox={`0 0 ${w} ${h + 6}`}
      className="mt-3 h-8 w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={3} fill={accent} stroke={SURFACE} strokeWidth={2} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Submissions trend - stacked columns, two series
// ---------------------------------------------------------------------------

export type TrendPoint = { date: string; messages: number; leads: number };

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const clipId = useId();

  const W = 720;
  const H = 232;
  const M = { top: 10, right: 8, bottom: 26, left: 32 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const max = niceCeiling(
    Math.max(1, ...data.map((d) => d.messages + d.leads)),
  );
  const band = plotW / Math.max(1, data.length);
  const barW = Math.min(24, Math.max(4, band - 6));
  const scale = (v: number) => (v / max) * plotH;

  const ticks = [0, max / 2, max];
  const total = data.reduce((n, d) => n + d.messages + d.leads, 0);

  const hoveredPoint = hovered === null ? null : data[hovered];

  return (
    <figure className="m-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <LegendItem color={SERIES.messages} label="Contact messages" />
        <LegendItem color={SERIES.leads} label="Guide downloads" />
        <span className="ml-auto font-ui text-xs text-grey">
          {total} in the last {data.length} days
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Daily contact messages and guide downloads over the last ${data.length} days`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M.left} y={M.top} width={plotW} height={plotH} />
            </clipPath>
          </defs>

          {ticks.map((t) => {
            const y = M.top + plotH - scale(t);
            return (
              <g key={t}>
                <line
                  x1={M.left}
                  x2={W - M.right}
                  y1={y}
                  y2={y}
                  stroke={GRID}
                  strokeWidth={1}
                />
                <text
                  x={M.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={AXIS_TEXT}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {t}
                </text>
              </g>
            );
          })}

          <g clipPath={`url(#${clipId})`}>
            {data.map((d, i) => {
              const x = M.left + i * band + (band - barW) / 2;
              const baseline = M.top + plotH;

              const leadsH = scale(d.leads);
              const messagesH = scale(d.messages);
              const hasLeads = d.leads > 0;
              const hasMessages = d.messages > 0;

              // Messages sit on the baseline; leads stack above with a 2px
              // surface gap so the two segments stay distinct.
              const messagesY = baseline - messagesH;
              const leadsY = messagesY - (hasMessages ? 2 : 0) - leadsH;

              return (
                <g
                  key={d.date}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                >
                  <rect
                    x={M.left + i * band}
                    y={M.top}
                    width={band}
                    height={plotH}
                    fill={hovered === i ? "#0f11150a" : "transparent"}
                  />
                  {hasMessages ? (
                    <path
                      d={
                        hasLeads
                          ? `M${x},${messagesY}h${barW}v${messagesH}h${-barW}Z`
                          : roundedTopPath(x, messagesY, barW, messagesH, 4)
                      }
                      fill={SERIES.messages}
                    />
                  ) : null}
                  {hasLeads ? (
                    <path
                      d={roundedTopPath(x, leadsY, barW, leadsH, 4)}
                      fill={SERIES.leads}
                    />
                  ) : null}
                </g>
              );
            })}
          </g>

          <line
            x1={M.left}
            x2={W - M.right}
            y1={M.top + plotH}
            y2={M.top + plotH}
            stroke="#c3c2b7"
            strokeWidth={1}
          />

          {data.map((d, i) => {
            // Label roughly weekly, plus the final day. Drop a weekly tick that
            // would sit on top of the final label rather than stacking them.
            const isLast = i === data.length - 1;
            const tooCloseToLast = data.length - 1 - i < 4;
            if (isLast ? false : i % 7 !== 0 || tooCloseToLast) return null;
            return (
              <text
                key={`tick-${d.date}`}
                x={M.left + i * band + band / 2}
                y={H - 8}
                textAnchor={isLast ? "end" : "middle"}
                fontSize={11}
                fill={AXIS_TEXT}
              >
                {formatDay(d.date)}
              </text>
            );
          })}
        </svg>

        {hoveredPoint ? (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-line bg-white px-3 py-2 shadow-lg"
            style={{
              left: `${((M.left + (hovered ?? 0) * band + band / 2) / W) * 100}%`,
            }}
          >
            <p className="font-ui text-xs font-medium text-grey">
              {formatDay(hoveredPoint.date)}
            </p>
            <TooltipRow
              color={SERIES.messages}
              label="Messages"
              value={hoveredPoint.messages}
            />
            <TooltipRow
              color={SERIES.leads}
              label="Downloads"
              value={hoveredPoint.leads}
            />
          </div>
        ) : null}
      </div>

      <DataTable
        summary="View as table"
        head={["Date", "Messages", "Downloads"]}
        rows={data
          .filter((d) => d.messages + d.leads > 0)
          .map((d) => [formatDay(d.date), String(d.messages), String(d.leads)])}
        emptyLabel="No submissions in this period."
      />
    </figure>
  );
}

function TooltipRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <p className="mt-1 flex items-center gap-2 font-ui text-sm">
      <span
        aria-hidden
        className="h-0.5 w-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-grey">{label}</span>
    </p>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-ui text-xs text-grey">
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Ranked bar list - one hue, direct labels
// ---------------------------------------------------------------------------

export function BarList({
  items,
  emptyLabel,
}: {
  items: { label: string; value: number }[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="font-ui text-sm text-grey">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="truncate font-ui text-sm text-ink">
              {item.label}
            </span>
            <span className="shrink-0 font-ui text-sm font-semibold tabular-nums text-ink">
              {item.value}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(2, (item.value / max) * 100)}%`,
                backgroundColor: SERIES.messages,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Pipeline - horizontal stacked bar over ordered stages
// ---------------------------------------------------------------------------

export function PipelineBar({
  stages,
  emptyLabel,
}: {
  stages: { key: string; label: string; value: number }[];
  emptyLabel: string;
}) {
  const total = stages.reduce((n, s) => n + s.value, 0);

  if (total === 0) {
    return <p className="font-ui text-sm text-grey">{emptyLabel}</p>;
  }

  const visible = stages.filter((s) => s.value > 0);

  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
        {visible.map((stage) => (
          <div
            key={stage.key}
            title={`${stage.label}: ${stage.value}`}
            style={{
              width: `${(stage.value / total) * 100}%`,
              backgroundColor: STAGE_COLORS[stage.key] ?? SERIES.messages,
            }}
            className="first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {stages.map((stage) => (
          <li
            key={stage.key}
            className="flex items-center justify-between gap-3"
          >
            <span className="inline-flex items-center gap-2 font-ui text-sm text-grey">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-sm"
                style={{
                  backgroundColor: STAGE_COLORS[stage.key] ?? SERIES.messages,
                }}
              />
              {stage.label}
            </span>
            <span className="font-ui text-sm font-semibold tabular-nums text-ink">
              {stage.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table fallback, so no value is only reachable by hovering
// ---------------------------------------------------------------------------

function DataTable({
  summary,
  head,
  rows,
  emptyLabel,
}: {
  summary: string;
  head: string[];
  rows: string[][];
  emptyLabel: string;
}) {
  return (
    <details className="mt-4">
      <summary className="cursor-pointer font-ui text-xs font-medium text-grey transition-colors hover:text-navy">
        {summary}
      </summary>
      {rows.length === 0 ? (
        <p className="mt-3 font-ui text-sm text-grey">{emptyLabel}</p>
      ) : (
        <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-line">
          <table className="w-full border-collapse font-ui text-sm">
            <thead className="sticky top-0 bg-canvas">
              <tr>
                {head.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-medium text-grey"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-line">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={
                        "px-3 py-2 text-ink " +
                        (i === 0 ? "" : "tabular-nums")
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}
