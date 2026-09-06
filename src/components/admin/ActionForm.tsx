"use client";

import { useActionState, useId, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { buttonClass, type ActionState } from "./ui";

type ServerAction = (
  prevState: ActionState,
  formData: FormData,
) => Promise<ActionState>;

type Tone = "primary" | "secondary" | "danger";

function SubmitButton({
  label,
  pendingLabel,
  tone = "primary",
  pending,
  formId,
}: {
  label: string;
  pendingLabel: string;
  tone?: Tone;
  pending: boolean;
  /** Set when the button sits outside its form and is linked by id. */
  formId?: string;
}) {
  return (
    <button
      type="submit"
      form={formId}
      disabled={pending}
      className={buttonClass(tone)}
    >
      {pending ? (
        <CircleNotchIcon size={16} weight="bold" className="animate-spin" />
      ) : tone === "danger" ? (
        <TrashIcon size={16} weight="bold" />
      ) : (
        <FloppyDiskIcon size={16} weight="bold" />
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-ui text-sm " +
        (state.ok
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700")
      }
    >
      {state.ok ? (
        <CheckCircleIcon size={16} weight="fill" />
      ) : (
        <WarningCircleIcon size={16} weight="fill" />
      )}
      {state.message}
    </p>
  );
}

/**
 * Wraps a server action with pending state and inline success/error feedback.
 */
export default function ActionForm({
  action,
  children,
  submitLabel = "Save changes",
  pendingLabel = "Saving...",
  tone = "primary",
  extraActions,
  className = "",
  resetOnSuccess = false,
}: {
  action: ServerAction;
  children: ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  tone?: Tone;
  extraActions?: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null,
  );
  const formId = useId();

  // The submit button and any extra actions live OUTSIDE the form element and
  // are linked to it by id. `extraActions` is usually a DeleteForm, and a form
  // nested inside another form is invalid HTML: the parser drops the inner one,
  // so Delete would end up submitting the save action.
  return (
    <div className={className}>
      <form
        id={formId}
        action={formAction}
        // Clearing an "add new" form after a successful create.
        key={
          resetOnSuccess && state?.ok
            ? (state.token ?? state.message)
            : undefined
        }
      >
        {children}
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <SubmitButton
          label={submitLabel}
          pendingLabel={pendingLabel}
          tone={tone}
          pending={isPending}
          formId={formId}
        />
        {extraActions}
        <Feedback state={state} />
      </div>
    </div>
  );
}

/**
 * Single-button destructive form with a native confirmation prompt.
 */
export function DeleteForm({
  action,
  id,
  label = "Delete",
  confirmMessage = "Delete this permanently? This cannot be undone.",
  idFieldName = "id",
}: {
  action: ServerAction;
  id: string;
  label?: string;
  confirmMessage?: string;
  idFieldName?: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      className="inline-flex items-center gap-3"
    >
      <input type="hidden" name={idFieldName} value={id} />
      <SubmitButton
        label={label}
        pendingLabel="Deleting..."
        tone="danger"
        pending={isPending}
      />
      {state && !state.ok ? <Feedback state={state} /> : null}
    </form>
  );
}

/**
 * Compact button for a small mutation such as toggling a flag or moving a
 * record to another status.
 */
export function QuickAction({
  action,
  fields,
  label,
  tone = "secondary",
  icon,
}: {
  action: ServerAction;
  fields: Record<string, string>;
  label: string;
  tone?: Tone;
  /**
   * A rendered element, not a component reference: this is a Client Component,
   * so a server page can only hand it serialisable JSX.
   */
  icon?: ReactNode;
}) {
  const [, formAction] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="inline-flex">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <QuickButton label={label} tone={tone} icon={icon} />
    </form>
  );
}

function QuickButton({
  label,
  tone,
  icon,
}: {
  label: string;
  tone: Tone;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-ui text-xs font-medium transition-colors " +
        (tone === "primary"
          ? "bg-ink text-paper hover:bg-navy disabled:opacity-45"
          : tone === "danger"
            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-45"
            : "border border-line bg-white text-grey hover:border-navy hover:text-navy disabled:opacity-45")
      }
    >
      {pending ? (
        <CircleNotchIcon size={13} weight="bold" className="animate-spin" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
