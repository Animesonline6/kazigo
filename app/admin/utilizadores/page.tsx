import { UsersList } from "@/components/admin/UsersList";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Utilizadores — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminUtilizadoresPage() {
  const { supabase, user, profile } = await requireAdmin();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, city, avatar_url, is_suspended, created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Utilizadores</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {(users ?? []).length} conta{(users ?? []).length === 1 ? "" : "s"} registada{(users ?? []).length === 1 ? "" : "s"} na KaziGo.
        </p>
      </div>

      <UsersList users={users ?? []} currentAdminId={user.id} />
    </AdminLayout>
  );
}
