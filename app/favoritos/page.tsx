"use client";

import { Heart } from "lucide-react";
import { JobCard } from "@/components/marketplace/JobCard";
import { WorkerCard } from "@/components/marketplace/WorkerCard";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobs, workers } from "@/data/mock";

export default function FavoritosPage() {
  const favoriteJobs = jobs.slice(0, 2);
  const favoriteWorkers = workers.slice(0, 2);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Favoritos</h1>

      <Tabs
        items={[
          {
            value: "trabalhos",
            label: "Trabalhos",
            content: favoriteJobs.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Heart} title="Sem trabalhos favoritos" description="Guarda trabalhos que te interessem para os encontrares facilmente depois." />
            ),
          },
          {
            value: "trabalhadores",
            label: "Trabalhadores",
            content: favoriteWorkers.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Heart} title="Sem trabalhadores favoritos" description="Guarda os perfis de profissionais que gostarias de contratar novamente." />
            ),
          },
        ]}
      />
    </div>
  );
}
