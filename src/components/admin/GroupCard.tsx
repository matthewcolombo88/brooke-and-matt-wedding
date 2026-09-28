"use client";

import { useState, useTransition } from "react";
import { deleteGroupAction, renameGroupAction, type FormActionState } from "@/lib/actions/admin";
import { ConfirmSubmitForm } from "@/components/admin/ConfirmSubmitForm";
import type { Group, Guest } from "@/lib/types";

const initialState: FormActionState = {};

export function GroupCard({ group, guests }: { group: Group & { guest_count: number }; guests: Guest[] }) {
  const [renaming, setRenaming] = useState(false);
  const [state, setState] = useState<FormActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await renameGroupAction(state, formData);
      setState(result);
      if (result.success) setRenaming(false);
    });
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3">
        {renaming ? (
          <form action={formAction} className="flex-1 flex gap-2 items-center">
            <input type="hidden" name="group_id" value={group.id} />
            <input
              name="group_name"
              defaultValue={group.group_name}
              autoFocus
              className="flex-1 rounded-sm border border-ink-900/15 bg-ivory-50 px-3 py-2 text-sm"
            />
            <button type="submit" disabled={isPending} className="text-xs uppercase tracking-widest2 text-wine-600 hover:text-wine-700">
              {isPending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setRenaming(false)} className="text-xs text-ink-400">
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p className="font-serif text-xl text-ink-900">{group.group_name}</p>
            <p className="text-xs text-ink-400 mt-0.5">
              {group.guest_count} {group.guest_count === 1 ? "guest" : "guests"}
            </p>
          </div>
        )}

        {!renaming && (
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="text-xs uppercase tracking-widest2 text-ink-500 hover:text-wine-600"
            >
              Rename
            </button>
            <ConfirmSubmitForm
              action={deleteGroupAction}
              confirmMessage={`Delete "${group.group_name}" and all ${group.guest_count} guest(s) in it? This cannot be undone.`}
            >
              <input type="hidden" name="group_id" value={group.id} />
              <button type="submit" className="text-xs uppercase tracking-widest2 text-ink-400 hover:text-wine-600">
                Delete
              </button>
            </ConfirmSubmitForm>
          </div>
        )}
      </div>

      {guests.length > 0 && (
        <ul className="mt-4 pt-4 border-t border-ink-900/[0.06] space-y-1.5">
          {guests.map((g) => (
            <li key={g.id} className="text-sm text-ink-600 flex justify-between">
              <span>{g.full_name}</span>
              <span className="text-xs text-ink-400 uppercase tracking-widest2">{g.rsvp_status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
