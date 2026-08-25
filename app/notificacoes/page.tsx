import { redirect } from "next/navigation";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notificações" };
export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/notificacoes");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, description, related_job_id, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Notificações</h1>
      <NotificationsList initialNotifications={notifications ?? []} />
    </div>
  );
}
