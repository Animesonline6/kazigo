import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "navy" | "teal" | "orange" | "neutral";
}

const toneStyles: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  navy: "bg-navy-50 text-navy-700",
  teal: "bg-teal-50 text-teal-700",
  orange: "bg-orange-50 text-orange-700",
  neutral: "bg-surface-muted text-ink-soft",
};

export function StatsCard({ label, value, icon: Icon, tone = "navy" }: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 sm:p-5">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm",
          toneStyles[tone]
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-ink sm:text-2xl">{value}</p>
        <p className="truncate text-xs text-ink-faint">{label}</p>
      </div>
    </Card>
  );
}
