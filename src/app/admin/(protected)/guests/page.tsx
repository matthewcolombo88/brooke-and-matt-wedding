import { listGroups, listGuests, type GuestFilters } from "@/lib/data/admin";
import { GuestFilterBar } from "@/components/admin/GuestFilterBar";
import { GuestTable } from "@/components/admin/GuestTable";
import { AddGuestForm } from "@/components/admin/AddGuestForm";

export const metadata = { title: "Guests", robots: { index: false, follow: false } };

export default async function AdminGuestsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const statusParam = typeof searchParams?.status === "string" ? searchParams.status : undefined;
  const dietaryParam = typeof searchParams?.dietary === "string" ? searchParams.dietary : undefined;
  const searchParam = typeof searchParams?.search === "string" ? searchParams.search : undefined;

  const filters: GuestFilters = {
    status: (statusParam as GuestFilters["status"]) ?? "all",
    dietary: dietaryParam,
    search: searchParam,
  };

  const [guests, groups] = await Promise.all([listGuests(filters), listGroups()]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink-900">Guests</h1>
        <AddGuestForm groups={groups} />
      </div>

      <GuestFilterBar />
      <GuestTable guests={guests} groups={groups} />
    </div>
  );
}
