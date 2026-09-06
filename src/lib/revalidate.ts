import "server-only";

import { revalidatePath } from "next/cache";

/** Public routes rendered from database content. */
export const PUBLIC_CONTENT_PATHS = ["/", "/testimonials"] as const;

/**
 * Call after any admin mutation so the statically rendered marketing pages
 * pick the change up on the next request instead of waiting for the
 * revalidate interval.
 */
export function revalidatePublicContent() {
  for (const path of PUBLIC_CONTENT_PATHS) {
    revalidatePath(path);
  }
}
