import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AlertCircle, BarChart3 } from "lucide-react";

export function ChartCard({
  title,
  actions,
  loading,
  error,
  empty,
  emptyMessage = "Ainda não há dados suficientes para mostrar este gráfico.",
  children,
}: {
  title: string;
  actions?: ReactNode;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {actions}
      </div>

      {loading ? (
        <Skeleton className="h-56 w-full" />
      ) : error ? (
        <div className="flex h-56 flex-col items-center justify-center gap-2 text-center text-sm text-danger">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
          Não foi possível carregar este gráfico.
        </div>
      ) : empty ? (
        <div className="flex h-56 flex-col items-center justify-center gap-2 text-center text-sm text-ink-faint">
          <BarChart3 className="h-6 w-6" aria-hidden="true" />
          {emptyMessage}
        </div>
      ) : (
        <div className="h-56 w-full">{children}</div>
      )}
    </Card>
  );
}
