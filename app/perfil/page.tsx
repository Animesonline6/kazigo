import { BadgeCheck, MapPin, Briefcase } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RatingStars } from "@/components/marketplace/atoms";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { workers } from "@/data/mock";

export const metadata = { title: "Perfil" };

export default function PerfilPage({ searchParams }: { searchParams: { id?: string } }) {
  const worker = workers.find((w) => w.id === searchParams.id) ?? workers[0];

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={worker.name} size="xl" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold">{worker.name}</h1>
              {worker.verified && <BadgeCheck className="h-5 w-5 text-teal-500" aria-label="Verificado" />}
            </div>
            <p className="text-sm text-ink-soft">{worker.headline}</p>
            <div className="mt-1 flex items-center gap-3 text-sm text-ink-faint">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {worker.location.city}
              </span>
              <RatingStars rating={worker.rating} reviewsCount={worker.reviewsCount} />
            </div>
          </div>
        </div>
        <Button>Enviar mensagem</Button>
      </Card>

      <div className="mt-8">
        <Tabs
          items={[
            {
              value: "sobre",
              label: "Sobre",
              content: (
                <div className="flex flex-col gap-4">
                  <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">{worker.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {worker.skills.map((skill) => (
                      <Badge key={skill} tone="teal">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-faint">
                    <Briefcase className="h-4 w-4" /> {worker.completedJobs} trabalhos concluídos
                  </div>
                </div>
              ),
            },
            {
              value: "portfolio",
              label: "Portefólio",
              content: (
                <EmptyState title="Sem itens no portefólio" description="Este profissional ainda não adicionou trabalhos ao portefólio." />
              ),
            },
            {
              value: "avaliacoes",
              label: "Avaliações",
              content: (
                <EmptyState title="Sem avaliações ainda" description="As avaliações de clientes aparecerão aqui." />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
