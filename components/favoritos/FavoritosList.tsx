"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteJobCard, type FavoriteJob } from "@/components/favoritos/FavoriteJobCard";

export function FavoritosList({ userId, initialJobs }: { userId: string; initialJobs: FavoriteJob[] }) {
  const [jobs, setJobs] = useState(initialJobs);

  function handleRemoved(jobId: string) {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
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
                  <FavoriteJobCard key={job.id} job={job} userId={userId} onRemoved={handleRemoved} />
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
          content: (
            <EmptyState
              icon={Heart}
              title="Ainda não disponível"
              description="Favoritar trabalhadores vai chegar numa próxima atualização."
            />
          ),
        },
      ]}
    />
  );
}
