import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UsersList } from "@/components/admin/UsersList";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Utilizadores — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminUtilizadoresPage() {
  const { supabase, user } = await requireAdmin();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, avatar_url, is_suspended, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-navy-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar à administração
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Utilizadores</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {(users ?? []).length} conta{(users ?? []).length === 1 ? "" : "s"} registada{(users ?? []).length === 1 ? "" : "s"} na KaziGo.
        </p>
      </div>

      <UsersList users={users ?? []} currentAdminId={user.id} />
    </div>
  );
}
