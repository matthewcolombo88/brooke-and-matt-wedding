"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createGroupAction, type FormActionState } from "@/lib/actions/admin";

const initialState: FormActionState = {};

export function CreateGroupForm() {
  const [state, setState] = useState<FormActionState>(initialState);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await createGroupAction(state, formData);
      setState(result);
    });
  }

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-3 items-start">
      <input
        name="group_name"
        placeholder="e.g. The Smith Family"
        required
        className="flex-1 min-w-[220px] rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-2.5 text-sm text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
      />
      <button type="submit" disabled={isPending} className="btn-primary text-xs py-2.5 px-5">
        {isPending ? "Creating…" : "Create Group"}
      </button>
      {state.error && <p className="text-sm text-wine-600">{state.error}</p>}
    </form>
  );
}
