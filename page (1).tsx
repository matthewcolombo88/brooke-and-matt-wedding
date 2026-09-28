import { listGroups, listGuests } from "@/lib/data/admin";
import { CreateGroupForm } from "@/components/admin/CreateGroupForm";
import { GroupCard } from "@/components/admin/GroupCard";

export const metadata = { title: "Groups", robots: { index: false, follow: false } };

export default async function AdminGroupsPage() {
  const [groups, guests] = await Promise.all([listGroups(), listGuests({ status: "all" })]);

  const guestsByGroup = new Map<string, typeof guests>();
  for (const guest of guests) {
    const list = guestsByGroup.get(guest.group_id) ?? [];
    list.push(guest);
    guestsByGroup.set(guest.group_id, list);
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900 mb-6">Groups</h1>

      <div className="card p-6 mb-8">
        <p className="text-sm text-ink-500 mb-4">Create a new household or party.</p>
        <CreateGroupForm />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} guests={guestsByGroup.get(group.id) ?? []} />
        ))}
      </div>

      {groups.length === 0 && <p className="text-ink-500 text-center py-16">No groups yet — create your first one above.</p>}
    </div>
  );
}
