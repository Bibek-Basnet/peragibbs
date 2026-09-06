"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearAttempts,
  createSession,
  destroySession,
  isRateLimited,
  recordFailedAttempt,
  verifyCredentials,
} from "@/lib/auth";
import { clientIp } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";
import type { ActionState } from "@/components/admin/ui";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address and password." };
  }

  const ip = clientIp(await headers());
  const throttleKey = `${ip}:${parsed.data.email.toLowerCase()}`;

  if (isRateLimited(throttleKey)) {
    return {
      ok: false,
      message: "Too many failed attempts. Wait 15 minutes and try again.",
    };
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);

  if (!user) {
    recordFailedAttempt(throttleKey);
    return { ok: false, message: "Email or password is incorrect." };
  }

  clearAttempts(throttleKey);
  await createSession(user);

  // redirect throws, so it must be the last statement outside any try block.
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
