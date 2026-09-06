import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No min-h-screen here: the dashboard shell owns the viewport and manages
  // its own scrolling, and the login page sets its own height.
  return <div className="bg-canvas font-ui text-ink">{children}</div>;
}
