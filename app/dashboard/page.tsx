import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, Zap, Heart, MessageSquare, Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const roleLabel = {
  worker: "Trabalhador",
  client: "Cliente",
  company: "Empresa",
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  // Fetch o perfil do utilizador
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  // Fetch dados adicionais consoante o rol
  let roleData: any = null;
  if (profile.role === "worker") {
    const { data } = await supabase
      .from("worker_profiles")
      .select("headline, hourly_rate, rating")
      .eq("id", user.id)
      .single();
    roleData = data;
  } else if (profile.role === "company") {
    const { data } = await supabase
      .from("companies")
      .select("company_name, nuit, sector")
      .eq("id", user.id)
      .single();
    roleData = data;
  }

  // Fetch contagem de candidaturas (se worker) ou trabalhos publicados (se cliente)
  let stats = { count: 0, label: "" };
  if (profile.role === "worker") {
    const { count } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("worker_id", user.id);
    stats = { count: count ?? 0, label: "Candidaturas" };
  } else {
    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("client_id", user.id);
    stats = { count: count ?? 0, label: "Trabalhos publicados" };
  }

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-ink-faint">{profile.full_name}</p>
      </div>

      {/* Card de perfil resumido */}
      <Card className="mb-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-ink-faint">{profile.email}</p>
            {profile.city && <p className="text-sm text-ink-soft">📍 {profile.city}</p>}
            {roleData?.headline && <p className="text-sm text-ink-soft italic">{roleData.headline}</p>}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Badge tone="navy">{roleLabel[profile.role as keyof typeof roleLabel]}</Badge>
            {roleData?.rating && (
              <p className="text-sm font-semibold text-ink">
                ⭐ {roleData.rating.toFixed(1)} avaliações
              </p>
            )}
            {roleData?.hourly_rate && (
              <p className="text-sm text-ink-soft">
                {roleData.hourly_rate.toLocaleString("pt-PT")} MTn/hora
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-faint">{stats.label}</p>
            <p className="text-2xl font-bold">{stats.count}</p>
          </div>
          {profile.role === "worker" ? (
            <MessageSquare className="h-10 w-10 text-teal-500/20" />
          ) : (
            <Briefcase className="h-10 w-10 text-teal-500/20" />
          )}
        </div>
      </Card>

      {/* Ações rápidas */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold">Ações rápidas</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.role !== "worker" && (
            <Link href="/trabalhos/publicar">
              <Button fullWidth variant="outline">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                Publicar trabalho
              </Button>
            </Link>
          )}
          <Link href="/trabalhos">
            <Button fullWidth variant="outline">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Ver trabalhos
            </Button>
          </Link>
          {profile.role === "worker" && (
            <Link href="/candidaturas">
              <Button fullWidth variant="outline">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Minhas candidaturas
              </Button>
            </Link>
          )}
          <Link href="/favoritos">
            <Button fullWidth variant="outline">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Favoritos
            </Button>
          </Link>
        </div>
      </div>

      {/* Link para perfil */}
      <Card className="p-4 text-center">
        <Link href="/perfil">
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Editar perfil
          </Button>
        </Link>
      </Card>
    </div>
  );
}
