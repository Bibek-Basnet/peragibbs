"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarbellIcon,
  EnvelopeSimpleIcon,
  FileArrowDownIcon,
  LightningIcon,
  SquaresFourIcon,
  StarIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

type NavLink = {
  href: string;
  label: string;
  icon: typeof SquaresFourIcon;
  exact?: boolean;
  badge?: number;
};

type NavGroup = { heading: string; links: NavLink[] };

export default function AdminNav({
  newLeads = 0,
  newMessages = 0,
}: {
  newLeads?: number;
  newMessages?: number;
}) {
  const pathname = usePathname();

  const groups: NavGroup[] = [
    {
      heading: "Overview",
      links: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: SquaresFourIcon,
          exact: true,
        },
      ],
    },
    {
      heading: "Site content",
      links: [
        { href: "/admin/offerings", label: "Coaching Offerings", icon: LightningIcon },
        { href: "/admin/skills", label: "Skills", icon: BarbellIcon },
        { href: "/admin/testimonials", label: "Testimonials", icon: StarIcon },
        { href: "/admin/guides", label: "Programme Guides", icon: FileArrowDownIcon },
      ],
    },
    {
      heading: "Enquiries",
      links: [
        {
          href: "/admin/leads",
          label: "Guide Leads",
          icon: UsersThreeIcon,
          badge: newLeads,
        },
        {
          href: "/admin/messages",
          label: "Contact Messages",
          icon: EnvelopeSimpleIcon,
          badge: newMessages,
        },
      ],
    },
  ];

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.heading}>
          <p className="mb-2 px-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-paper/35">
            {group.heading}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-ui text-sm transition-colors " +
                      (active
                        ? "bg-navy text-white font-medium"
                        : "text-paper/65 hover:bg-white/[0.07] hover:text-paper")
                    }
                  >
                    <Icon
                      size={18}
                      weight={active ? "fill" : "regular"}
                      className="shrink-0"
                    />
                    <span className="flex-1 truncate">{link.label}</span>
                    {link.badge ? (
                      <span
                        className={
                          "rounded-full px-1.5 py-0.5 font-ui text-[10px] font-bold tabular-nums " +
                          (active
                            ? "bg-white/25 text-white"
                            : "bg-navy text-white")
                        }
                      >
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Condensed horizontal version used on small screens. */
export function AdminNavCompact({
  newLeads = 0,
  newMessages = 0,
}: {
  newLeads?: number;
  newMessages?: number;
}) {
  const pathname = usePathname();

  const links: NavLink[] = [
    { href: "/admin", label: "Dashboard", icon: SquaresFourIcon, exact: true },
    { href: "/admin/offerings", label: "Offerings", icon: LightningIcon },
    { href: "/admin/skills", label: "Skills", icon: BarbellIcon },
    { href: "/admin/testimonials", label: "Testimonials", icon: StarIcon },
    { href: "/admin/guides", label: "Guides", icon: FileArrowDownIcon },
    {
      href: "/admin/leads",
      label: "Leads",
      icon: UsersThreeIcon,
      badge: newLeads,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: EnvelopeSimpleIcon,
      badge: newMessages,
    },
  ];

  return (
    <nav
      aria-label="Admin sections"
      className="scrollbar-hide flex gap-1 overflow-x-auto"
    >
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-ui text-sm transition-colors " +
              (active
                ? "bg-navy text-white font-medium"
                : "text-paper/65 hover:bg-white/[0.07] hover:text-paper")
            }
          >
            <Icon size={16} weight={active ? "fill" : "regular"} />
            {link.label}
            {link.badge ? (
              <span className="rounded-full bg-navy px-1.5 py-0.5 font-ui text-[10px] font-bold tabular-nums text-white">
                {link.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
