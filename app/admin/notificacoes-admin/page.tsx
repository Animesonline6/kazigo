import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminNotificationsList, type AdminNotificationItem } from "@/components/admin/AdminNotificationsList";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Notificações — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminNotificacoesPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: notifications } = await supabase
    .from("admin_notifications")
    .select("id, type, title, description, related_id, read, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Notificações</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Novos utilizadores, trabalhos a aguardar aprovação e denúncias.
        </p>
      </div>

      <AdminNotificationsList initial={(notifications ?? []) as AdminNotificationItem[]} />
    </AdminLayout>
  );
}
