"use client";

import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";
import { deleteGuestAction, updateGuestAction, type GuestFormState } from "@/lib/actions/admin";
import { ConfirmSubmitForm } from "@/components/admin/ConfirmSubmitForm";
import { dietaryOptions } from "@/lib/config";
import type { GuestRow } from "@/lib/data/admin";
import type { Group } from "@/lib/types";

const statusClasses: Record<string, string> = {
  pending: "bg-ivory-300 text-ink-600",
  attending: "bg-olive-100 text-olive-800",
  declined: "bg-wine-100 text-wine-700",
};

const statusLabels: Record<string, string> = {
  pending: "Awaiting",
  attending: "Attending",
  declined: "Declined",
};

export function GuestTable({ guests, groups }: { guests: GuestRow[]; groups: Group[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (guests.length === 0) {
    return <p className="text-ink-500 text-center py-16">No guests match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-ink-900/10 text-xs uppercase tracking-widest2 text-ink-500">
            <th className="px-5 py-4">Guest</th>
            <th className="px-5 py-4">Group</th>
            <th className="px-5 py-4">RSVP</th>
            <th className="px-5 py-4">Dietary</th>
            <th className="px-5 py-4">Last Updated</th>
            <th className="px-5 py-4" />
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) =>
            editingId === guest.id ? (
              <EditRow key={guest.id} guest={guest} groups={groups} onClose={() => setEditingId(null)} />
            ) : (
              <tr key={guest.id} className="border-b border-ink-900/5 last:border-0 hover:bg-ivory-50">
                <td className="px-5 py-4">
                  <p className="text-ink-900 font-medium">{guest.full_name}</p>
                  {!guest.invited && <p className="text-xs text-wine-500 mt-0.5">Not invited</p>}
                </td>
                <td className="px-5 py-4 text-ink-600">{guest.groups?.group_name ?? "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] uppercase tracking-widest2",
                      statusClasses[guest.rsvp_status]
                    )}
                  >
                    {statusLabels[guest.rsvp_status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {guest.rsvp_status === "attending"
                    ? dietaryOptions.find((d) => d.value === guest.dietary_requirement)?.label ?? "—"
                    : "—"}
                </td>
                <td className="px-5 py-4 text-ink-400 text-xs">
                  {new Date(guest.updated_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(guest.id)}
                      className="text-xs uppercase tracking-widest2 text-wine-600 hover:text-wine-700"
                    >
                      Edit
                    </button>
                    <ConfirmSubmitForm
                      action={deleteGuestAction}
                      confirmMessage={`Remove ${guest.full_name} from the guest list? This cannot be undone.`}
                    >
                      <input type="hidden" name="guest_id" value={guest.id} />
                      <button type="submit" className="text-xs uppercase tracking-widest2 text-ink-400 hover:text-wine-600">
                        Delete
                      </button>
                    </ConfirmSubmitForm>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function EditRow({ guest, groups, onClose }: { guest: GuestRow; groups: Group[]; onClose: () => void }) {
  const initialState: GuestFormState = {};
  const [state, setState] = useState<GuestFormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [rsvpStatus, setRsvpStatus] = useState(guest.rsvp_status);
  const [dietary, setDietary] = useState<string>(guest.dietary_requirement ?? "none");

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await updateGuestAction(state, formData);
      setState(result);
    });
  }

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  const selectClass =
    "w-full rounded-sm border border-ink-900/15 bg-ivory-50 px-3 py-2 text-sm text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600";

  return (
    <tr className="border-b border-ink-900/5 bg-ivory-50">
      <td colSpan={6} className="px-5 py-6">
        <form action={formAction} className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <input type="hidden" name="guest_id" value={guest.id} />

          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Full Name</label>
            <input name="full_name" defaultValue={guest.full_name} required className={selectClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Group</label>
            <select name="group_id" defaultValue={guest.group_id} className={selectClass}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.group_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Age</label>
            <select name="age_category" defaultValue={guest.age_category} className={selectClass}>
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Invitation</label>
            <select name="invitation_type" defaultValue={guest.invitation_type} className={selectClass}>
              <option value="full">Full Day</option>
              <option value="ceremony_only">Ceremony Only</option>
              <option value="reception_only">Reception Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">RSVP Status</label>
            <select
              name="rsvp_status"
              value={rsvpStatus}
              onChange={(e) => setRsvpStatus(e.target.value as typeof rsvpStatus)}
              className={selectClass}
            >
              <option value="pending">Awaiting</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {rsvpStatus === "attending" && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Dietary</label>
                <select
                  name="dietary_requirement"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className={selectClass}
                >
                  {dietaryOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Dietary Notes</label>
                <input name="dietary_notes" defaultValue={guest.dietary_notes ?? ""} className={selectClass} />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Email</label>
            <input name="email" type="email" defaultValue={guest.email ?? ""} className={selectClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Phone</label>
            <input name="phone" defaultValue={guest.phone ?? ""} className={selectClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">Preferred First Name</label>
            <input name="preferred_first_name" defaultValue={guest.preferred_first_name ?? ""} className={selectClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">
              Alternate Accepted Names (comma separated)
            </label>
            <input name="alt_names" defaultValue={guest.alt_names.join(", ")} className={selectClass} />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-700 self-end pb-2">
            <input type="checkbox" name="invited" defaultChecked={guest.invited} className="h-4 w-4" />
            Invited
          </label>

          <div className="sm:col-span-3 lg:col-span-4">
            <label className="block text-xs uppercase tracking-widest2 text-ink-500 mb-1.5">
              Internal Notes (admin only)
            </label>
            <textarea name="guest_notes" defaultValue={guest.guest_notes ?? ""} rows={2} className={selectClass} />
          </div>

          {state.error && <p className="sm:col-span-3 lg:col-span-4 text-sm text-wine-600">{state.error}</p>}

          <div className="sm:col-span-3 lg:col-span-4 flex gap-3">
            <button type="submit" disabled={isPending} className="btn-primary text-xs py-2 px-4">
              {isPending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost text-xs">
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}
