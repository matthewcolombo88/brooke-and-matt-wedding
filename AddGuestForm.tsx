"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addGuestAction, type GuestFormState } from "@/lib/actions/admin";
import type { Group } from "@/lib/types";

const initialState: GuestFormState = {};

export function AddGuestForm({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<GuestFormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await addGuestAction(state, formData);
      setState(result);
    });
  }

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.success]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary text-xs py-2.5 px-5">
        + Add Guest
      </button>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <form ref={formRef} action={formAction} className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" name="full_name" required placeholder="Christopher Michael Smith" />
        <div>
          <FieldLabel>Group</FieldLabel>
          <select name="group_id" required className={selectClass}>
            <option value="">Select a group…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.group_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Age Category</FieldLabel>
          <select name="age_category" defaultValue="adult" className={selectClass}>
            <option value="adult">Adult</option>
            <option value="child">Child</option>
          </select>
        </div>
        <div>
          <FieldLabel>Invitation Type</FieldLabel>
          <select name="invitation_type" defaultValue="full" className={selectClass}>
            <option value="full">Full Day</option>
            <option value="ceremony_only">Ceremony Only</option>
            <option value="reception_only">Reception Only</option>
          </select>
        </div>
        <Field label="Preferred First Name (optional)" name="preferred_first_name" placeholder="e.g. Chris" />
        <Field label="Email (optional)" name="email" type="email" />
        <Field label="Phone (optional)" name="phone" />
        <Field
          label="Alternate Accepted Names (optional, comma separated)"
          name="alt_names"
          placeholder="chris smith, christopher smith"
        />
        <div className="sm:col-span-2">
          <FieldLabel>Internal Notes (admin only, optional)</FieldLabel>
          <textarea name="guest_notes" rows={2} className={selectClass} />
        </div>

        {state.error && <p className="sm:col-span-2 text-sm text-wine-600">{state.error}</p>}

        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="btn-primary text-xs py-2.5 px-5">
            {isPending ? "Adding…" : "Add Guest"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-ghost text-xs">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const selectClass =
  "w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-3.5 py-2.5 text-sm text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input name={name} type={type} required={required} placeholder={placeholder} className={selectClass} />
    </div>
  );
}
