"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SearchInput, Select } from "@/components/ui/Input";
import { JobCard } from "@/components/marketplace/JobCard";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { jobs as allJobs, categories } from "@/data/mock";

const PAGE_SIZE = 6;

export default function TrabalhosPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [loading] = useState(false); // reserved for future async fetch state

  const filtered = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryId ? job.categoryId === categoryId : true;
      return matchesQuery && matchesCategory;
    });
  }, [query, categoryId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Trabalhos disponíveis</h1>
        <p className="text-sm text-ink-faint">{filtered.length} oportunidades encontradas em Moçambique.</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput
            placeholder="Pesquisar por título..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="sm:w-64">
          <Select
            placeholder="Todas as categorias"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrar por categoria"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="Nenhum trabalho encontrado"
          description="Tenta alterar os filtros ou pesquisar por outra palavra-chave."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
        </>
      )}
    </div>
  );
}
