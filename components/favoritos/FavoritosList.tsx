"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteJobCard, type FavoriteJob } from "@/components/favoritos/FavoriteJobCard";
import { FavoriteWorkerCard, type FavoriteWorker } from "@/components/favoritos/FavoriteWorkerCard";

export function FavoritosList({
  userId,
  initialJobs,
  initialWorkers,
}: {
  userId: string;
  initialJobs: FavoriteJob[];
  initialWorkers: FavoriteWorker[];
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [workers, setWorkers] = useState(initialWorkers);

  function handleJobRemoved(jobId: string) {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  function handleWorkerRemoved(workerId: string) {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
  }

  return (
    <Tabs
      items={[
        {
          value: "trabalhos",
          label: "Trabalhos",
          content:
            jobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <FavoriteJobCard key={job.id} job={job} userId={userId} onRemoved={handleJobRemoved} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="Sem trabalhos favoritos"
                description="Guarda trabalhos que te interessem para os encontrares facilmente depois."
              />
            ),
        },
        {
          value: "trabalhadores",
          label: "Trabalhadores",
          content:
            workers.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {workers.map((worker) => (
                  <FavoriteWorkerCard key={worker.id} worker={worker} userId={userId} onRemoved={handleWorkerRemoved} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="Sem trabalhadores favoritos"
                description="Guarda trabalhadores que te interessem, a partir do perfil deles."
              />
            ),
        },
      ]}
    />
  );
}
