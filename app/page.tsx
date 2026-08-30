import Link from "next/link";
import {
  ArrowRight,
  Search,
  UserPlus,
  ClipboardCheck,
  Handshake,
  Tag,
  Users,
  MapPin,
  Wifi,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/server";
import { getActiveCategoriesWithCounts } from "@/lib/categories";

const steps = [
  {
    icon: UserPlus,
    title: "Cria o teu perfil",
    description: "Regista-te como profissional ou cliente em poucos minutos, sem burocracia.",
  },
  {
    icon: Search,
    title: "Encontra a oportunidade certa",
    description: "Pesquisa trabalhos por categoria, localização ou orçamento até encontrares o ideal.",
  },
  {
    icon: ClipboardCheck,
    title: "Candidata-te ou publica",
    description: "Envia a tua proposta, ou publica o trabalho e recebe candidaturas de profissionais.",
  },
  {
    icon: Handshake,
    title: "Trabalha e recebe",
    description: "Combina os detalhes com confiança e conclui o trabalho com o cliente ou profissional.",
  },
];

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return "A combinar";
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MTn`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoje";
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let firstName: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    firstName = profile?.full_name?.split(" ")[0] || null;
  }

  const { data: featuredJobs } = await supabase
    .from("jobs")
    .select("id, title, description, category, city, remote, budget_min, budget_max, applications_count, created_at")
    .eq("status", "aberto")
    .eq("approval_status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(6);

  const allCategories = await getActiveCategoriesWithCounts(supabase);
  const popularCategories = [...allCategories].sort((a, b) => b.jobsCount - a.jobsCount).slice(0, 8);

  // "Trabalhadores em destaque": só quem tem avaliações reais — nunca
  // gente com 0 avaliações a fingir destaque.
  const { data: topWorkerProfiles } = await supabase
    .from("worker_profiles")
    .select("id, headline, skills, rating, reviews_count")
    .gt("reviews_count", 0)
    .order("rating", { ascending: false })
    .order("reviews_count", { ascending: false })
    .limit(3);

  let featuredWorkers: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    headline: string | null;
    skills: string[];
    rating: number;
    reviews_count: number;
  }[] = [];

  if (topWorkerProfiles && topWorkerProfiles.length > 0) {
    const ids = topWorkerProfiles.map((w) => w.id);
    const { data: peopleProfiles } = await supabase.from("profiles").select("id, full_name, avatar_url, city").in("id", ids);
    const peopleById = Object.fromEntries((peopleProfiles ?? []).map((p) => [p.id, p]));

    featuredWorkers = topWorkerProfiles.map((w) => ({
      id: w.id,
      full_name: peopleById[w.id]?.full_name ?? null,
      avatar_url: peopleById[w.id]?.avatar_url ?? null,
      city: peopleById[w.id]?.city ?? null,
      headline: w.headline,
      skills: (w.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      rating: w.rating,
      reviews_count: w.reviews_count,
    }));
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-700">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-kazigo relative flex flex-col items-center gap-7 py-20 text-center sm:py-28">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {firstName ? (
              <>
                Bem-vindo de volta, <span className="text-teal-400">{firstName}</span>.
              </>
            ) : (
              <>
                Encontra. Trabalha. <span className="text-teal-400">Ganha.</span>
              </>
            )}
          </h1>
          <p className="max-w-xl text-base text-navy-100 sm:text-lg">
            {firstName
              ? "Vê os trabalhos mais recentes ou continua de onde ficaste."
              : "A plataforma que conecta profissionais, trabalhadores, freelancers, empresas e clientes em Moçambique."}
          </p>

          {firstName ? (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  Ir para o meu dashboard
                </Button>
              </Link>
              <Link href="/trabalhos">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white">
                  Ver trabalhos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <SearchInput placeholder="Que trabalho procuras? Ex: eletricista, design..." />
                </div>
                <Button size="lg" className="shrink-0">
                  Pesquisar
                </Button>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link href="/trabalhos">
                  <Button size="lg" variant="secondary">
                    Encontrar trabalhos
                  </Button>
                </Link>
                <Link href="/registar">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white">
                    Começar a trabalhar
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categorias populares */}
      <section className="py-16 sm:py-20">
        <div className="container-kazigo">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Categorias populares</h2>
              <p className="mt-1 text-sm text-ink-faint">Explora as áreas com mais oportunidades agora.</p>
            </div>
            <Link href="/categorias" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 hover:text-teal-600 sm:flex">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {popularCategories.length === 0 ? (
            <p className="text-sm text-ink-faint">Ainda não há categorias disponíveis.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {popularCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/trabalhos?categoria=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col gap-3 rounded-md border border-border bg-white p-5 transition-colors hover:border-teal-500/60 hover:shadow-card"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-50 text-navy-700 group-hover:bg-teal-50 group-hover:text-teal-600">
                    <Tag className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{category.name}</p>
                    <p className="text-xs text-ink-faint">{category.jobsCount} trabalhos</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trabalhos em destaque */}
      <section className="bg-surface-subtle py-16 sm:py-20">
        <div className="container-kazigo">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Trabalhos em destaque</h2>
              <p className="mt-1 text-sm text-ink-faint">Oportunidades recentes à espera de candidatos.</p>
            </div>
            <Link href="/trabalhos" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 hover:text-teal-600 sm:flex">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {!featuredJobs || featuredJobs.length === 0 ? (
            <p className="rounded-md border border-dashed border-border bg-white py-10 text-center text-sm text-ink-faint">
              Ainda não há trabalhos publicados. Sê o primeiro a publicar uma oportunidade.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="flex flex-col gap-3 p-5 hover:border-teal-500/60 hover:shadow-elevated">
                  <Link href={`/trabalhos/${job.id}`} className="text-base font-semibold text-ink hover:text-navy-700">
                    {job.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
                    {job.remote ? (
                      <span className="inline-flex items-center gap-1">
                        <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                        Remoto
                      </span>
                    ) : job.city ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.city}
                      </span>
                    ) : null}
                    <span aria-hidden="true">·</span>
                    <Badge tone="navy">{job.category}</Badge>
                  </div>

                  <p className="line-clamp-2 text-sm text-ink-soft">{job.description}</p>

                  <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-semibold text-ink">
                      {formatBudget(job.budget_min, job.budget_max)}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-ink-faint">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.applications_count}
                      </span>
                      <span>{formatRelative(job.created_at)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Link href="/trabalhos" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-navy-700 sm:hidden">
            Ver todos os trabalhos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Trabalhadores em destaque — só aparece quando há gente com avaliações reais */}
      {featuredWorkers.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-kazigo">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Trabalhadores em destaque</h2>
                <p className="mt-1 text-sm text-ink-faint">Profissionais bem avaliados prontos para ajudar.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredWorkers.map((worker) => (
                <Link
                  key={worker.id}
                  href={`/trabalhadores/${worker.id}`}
                  className="flex flex-col gap-4 rounded-md border border-border bg-white p-5 transition-colors hover:border-teal-500/60 hover:shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={worker.full_name || "Trabalhador"} src={worker.avatar_url ?? undefined} size="lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{worker.full_name || "Trabalhador"}</p>
                      {worker.headline && <p className="text-sm text-ink-soft">{worker.headline}</p>}
                      {worker.city && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-faint">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {worker.city}
                        </span>
                      )}
                    </div>
                  </div>

                  {worker.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {worker.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} tone="teal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 border-t border-border pt-3 text-sm">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" aria-hidden="true" />
                    <span className="font-semibold text-ink">{worker.rating.toFixed(1)}</span>
                    <span className="text-ink-faint">({worker.reviews_count} avaliações)</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Como funciona */}
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-kazigo">
          <div className="mb-10 max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Como funciona</h2>
            <p className="mt-2 text-sm text-navy-100">
              Quatro passos simples para começar a encontrar ou oferecer trabalho na KaziGo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3 rounded-md border border-white/10 bg-white/5 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-teal-500 text-white">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-navy-200">Passo {index + 1}</p>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-navy-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 sm:py-20">
        <div className="container-kazigo">
          <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-surface-subtle px-6 py-14 text-center">
            <h2 className="max-w-lg text-2xl font-bold sm:text-3xl">
              Pronto para começar a ganhar com o teu talento?
            </h2>
            <p className="max-w-md text-sm text-ink-faint">
              Junta-te a milhares de moçambicanos que já usam a KaziGo para encontrar trabalho e talento.
            </p>
            <Link href="/registar">
              <Button size="lg">Criar conta gratuita</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
