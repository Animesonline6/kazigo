import { LucideIcon, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  value?: number | string | null;
  growthPercent?: number | null;
  loading?: boolean;
  error?: string | null;
  /** Quando a funcionalidade ainda não tem dados/tabela real ligada */
  unavailable?: boolean;
  unavailableReason?: string;
}

export function StatCard({
  icon: Icon,
  label,
  description,
  value,
  growthPercent,
  loading,
  error,
  unavailable,
  unavailableReason,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>

      {loading ? (
        <>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </>
      ) : error ? (
        <div className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Erro ao carregar
        </div>
      ) : unavailable ? (
        <>
          <p className="text-lg font-bold text-ink-faint">—</p>
          <p className="text-xs text-ink-faint">{label}</p>
          {unavailableReason && <p className="text-[11px] text-ink-faint">{unavailableReason}</p>}
        </>
      ) : (
        <>
          <p className="text-xl font-bold text-ink">{value}</p>
          <p className="text-xs text-ink-faint">{label}</p>
          {description && <p className="text-[11px] text-ink-faint">{description}</p>}
          {growthPercent !== undefined && growthPercent !== null && (
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                growthPercent >= 0 ? "bg-green-50 text-success" : "bg-red-50 text-danger"
              )}
            >
              {growthPercent >= 0 ? (
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3 w-3" aria-hidden="true" />
              )}
              {growthPercent >= 0 ? "+" : ""}
              {growthPercent.toFixed(0)}%
            </span>
          )}
        </>
      )}
    </Card>
  );
}
