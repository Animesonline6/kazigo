import { redirect } from "next/navigation";
import { CheckCircle2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AvatarUploader } from "@/components/perfil/AvatarUploader";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "./EditProfileForm";

export const metadata = { title: "Perfil" };
export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  worker: "Trabalhador",
  client: "Cliente",
  company: "Empresa",
  admin: "Administrador",
};

export default async function PerfilPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/perfil");

  // Fetch o perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, avatar_url, bio, phone, whatsapp, verified")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  // Fetch dados adicionais
  let roleData: any = null;
  if (profile.role === "worker") {
    const { data } = await supabase
      .from("worker_profiles")
      .select("headline, skills, hourly_rate, rating, bio")
      .eq("id", user.id)
      .single();
    roleData = data;
  } else if (profile.role === "company") {
    const { data } = await supabase
      .from("companies")
      .select("company_name, nuit, sector, employees_range, bio")
      .eq("id", user.id)
      .single();
    roleData = data;
  }

  return (
    <div className="container-kazigo max-w-3xl py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">O teu perfil</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Edita as tuas informações para que os clientes te encontrem melhor.
        </p>
      </div>

      {/* Foto de perfil */}
      <Card className="mb-6 flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <AvatarUploader userId={user.id} fullName={profile.full_name} avatarUrl={profile.avatar_url} />
        <div>
          <h2 className="text-lg font-semibold text-ink">{profile.full_name}</h2>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="navy">{roleLabel[profile.role] ?? profile.role}</Badge>
            {profile.city && (
              <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.city}
              </span>
            )}
            {profile.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Email verificado
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Informações básicas (read-only) */}
      <Card className="mb-6 p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Informações básicas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-ink-faint">Nome completo</p>
            <p className="text-sm font-medium text-ink">{profile.full_name}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Email</p>
            <p className="text-sm font-medium text-ink">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Tipo de conta</p>
            <Badge tone="navy" className="mt-1">
              {roleLabel[profile.role] ?? profile.role}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Informações editáveis */}
      <div id="editar-perfil" className="scroll-mt-20">
        <EditProfileForm
          userId={user.id}
          profile={profile}
          roleData={roleData}
          userRole={profile.role}
        />
      </div>
    </div>
  );
}
