"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Field, Input, buttonClass, type ActionState } from "@/components/admin/ui";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${buttonClass("primary")} w-full py-3`}
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email address" name="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@peragibbsmovement.com"
        />
      </Field>

      <Field label="Password" name="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>

      {state && !state.ok ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3.5 py-2.5 font-body text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
