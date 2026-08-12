import Link from "next/link";
import {
  ArrowRight,
  Search,
  UserPlus,
  ClipboardCheck,
  Handshake,
  Hammer,
  PenTool,
  Code2,
  Truck,
  GraduationCap,
  Sparkles,
  PartyPopper,
  SprayCan,
  Calculator,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { JobCard } from "@/components/marketplace/JobCard";
import { WorkerCard } from "@/components/marketplace/WorkerCard";
import { categories, jobs, workers } from "@/data/mock";

const categoryIcons: Record<string, LucideIcon> = {
  Hammer,
  PenTool,
  Code2,
  Truck,
  GraduationCap,
  Sparkles,
  PartyPopper,
  SprayCan,
  Calculator,
  Sprout,
};

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

export default function HomePage() {
  const featuredJobs = jobs.filter((job) => job.featured);
  const featuredWorkers = workers.slice(0, 3);
  const popularCategories = categories.slice(0, 8);

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
            Encontra. Trabalha. <span className="text-teal-400">Ganha.</span>
          </h1>
          <p className="max-w-xl text-base text-navy-100 sm:text-lg">
            A plataforma que conecta profissionais, trabalhadores, freelancers, empresas e clientes em
            Moçambique.
          </p>

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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((category) => {
              const Icon = categoryIcons[category.icon] ?? Hammer;
              return (
                <Link
                  key={category.id}
                  href={`/categorias?cat=${category.slug}`}
                  className="group flex flex-col gap-3 rounded-md border border-border bg-white p-5 transition-colors hover:border-teal-500/60 hover:shadow-card"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-50 text-navy-700 group-hover:bg-teal-50 group-hover:text-teal-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{category.name}</p>
                    <p className="text-xs text-ink-faint">{category.jobsCount} trabalhos</p>
                  </div>
                </Link>
              );
            })}
          </div>
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <Link href="/trabalhos" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-navy-700 sm:hidden">
            Ver todos os trabalhos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Trabalhadores em destaque */}
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
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>

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
