import Link from "next/link";
import { Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getActiveCategoriesWithCounts } from "@/lib/categories";

export const metadata = { title: "Categorias" };
export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = createClient();
  const categories = await getActiveCategoriesWithCounts(supabase);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Categorias</h1>
        <p className="text-sm text-ink-faint">Explora todas as áreas de trabalho disponíveis na KaziGo.</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-ink-faint">Ainda não há categorias disponíveis.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/trabalhos?categoria=${encodeURIComponent(category.name)}`}
              className="group flex items-start gap-4 rounded-md border border-border bg-white p-5 transition-colors hover:border-teal-500/60 hover:shadow-card"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700 group-hover:bg-teal-50 group-hover:text-teal-600">
                <Tag className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-ink">{category.name}</p>
                <p className="mt-2 text-xs font-semibold text-teal-600">
                  {category.jobsCount} trabalho{category.jobsCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
