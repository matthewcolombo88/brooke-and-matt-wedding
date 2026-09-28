"use client";

import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";
import { submitRsvpAction, type RsvpSubmitState } from "@/lib/actions/guest";
import { dietaryOptions } from "@/lib/config";
import type { Guest, RsvpStatus } from "@/lib/types";

const initialState: RsvpSubmitState = {};

function GuestRow({ guest }: { guest: Guest }) {
  const [attendance, setAttendance] = useState<RsvpStatus>(guest.rsvp_status);
  const [dietary, setDietary] = useState<string>(guest.dietary_requirement ?? "none");

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-serif text-xl text-ink-900">{guest.full_name}</p>
          <StatusPill status={attendance} />
        </div>

        <fieldset className="flex gap-2" aria-label={`RSVP for ${guest.full_name}`}>
          <legend className="sr-only">RSVP for {guest.full_name}</legend>
          {(
            [
              { value: "attending", label: "Accept" },
              { value: "declined", label: "Decline" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={clsx(
                "cursor-pointer rounded-sm border px-5 py-2.5 text-sm uppercase tracking-widest2 transition-colors",
                attendance === opt.value
                  ? opt.value === "attending"
                    ? "bg-olive-600 border-olive-600 text-ivory-100"
                    : "bg-ink-700 border-ink-700 text-ivory-100"
                  : "border-ink-900/15 text-ink-600 hover:border-wine-600 hover:text-wine-600"
              )}
            >
              <input
                type="radio"
                name={`attendance_${guest.id}`}
                value={opt.value}
                checked={attendance === opt.value}
                onChange={() => setAttendance(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
      </div>

      {attendance === "attending" && (
        <div className="mt-6 pt-6 border-t border-ink-900/[0.06] grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`dietary_${guest.id}`} className="block text-sm text-ink-600 mb-2">
              Dietary requirements
            </label>
            <select
              id={`dietary_${guest.id}`}
              name={`dietary_${guest.id}`}
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-3.5 py-3 text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
            >
              {dietaryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {dietary === "other" && (
            <div>
              <label htmlFor={`dietary_other_${guest.id}`} className="block text-sm text-ink-600 mb-2">
                Please tell us more
              </label>
              <input
                id={`dietary_other_${guest.id}`}
                name={`dietary_other_${guest.id}`}
                type="text"
                defaultValue={guest.dietary_requirement === "other" ? guest.dietary_notes ?? "" : ""}
                className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-3.5 py-3 text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
              />
            </div>
          )}
        </div>
      )}

      {/* Always submit a value even if the user never touches this guest's radios */}
      {attendance === "pending" && <input type="hidden" name={`attendance_${guest.id}`} value="pending" />}
    </div>
  );
}

function StatusPill({ status }: { status: RsvpStatus }) {
  const config: Record<RsvpStatus, { label: string; className: string }> = {
    pending: { label: "Awaiting RSVP", className: "bg-ivory-300 text-ink-600" },
    attending: { label: "Attending", className: "bg-olive-100 text-olive-800" },
    declined: { label: "Unable to Attend", className: "bg-wine-100 text-wine-700" },
  };
  const c = config[status];
  return (
    <span className={clsx("mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] uppercase tracking-widest2", c.className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {c.label}
    </span>
  );
}

export function RsvpForm({ guests, note }: { guests: Guest[]; note: string | null }) {
  const [state, setState] = useState<RsvpSubmitState>(initialState);
  const [isPending, startTransition] = useTransition();

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await submitRsvpAction(state, formData);
      setState(result);
    });
  }

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  return (
    <form action={formAction}>
      {state.success && (
        <div className="mb-8 card border-olive-300 bg-olive-50 p-6 text-center animate-fadeIn">
          <p className="font-serif text-2xl text-olive-800">Thank you.</p>
          <p className="mt-1 text-olive-700">
            Your RSVP has been successfully saved. You can return here any time to review or update it.
          </p>
        </div>
      )}

      {state.error && (
        <div role="alert" className="mb-8 card border-wine-300 bg-wine-50 p-6 text-center">
          <p className="text-wine-700">{state.error}</p>
        </div>
      )}

      <div className="space-y-5">
        {guests.map((guest) => (
          <GuestRow key={guest.id} guest={guest} />
        ))}
      </div>

      <div className="mt-8 card p-6 sm:p-7">
        <label htmlFor="group_note" className="block font-serif text-lg text-ink-900 mb-2">
          Anything else we should know?
        </label>
        <textarea
          id="group_note"
          name="group_note"
          rows={4}
          defaultValue={note ?? ""}
          placeholder="Song requests, accessibility needs, anything at all…"
          className="w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600"
        />
      </div>

      <div className="mt-8 flex justify-center sm:justify-end">
        <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
          {isPending ? "Saving…" : "Save My RSVP"}
        </button>
      </div>
    </form>
  );
}
