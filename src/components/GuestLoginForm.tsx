"use client";

import { useState, useTransition } from "react";
import { loginGuestAction, type GuestLoginState } from "@/lib/actions/guest";

const initialState: GuestLoginState = {};

export function GuestLoginForm() {
  const [state, setState] = useState<GuestLoginState>(initialState);
  const [isPending, startTransition] = useTransition();

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await loginGuestAction(state, formData);
      setState(result);
    });
  }

  return (
    <form action={formAction} className="w-full max-w-sm mx-auto">
      <label htmlFor="full_name" className="block text-sm text-ink-600 mb-2">
        Please enter your full name as it appears on your invitation.
      </label>
      <input
        id="full_name"
        name="full_name"
        type="text"
        autoComplete="off"
        autoCapitalize="words"
        required
        placeholder="e.g. Christopher Michael Smith"
        aria-invalid={!!state.error}
        aria-describedby={state.error ? "login-error" : undefined}
        className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-3.5 text-ink-900 placeholder:text-ink-400 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600 transition-colors"
      />

      {state.error && (
        <p id="login-error" role="alert" className="mt-3 text-sm text-wine-600">
          {state.error}
        </p>
      )}

      <div className="mt-6">
        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? "Checking…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
