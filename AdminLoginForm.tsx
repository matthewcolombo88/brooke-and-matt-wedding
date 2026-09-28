"use client";

import { useState, useTransition } from "react";
import { adminLoginAction, type AdminLoginState } from "@/lib/actions/admin";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, setState] = useState<AdminLoginState>(initialState);
  const [isPending, startTransition] = useTransition();

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await adminLoginAction(state, formData);
      setState(result);
    });
  }

  return (
    <form action={formAction} className="w-full max-w-sm mx-auto space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm text-ink-600 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-3 text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm text-ink-600 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-3 text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-wine-600">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
