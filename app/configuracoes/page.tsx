import { redirect } from "next/navigation";
import Link from "next/link";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { SecurityForm } from "@/components/configuracoes/SecurityForm";
import { NotificationSettingsForm } from "@/components/configuracoes/NotificationSettingsForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/configuracoes");

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single();

  const { data: settingsRow } = await supabase
    .from("user_settings")
    .select("notify_candidaturas, notify_mensagens, notify_marketing")
    .eq("user_id", user.id)
    .maybeSingle();

  const notificationSettings = {
    notify_candidaturas: settingsRow?.notify_candidaturas ?? true,
    notify_mensagens: settingsRow?.notify_mensagens ?? true,
    notify_marketing: settingsRow?.notify_marketing ?? false,
  };

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Configurações</h1>

      <Card className="max-w-2xl p-6">
        <Tabs
          items={[
            {
              value: "perfil",
              label: "Perfil",
              content: (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-ink-faint">Nome completo</p>
                    <p className="text-sm font-medium text-ink">{profile?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint">Email</p>
                    <p className="text-sm font-medium text-ink">{profile?.email}</p>
                  </div>
                  <p className="text-sm text-ink-faint">
                    Para editar o teu nome, foto, biografia e outros dados do perfil, vai a{" "}
                    <Link href="/perfil#editar-perfil" className="font-medium text-teal-600 hover:underline">
                      Editar perfil
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
            {
              value: "notificacoes",
              label: "Notificações",
              content: <NotificationSettingsForm userId={user.id} initial={notificationSettings} />,
            },
            {
              value: "seguranca",
              label: "Segurança",
              content: <SecurityForm email={profile?.email || user.email || ""} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
