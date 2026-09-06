import Link from "next/link";
import {
  ArrowSquareOutIcon,
  SignOutIcon,
} from "@phosphor-icons/react/dist/ssr";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav, { AdminNavCompact } from "@/components/admin/AdminNav";
import { logoutAction } from "../login/actions";

// The session cookie makes every admin route dynamic anyway; being explicit
// keeps it out of any static optimisation attempt.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  const [newLeads, newMessages] = await Promise.all([
    prisma.guideLead.count({ where: { status: "NEW" } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]);

  const initials = (session.name || session.email)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // A fixed app shell rather than a sticky sidebar: globals.css sets
  // `overflow-x: hidden` on html/body for the marketing site, which turns them
  // into scroll containers and stops `position: sticky` working at all. Here
  // the shell owns the viewport, and only the main column scrolls.
  return (
    <div className="flex h-dvh overflow-hidden bg-canvas font-ui">
      {/* Sidebar - fixed, never scrolls with the content */}
      <aside className="hidden w-[264px] shrink-0 flex-col bg-shell lg:flex">
        <div className="shrink-0 px-5 py-6">
          <Link href="/admin" className="block">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
              Pera Gibbs
            </p>
            <p className="mt-0.5 font-ui text-lg font-semibold tracking-tight text-paper">
              Movement Admin
            </p>
          </Link>
        </div>

        {/* Only the link list scrolls, and only if it ever gets long. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <AdminNav newLeads={newLeads} newMessages={newMessages} />
        </div>

        <div className="shrink-0 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2 font-ui text-sm text-paper/60 transition-colors hover:bg-white/[0.07] hover:text-paper"
          >
            <ArrowSquareOutIcon size={17} />
            View live site
          </Link>

          <div className="flex items-center gap-3 rounded-lg bg-shell-muted px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-ui text-xs font-semibold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-ui text-[13px] font-medium text-paper">
                {session.name || "Admin"}
              </p>
              <p className="truncate font-ui text-[11px] text-paper/45">
                {session.email}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-md text-paper/50 transition-colors hover:bg-white/10 hover:text-paper"
              >
                <SignOutIcon size={16} weight="bold" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar - mobile and tablet, also fixed above the scroll area */}
        <header className="shrink-0 bg-shell px-4 py-3 lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-4">
            <Link
              href="/admin"
              className="font-ui text-base font-semibold text-paper"
            >
              Movement Admin
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                aria-label="View live site"
                className="flex h-8 w-8 items-center justify-center rounded-md text-paper/60 transition-colors hover:bg-white/10 hover:text-paper"
              >
                <ArrowSquareOutIcon size={16} />
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-paper/60 transition-colors hover:bg-white/10 hover:text-paper"
                >
                  <SignOutIcon size={16} weight="bold" />
                </button>
              </form>
            </div>
          </div>
          <AdminNavCompact newLeads={newLeads} newMessages={newMessages} />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
