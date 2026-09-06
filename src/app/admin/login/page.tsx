import Link from "next/link";
import { ArrowLeftIcon, LockKeyIcon } from "@phosphor-icons/react/dist/ssr";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-shell px-5 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <LockKeyIcon size={22} weight="bold" />
          </span>
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
            Pera Gibbs Movement
          </p>
          <h1 className="mt-2 font-ui text-2xl font-semibold tracking-tight text-paper">
            Admin sign in
          </h1>
          <p className="mt-2 font-ui text-sm text-paper/55">
            Manage offerings, skills, testimonials and enquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_20px_48px_-24px_rgba(0,0,0,0.55)]">
          <LoginForm />
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 font-ui text-[13px] text-paper/50 transition-colors hover:text-paper"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          Back to the site
        </Link>
      </div>
    </main>
  );
}
